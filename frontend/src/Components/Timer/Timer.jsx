/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const Timer = ({ hour, onTimeUp }) => {
  // Ensure the hour is properly converted to seconds
  const duration = Math.floor(hour * 3600); 
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const hr = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hr < 10 ? `0${hr}` : hr}:${mins < 10 ? `0${mins}` : mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <h1 className="font-medium text-xl">
      Time remaining: <span className="text-red-500">{formatTime(timeLeft)}</span>
    </h1>
  );
};

export default Timer;
