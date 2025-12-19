import { Blob } from "@google/genai";
import { logger } from './loggerService';

// --- Audio Encoding/Decoding Utilities ---
// These are specifically implemented to handle raw PCM data streams as required by the Live API.

/**
 * Decodes a base64 string into a Uint8Array.
 * @param base64 The base64 encoded string.
 * @returns The decoded byte array.
 */
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encodes a Uint8Array into a base64 string.
 * @param bytes The byte array to encode.
 * @returns The base64 encoded string.
 */
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decodes raw PCM audio data into an AudioBuffer for playback.
 * The browser's native `decodeAudioData` is for file formats (like .wav), not raw streams.
 * @param data Raw PCM audio data as a Uint8Array.
 * @param ctx The AudioContext to use for creating the buffer.
 * @param sampleRate The sample rate of the audio (e.g., 24000 for Gemini output).
 * @param numChannels The number of audio channels (typically 1).
 * @returns A promise that resolves to an AudioBuffer.
 */
async function decodePcmAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0; // Convert to Float32 [-1.0, 1.0]
    }
  }
  return buffer;
}


class AudioService {
  private static instance: AudioService;

  private inputAudioContext?: AudioContext;
  private outputAudioContext: AudioContext;
  
  private stream?: MediaStream;
  private sourceNode?: MediaStreamAudioSourceNode;
  private processorNode?: ScriptProcessorNode;
  
  private outputNode: GainNode;
  private activeSources = new Set<AudioBufferSourceNode>();
  private nextStartTime = 0;

  private constructor() {
    this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    this.outputNode = this.outputAudioContext.createGain();
    this.outputNode.connect(this.outputAudioContext.destination);
    logger.info("AudioService initialized", "AudioService");
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  /**
   * Starts capturing audio from the microphone and processing it.
   * @param onProcess Callback function to handle the processed audio blob.
   */
  public async startMicrophone(onProcess: (blob: Blob) => void): Promise<void> {
    if (this.inputAudioContext) {
        logger.warn("Microphone already active", "AudioService");
        return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      this.sourceNode = this.inputAudioContext.createMediaStreamSource(this.stream);
      this.processorNode = this.inputAudioContext.createScriptProcessor(4096, 1, 1);

      this.processorNode.onaudioprocess = (event: AudioProcessingEvent) => {
        const inputData = event.inputBuffer.getChannelData(0);
        const pcmBlob = this.createPcmBlob(inputData);
        onProcess(pcmBlob);
      };

      this.sourceNode.connect(this.processorNode);
      this.processorNode.connect(this.inputAudioContext.destination);
      logger.info("Microphone capture started", "AudioService");

    } catch (error) {
      logger.error("Failed to start microphone", "AudioService", error);
      throw error;
    }
  }

  /**
   * Stops capturing audio from the microphone.
   */
  public stopMicrophone(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    this.sourceNode?.disconnect();
    this.processorNode?.disconnect();
    this.inputAudioContext?.close();

    this.stream = undefined;
    this.sourceNode = undefined;
    this.processorNode = undefined;
    this.inputAudioContext = undefined;
    logger.info("Microphone capture stopped", "AudioService");
  }

  /**
   * Plays back base64 encoded PCM audio data from the API.
   * @param base64Audio The base64 encoded audio string.
   */
  public async playAudio(base64Audio: string): Promise<void> {
    try {
        this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
        const decodedBytes = decode(base64Audio);
        const audioBuffer = await decodePcmAudioData(decodedBytes, this.outputAudioContext, 24000, 1);

        const source = this.outputAudioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.outputNode);
        source.addEventListener('ended', () => {
            this.activeSources.delete(source);
        });
        
        source.start(this.nextStartTime);
        this.nextStartTime += audioBuffer.duration;
        this.activeSources.add(source);
    } catch (error) {
        logger.error("Failed to play audio", "AudioService", error);
    }
  }

  /**
   * Immediately stops all currently playing audio. Used for interruptions.
   */
  public interruptPlayback(): void {
    for (const source of this.activeSources.values()) {
        source.stop();
        this.activeSources.delete(source);
    }
    this.nextStartTime = 0;
    logger.info("Audio playback interrupted", "AudioService");
  }

  /**
   * Creates a PCM audio blob in the format required by the Gemini Live API.
   * @param data The raw audio data from the microphone.
   * @returns A Blob object for the API.
   */
  private createPcmBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    // Convert Float32 [-1.0, 1.0] to Int16 [-32768, 32767]
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] < 0 ? data[i] * 32768 : data[i] * 32767;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  }
}

export const audioService = AudioService.getInstance();
