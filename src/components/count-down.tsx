"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";

export default function Countdown() {
  const [duration, setDuration] = useState<number | string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false); // New state to track completion
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  const handleSetDuration = (): void => {
    if (typeof duration === "number" && duration > 0) {
      setTimeLeft(duration);
      setIsActive(false);
      setIsPaused(false);
      setIsCompleted(false); // Reset completion state
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    }
  };

  const handleStart = (): void => {
    if (timeLeft > 0) {
      setIsActive(true);
      setIsPaused(false);
      setIsCompleted(false); // Reset completion state
    }
  };

  const handlePause = (): void => {
    if (isActive) {
      setIsActive(false);
      setIsPaused(true);
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    }
  };

  const handleReset = (): void => {
    setTimeLeft(0); // Set countdown to zero
    setIsActive(false);
    setIsPaused(false);
    setIsCompleted(false);
    setDuration(""); // Clear the input field
    if (timeRef.current) {
      clearInterval(timeRef.current);
    }
  };
  useEffect(() => {
    if (isActive && !isPaused) {
      timeRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timeRef.current!);
            setIsCompleted(true); // Set completion state to true
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    };
  }, [isActive, isPaused]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(Number(e.target.value) || "");
  };

  return (
    <div className={`countdown-container ${isCompleted ? 'hidden' : ''}`}>
      <h1>Countdown Timer</h1>
      <div className="time-display">{formatTime(timeLeft)}</div>
      <input
        type="number"
        value={duration}
        onChange={handleDurationChange}
        placeholder="Enter time in seconds"
        className="time-input"
      />
      <div className="buttons">
        <button onClick={handleSetDuration} className="set-button">Set</button>
        <button onClick={handleStart} className="start-button">Start</button>
        <button onClick={handlePause} className="pause-button">Pause</button>
        <button onClick={handleReset} className="reset-button">Reset</button>
      </div>
    </div>
  );
}
