
"use client";

import { FormEvent, useState, useRef, useEffect } from 'react';
import './style.css'
import axios, { AxiosRequestConfig } from 'axios';
import Image from 'next/image'
import { playBitByBit,play } from '../(utilities)/utils';


// const serverUrl:string = "/api/get-audio-stream" 
// const serverUrl:string = "http://localhost:8000/generate" 
const serverUrl:string = "http://ec2-16-170-254-118.eu-north-1.compute.amazonaws.com/generate" 

export default function TTS() {
  const [text, setText] = useState(
    "The young entrepreneur's eyes sparkled with determination as she launched her sustainable fashion brand. With a focus on eco-friendly materials and ethical production practices, she aimed to revolutionize the industry. Her passion and dedication inspired a new generation of consumers."
    // "The young entrepreneur's eyes sparkled with determination as she launched her sustainable fashion brand. With a focus on eco-friendly materials and ethical production practices, she aimed to revolutionize the industry. Her passion and dedication inspired a new generation of consumers to embrace responsible fashion, making a positive impact on the planet. As her brand grew, she collaborated with influencers and designers who shared her vision. Together, they created stunning pieces that not only made a statement but also reduced waste and supported fair labor practices. Her brand became synonymous with style and sustainability, appealing to consumers who cared about the environment and social justice."
    // "The young entrepreneur's eyes sparkled with determination as she launched her sustainable fashion brand. With a focus on eco-friendly materials and ethical production practices, she aimed to revolutionize the industry. Her passion and dedication inspired a new generation of consumers to embrace responsible fashion, making a positive impact on the planet. As her brand grew, she collaborated with influencers and designers who shared her vision."
  );
  const [audioSrc, setAudioSrc] = useState('');
  const [fetchingAudioState, setFetchingAudioState] = useState<boolean | null>(false);
  const [sourceAudio, setSourceAudio] = useState<AudioBufferSourceNode | null>();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  const config: AxiosRequestConfig<{}> = {
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'audio/wav'
    }
  };

  async function fetchAudio() {

    const start = new Date().getTime();

    setFetchingAudioState(true)

    // handleTextToSpeech("The young entrepreneur's eyes sparkled with determination as she launched her sustainable fashion brand. With a focus on eco-friendly materials and ethical production practices, she aimed to revolutionize the industry. Her passion and dedication inspired a new generation of consumers to embrace responsible fashion, making a positive impact on the planet. As her brand grew, she collaborated with influencers and designers who shared her vision. Together, they created stunning pieces that not only made a statement but also reduced waste and supported fair labor practices. Her brand became synonymous with style and sustainability, appealing to consumers who cared about the environment and social justice.")
    
    // // playTTS("The young entrepreneur's eyes sparkled with determination as she launched her sustainable fashion brand. With a focus on eco-friendly materials and ethical production practices, she aimed to revolutionize the industry. Her passion and dedication inspired a new generation of consumers to embrace responsible fashion, making a positive impact on the planet. As her brand grew, she collaborated with influencers and designers who shared her vision. Together, they created stunning pieces that not only made a statement but also reduced waste and supported fair labor practices. Her brand became synonymous with style and sustainability, appealing to consumers who cared about the environment and social justice.")
    
    //   await playBitByBit(
    //     text
    //     // "The young entrepreneur's eyes sparkled with determination as she launched her sustainable fashion brand. With a focus on eco-friendly materials and ethical production practices, she aimed to revolutionize the industry. Her passion and dedication inspired a new generation of consumers to embrace responsible fashion, making a positive impact on the planet. As her brand grew, she collaborated with influencers and designers who shared her vision. Together, they created stunning pieces that not only made a statement but also reduced waste and supported fair labor practices. Her brand became synonymous with style and sustainability, appealing to consumers who cared about the environment and social justice."
    //   ,
    //   50
    // )
    
      await play(
        text
        // "The young entrepreneur's eyes sparkled with determination as she launched her sustainable fashion brand. With a focus on eco-friendly materials and ethical production practices, she aimed to revolutionize the industry. Her passion and dedication inspired a new generation of consumers to embrace responsible fashion, making a positive impact on the planet. As her brand grew, she collaborated with influencers and designers who shared her vision. Together, they created stunning pieces that not only made a statement but also reduced waste and supported fair labor practices. Her brand became synonymous with style and sustainability, appealing to consumers who cared about the environment and social justice."
      ,
      80
    )
      setFetchingAudioState(false)
   
      return
    setFetchingAudioState(true)

    try {
      const response = await fetch(
        serverUrl
        // '/api/get-audio-stream',
        // "http://ec2-16-170-254-118.eu-north-1.compute.amazonaws.com/generate"
        , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 
          //text
           "In the 16th century, an age of great marine and terrestrial exploration, Ferdinand Magellan led the first expedition to sail around the world. As a young Portuguese noble, he served the king of Portugal, but he became involved in the quagmire of political intrigue at court and lost the king’s favor. After he was dismissed from service by the king of Portugal, he offered to serve the future Emperor Charles V of Spain.A papal decree of 1493 had assigned all land in the New World west of 50 degrees W longitude to Spain and all the land east of that line to Portugal. Magellan offered to prove that the East Indies fell under Spanish authority. On September 20, 1519, Magellan set sail from Spain with five ships. More than a year later, one of these ships was exploring the topography of South America in search of a water route across the continent. This ship sank, but the remaining four ships searched along the southern peninsula of South America. Finally they found the passage they sought near 50 degrees S latitude. Magellan named this passage the Strait of All Saints, but today it is known as the Strait of Magellan.One ship deserted while in this passage and returned to Spain, so fewer sailors were privileged to gaze at that first panorama of the Pacific Ocean."
        })
      });

      setFetchingAudioState(false)


      console.log("request done");

      const arrayBuffer = await response.arrayBuffer();
      // Play audio using Web Audio API
      // const audioContext = new (window.AudioContext)();

      // const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      // const sourceAudio = audioContext.createBufferSource();
      // sourceAudio.buffer = audioBuffer;
      // sourceAudio.connect(audioContext.destination);
      // console.log("connected audio");

      // sourceAudio.start(0);
      // source.stop()

      const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      console.log("Blob URL created:", url);
      setAudioSrc(url);

      audioRef.current?.play();
      console.log("SRC AUDIO ", audioSrc);


      const end = new Date().getTime();
      const executionTime = end - start;
      console.log(`m Execution time: ${executionTime / 1000}ms`);


    } catch (e) {
      console.log("errrrrrr ", e);
      setFetchingAudioState(false)
      const end = new Date().getTime();
      const executionTime = end - start;
      console.log(`m Execution time: ${executionTime / 1000}ms`);
    }

  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetchAudio()
  };


  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && audioRef.current != null) {
      audioRef.current?.play();
    }
  }, [audioSrc]);

  return (
    <div className='main'>
      <h1>Text-to-Speech</h1>
      <form onSubmit={
        handleSubmit
      }>
        <br />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          cols={60}
          placeholder="Enter text to synthesize"
          className='textarea-deco'
          maxLength={300}
        />

        <br />
        <br />

        <button type="submit" className='generate-speech-button'> {
          fetchingAudioState !== true ?
            <div>Generate Speech</div>
            :
            <div style={{
              padding: '0px 54px'
            }}>
              <svg fill='white' width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" rx="1" width="10" height="10"><animate id="spinner_c7A9" begin="0;spinner_23zP.end" attributeName="x" dur="0.2s" values="1;13" fill="freeze" /><animate id="spinner_Acnw" begin="spinner_ZmWi.end" attributeName="y" dur="0.2s" values="1;13" fill="freeze" /><animate id="spinner_iIcm" begin="spinner_zfQN.end" attributeName="x" dur="0.2s" values="13;1" fill="freeze" /><animate id="spinner_WX4U" begin="spinner_rRAc.end" attributeName="y" dur="0.2s" values="13;1" fill="freeze" /></rect><rect x="1" y="13" rx="1" width="10" height="10"><animate id="spinner_YLx7" begin="spinner_c7A9.end" attributeName="y" dur="0.2s" values="13;1" fill="freeze" /><animate id="spinner_vwnJ" begin="spinner_Acnw.end" attributeName="x" dur="0.2s" values="1;13" fill="freeze" /><animate id="spinner_KQuy" begin="spinner_iIcm.end" attributeName="y" dur="0.2s" values="1;13" fill="freeze" /><animate id="spinner_arKy" begin="spinner_WX4U.end" attributeName="x" dur="0.2s" values="13;1" fill="freeze" /></rect><rect x="13" y="13" rx="1" width="10" height="10"><animate id="spinner_ZmWi" begin="spinner_YLx7.end" attributeName="x" dur="0.2s" values="13;1" fill="freeze" /><animate id="spinner_zfQN" begin="spinner_vwnJ.end" attributeName="y" dur="0.2s" values="13;1" fill="freeze" /><animate id="spinner_rRAc" begin="spinner_KQuy.end" attributeName="x" dur="0.2s" values="1;13" fill="freeze" /><animate id="spinner_23zP" begin="spinner_arKy.end" attributeName="y" dur="0.2s" values="1;13" fill="freeze" /></rect></svg>
            </div>
        }</button>
      </form>
      <br />
      {audioSrc && <audio     
        ref={audioRef}
        src={audioSrc} controls itemType='audio/mp3' />}

      <br />

    </div>
  );
}
