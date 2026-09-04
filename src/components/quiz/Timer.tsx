"use client";

import { useEffect, useRef, useState } from "react";

export function useCountdown(durationSec: number, onExpire: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(durationSec);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpireRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return secondsLeft;
}

export function TimerBadge({ secondsLeft }: { secondsLeft: number }) {
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  const critical = secondsLeft <= 60;
  return (
    <span
      className={`rounded-md px-3 py-1.5 font-mono text-sm font-semibold ${
        critical ? "bg-red-500/20 text-red-400" : "bg-slate-800 text-emerald-400"
      }`}
    >
      ⏱ {m}:{s.toString().padStart(2, "0")}
    </span>
  );
}
