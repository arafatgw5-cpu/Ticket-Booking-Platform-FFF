"use client";

import { useEffect, useState } from "react";

export default function Countdown({ departure }) {
  const calculateTime = () => {
    const difference =
      new Date(departure) - new Date();

    if (difference <= 0) return "Expired";
// Calculate time left
    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );
// Calculate hours left
    const hours = Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
      (difference / (1000 * 60)) % 60
    );

    return `${days}d ${hours}h ${minutes}m`;
  };

  const [timeLeft, setTimeLeft] = useState(
    calculateTime()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-orange-600 font-semibold">
      Countdown: {timeLeft}
    </div>
  );
}