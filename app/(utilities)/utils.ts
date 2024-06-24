import { rejects } from "assert";
import { List } from "postcss/lib/list";

// const serverUrl:string = "http://localhost:8000/generate" 
// const serverUrl:string = "http://ec2-16-170-254-118.eu-north-1.compute.amazonaws.com/generate" 
const serverUrl:string = "/api/get-audio-stream" 

export const splitText=(text: string, maxChunkSize: number): string[] =>{
    const regex = new RegExp(`(.{1,${maxChunkSize}})(\\s|$)`, 'g');
    const chunks = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      chunks.push(match[1].trim());
    }

    console.log("Text Chuncks: ", chunks)
    console.log("Text Chuncks Len: ", chunks.length)

    return chunks;
  }



 export const fetchTTSmulti = async(textChunks: string[]): Promise<Blob[]> =>{
    const requests = textChunks.map(chunk => 
      fetch(
        serverUrl, 
        {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: chunk }),
      }).then(response => response.blob())
    );
    return Promise.all(requests);
  }
  

export const combineAudioBlobs = async(blobs: Blob[]): Promise<AudioBuffer> =>{
    const audioContext = new (window.AudioContext)();
    const audioBuffers = await Promise.all(blobs.map(blob => blob.arrayBuffer().then(data => audioContext.decodeAudioData(data))));
    const totalLength = audioBuffers.reduce((acc, buffer) => acc + buffer.length, 0);
    const outputBuffer = audioContext.createBuffer(
      audioBuffers[0].numberOfChannels,
      totalLength,
      audioBuffers[0].sampleRate
    );
  
    let offset = 0;
    for (const buffer of audioBuffers) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        outputBuffer.getChannelData(channel).set(buffer.getChannelData(channel), offset);
      }
      offset += buffer.length;
    }
  
    return outputBuffer;
  }
  

 export const playAudioBuffer =  async (audioBuffer: AudioBuffer) =>{
    const audioContext = new (window.AudioContext)();
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
  }




// Function to fetch audio chunk from TTS endpoint
export async function fetchAudioChunk(text: string): Promise<AudioBuffer> {
    console.log("FETCH");
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const audioContext = new (window.AudioContext)();
    return await audioContext.decodeAudioData(arrayBuffer);
  }
  
 

// Function to play a single audio buffer
export function playAudioBufferSequencially(audioContext: AudioContext, audioBuffer: AudioBuffer): Promise<void> {
    
    return new Promise((resolve) => {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.addEventListener('ended', () => {
           console.log("...Playback end");
            
          return resolve()
        });
        source.start();
      });
  }
 

  export const playBitByBit = async(text:string,maxChunkLen:number =150): Promise<string>=>{

    // for (let i = 0; i < textChunks.length; i++) {
    //   const audioBuffer = await fetchAudioChunk(textChunks[i]);
    //   await playAudioBufferSequencially(audioContext, audioBuffer);
    // }



  return new Promise(async(resolve,reject) => {

    const maxChunkSize = maxChunkLen; 
    const textChunks = splitText(text, maxChunkSize);
    const audioContext = new (window.AudioContext )();

   await recursePlayer(textChunks)
   console.log(".......Done playing");
   
    resolve("ok")
    // return

    // const firstAudioBuffer = await fetchAudioChunk(textChunks[0]);

    // const firstChunkPromise = playAudioBufferSequencially(audioContext, firstAudioBuffer);
  
    // // Load remaining chunks in the background
    // const remainingBuffersPromises = textChunks.slice(1).map(fetchAudioChunk);

    // // Play the remaining chunks sequentially after the first chunk finishes
    // firstChunkPromise.then(async () => {
    //   const remainingBuffers = await Promise.all(remainingBuffersPromises);
    //   let index:number = 0
    //   for (const audioBuffer of remainingBuffers) {
    //     index = index + 1
    //     await playAudioBufferSequencially(audioContext, audioBuffer);
    //     if(index == remainingBuffers.length){
    //         return resolve(true)
    //     }
    //   }
    // }).catch(e=>{
    //     reject()
    // });
  });
}

const recursePlayer =async(allChunks:string[]): Promise<string> =>{
  return new Promise(async(resolve) => {
    if(allChunks.length > 0){
        const audioContext = new (window.AudioContext )();

        const firstAudioBuffer = await fetchAudioChunk(allChunks[0]);
    
        const firstChunkPromise = playAudioBufferSequencially(audioContext, firstAudioBuffer);

        if(allChunks.length >1){
            var nextChunk = [allChunks[1]]    
      
            // Load remaining chunks in the background
            const remainingBuffersPromises = nextChunk?.map(fetchAudioChunk);
        
            // Play the remaining chunks sequentially after the first chunk finishes
            firstChunkPromise.then(async () => {
              const remainingBuffers = await Promise.all(remainingBuffersPromises);
              let index:number = 0
              for (const audioBuffer of remainingBuffers) {
             
                await playAudioBufferSequencially(audioContext, audioBuffer);
                
              }
              
              if(allChunks.length > 0){
                allChunks.shift()
              }
              if(allChunks.length > 0){
                allChunks.shift()
              }
        
              recursePlayer(allChunks)
            }).finally(()=>{
              // resolve("DONE")
            }); 
        }else{
          resolve("DONE")
        }

    }else{
      resolve("OK")
    }
  })
  
}


export const play =async(text:string,maxChunkLen:number =150)=>{
  return new Promise(async(resolve,reject) => {
  const maxChunkSize = maxChunkLen; 
  const textChunks = splitText(text, maxChunkSize);
  const audioContext = new (window.AudioContext )();

    const firstAudioBuffer = await fetchAudioChunk(textChunks[0]);

    const firstChunkPromise = playAudioBufferSequencially(audioContext, firstAudioBuffer);
  
    // Load remaining chunks in the background
    const remainingBuffersPromises = textChunks.slice(1).map(fetchAudioChunk);

    // Play the remaining chunks sequentially after the first chunk finishes
    firstChunkPromise.then(async () => {
      const remainingBuffers = await Promise.all(remainingBuffersPromises);
      let index:number = 0
      for (const audioBuffer of remainingBuffers) {
        index = index + 1
        await playAudioBufferSequencially(audioContext, audioBuffer);
        if(index == remainingBuffers.length){
            return resolve("OK")
        }
      }
    }).catch(e=>{
        reject()
    });

  })
}