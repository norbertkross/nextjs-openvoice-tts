import React, { useRef, useState, useEffect } from 'react';
import './custom_palyer_style.css';

export default function CustomAudioPlayer() {
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(currentProgress);
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleProgressClick = (e) => {
    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newTime = (offsetX / rect.width) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  useEffect(() => {
    const updateDuration = () => setDuration(audioRef.current.duration);
    audioRef.current.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audioRef.current.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src="path_to_your_audio_file.mp3"
        onTimeUpdate={handleTimeUpdate}
      ></audio>
      <button onClick={handlePlayPause} className="play-pause-button">
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <div className="time-display">{formatTime(currentTime)} / {formatTime(duration)}</div>
      <div
        ref={progressBarRef}
        className="progress-bar"
        onClick={handleProgressClick}
      >
        <div
          className="progress"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="volume-slider"
      />
    </div>
  );
}
