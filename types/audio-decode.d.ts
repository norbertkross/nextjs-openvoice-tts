// types/audio-decode.d.ts
declare module 'audio-decode' {
    type AudioDecodeOptions = {
      sampleRate?: number;
    };
  
    export default function audioDecode(
      arrayBuffer: ArrayBuffer,
      options?: AudioDecodeOptions
    ): Promise<AudioBuffer>;
  }
  