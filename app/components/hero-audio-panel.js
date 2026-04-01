"use client";

import { useEffect, useRef, useState } from "react";

const BAR_COUNT = 48;

function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) {
    return "00:00";
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function HeroAudioPanel() {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const frequencyDataRef = useRef(null);
  const lastVolumeRef = useRef(0.72);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(72);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return null;
    }

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const nextWidth = Math.floor(width * dpr);
    const nextHeight = Math.floor(height * dpr);

    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return null;
    }

    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    return { context, width, height };
  };

  const drawVisualizer = (timestamp = 0) => {
    const drawingState = resizeCanvas();

    if (!drawingState) {
      return;
    }

    const { context, width, height } = drawingState;
    const analyser = analyserRef.current;
    const frequencyData = frequencyDataRef.current;
    const isActive = Boolean(audioRef.current && !audioRef.current.paused);
    const gap = 6;
    const barWidth = Math.max((width - gap * (BAR_COUNT - 1)) / BAR_COUNT, 2);
    const centerY = height / 2;
    const maxBarHeight = Math.max(height - 32, 40);
    const gradient = context.createLinearGradient(0, 0, 0, height);

    gradient.addColorStop(0, "rgba(255, 255, 255, 0.96)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0.22)");

    context.clearRect(0, 0, width, height);
    context.fillStyle = "rgba(255, 255, 255, 0.05)";
    context.fillRect(0, centerY, width, 1);

    if (isActive && analyser && frequencyData) {
      analyser.getByteFrequencyData(frequencyData);
    }

    for (let index = 0; index < BAR_COUNT; index += 1) {
      const x = index * (barWidth + gap);
      let magnitude = 0.12 + ((Math.sin(timestamp * 0.0022 + index * 0.65) + 1) * 0.045);

      if (isActive && frequencyData) {
        const bucket = Math.floor((index / BAR_COUNT) * frequencyData.length);
        magnitude = clamp(frequencyData[bucket] / 255, 0.08, 1);
      }

      const barHeight = Math.max(maxBarHeight * magnitude * 0.7, 14);
      const y = centerY - barHeight / 2;

      context.fillStyle = gradient;
      context.fillRect(x, y, barWidth, barHeight);
    }
  };

  const startVisualizer = () => {
    cancelAnimationFrame(animationRef.current);

    const render = (timestamp) => {
      drawVisualizer(timestamp);

      if (audioRef.current && !audioRef.current.paused) {
        animationRef.current = requestAnimationFrame(render);
      }
    };

    animationRef.current = requestAnimationFrame(render);
  };

  const stopVisualizer = () => {
    cancelAnimationFrame(animationRef.current);
    drawVisualizer(performance.now());
  };

  const ensureAudioGraph = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (!audioContextRef.current) {
      const AudioContextConstructor =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextConstructor) {
        throw new Error("Web Audio API unsupported");
      }

      const audioContext = new AudioContextConstructor();
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.86;

      const source = audioContext.createMediaElementSource(audio);

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
      frequencyDataRef.current = new Uint8Array(analyser.frequencyBinCount);
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }
  };

  const handleVolumeChange = (event) => {
    const audio = audioRef.current;
    const nextVolume = Number(event.target.value);

    setVolume(nextVolume);

    if (!audio) {
      return;
    }

    audio.volume = nextVolume / 100;

    if (nextVolume <= 0) {
      audio.muted = true;
      setIsMuted(true);
      return;
    }

    audio.muted = false;
    setIsMuted(false);
    lastVolumeRef.current = nextVolume / 100;
  };

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      try {
        await ensureAudioGraph();
        await audio.play();
      } catch (error) {
        console.error(error);
      }
    } else {
      audio.pause();
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.muted || volume === 0) {
      const restoredVolume = Math.max(Math.round(lastVolumeRef.current * 100), 1);

      audio.muted = false;
      audio.volume = restoredVolume / 100;
      setIsMuted(false);
      setVolume(restoredVolume);
      return;
    }

    if (audio.volume > 0) {
      lastVolumeRef.current = audio.volume;
    }

    audio.muted = true;
    setIsMuted(true);
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return undefined;
    }

    audio.volume = volume / 100;
    audio.muted = false;

    const syncDuration = () => setDuration(audio.duration || 0);
    const syncTime = () => setCurrentTime(audio.currentTime || 0);
    const syncVolume = () => {
      setIsMuted(audio.muted);

      if (!audio.muted) {
        const nextVolume = Math.round(audio.volume * 100);

        setVolume(nextVolume);

        if (audio.volume > 0) {
          lastVolumeRef.current = audio.volume;
        }
      }
    };
    const handlePlay = async () => {
      try {
        await ensureAudioGraph();
      } catch (error) {
        console.error(error);
      }

      setIsPlaying(true);
      startVisualizer();
    };
    const handlePause = () => {
      setIsPlaying(false);
      stopVisualizer();
    };
    const handleEnded = () => {
      setIsPlaying(false);
      stopVisualizer();
    };

    syncDuration();
    drawVisualizer(performance.now());

    const tryAutoplay = async () => {
      try {
        await ensureAudioGraph();
        await audio.play();
      } catch (error) {
        console.error(error);
      }
    };

    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("volumechange", syncVolume);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    window.addEventListener("resize", drawVisualizer);

    tryAutoplay();

    return () => {
      cancelAnimationFrame(animationRef.current);
      audio.pause();
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("volumechange", syncVolume);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      window.removeEventListener("resize", drawVisualizer);

      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
    };
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="hero-panel hero-audio-panel">
      <div className="hero-panel-frame" aria-hidden="true" />
      <div className="hero-panel-line hero-panel-line-horizontal" aria-hidden="true" />
      <div className="hero-panel-line hero-panel-line-vertical" aria-hidden="true" />

      <div className="hero-visualizer-shell">
        <div className="hero-visualizer-head">
          <div>
            <p className="hero-track-title">Lancome Chant V3</p>
            <p className="hero-track-meta">Maquette studio / loop / mix preview</p>
          </div>
          <div className="hero-audio-controls">
            <button type="button" className="hero-audio-toggle" onClick={togglePlay}>
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button type="button" className="hero-audio-toggle" onClick={toggleMute}>
              {isMuted ? "Unmute" : "Mute"}
            </button>
            <label className="hero-volume-control">
              <span className="hero-volume-label">Vol {volume}</span>
              <input
                aria-label="Réglage du volume"
                className="hero-volume-slider"
                max="100"
                min="0"
                onChange={handleVolumeChange}
                type="range"
                value={volume}
              />
            </label>
          </div>
        </div>
        <canvas ref={canvasRef} className="hero-visualizer" aria-hidden="true" />
        <div className="hero-progress" aria-hidden="true">
          <div
            className="hero-progress-bar"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      <div className="panel-footer hero-panel-footer">
        <span>Composition</span>
        <span>Mixage</span>
        <span>{isPlaying ? "Loop active" : "Ready"}</span>
      </div>

      <audio
        ref={audioRef}
        autoPlay
        loop
        playsInline
        preload="metadata"
        src="/music/lancome-chant-maquette-v3.wav"
      />
    </div>
  );
}
