import { useCallback, useEffect, useRef, useState } from "react";
export default function useSound() {
  const context = useRef(null),
    enabled = useRef(false);
  const [sound, setSound] = useState(false);
  const play = useCallback((kind = "open") => {
    if (!enabled.current) return;
    try {
      const audio = context.current;
      if (!audio) return;
      void audio.resume();
      const notes =
        kind === "welcome"
          ? [220, 330, 440, 660]
          : kind === "win"
            ? [392, 494, 587]
            : kind === "gate"
              ? [440]
              : [330, 495];
      notes.forEach((frequency, index) => {
        const oscillator = audio.createOscillator(),
          gain = audio.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        const start =
          audio.currentTime + index * (kind === "welcome" ? 0.13 : 0.055);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(
          kind === "welcome" ? 0.025 : 0.018,
          start + 0.015,
        );
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.3);
        oscillator.connect(gain);
        gain.connect(audio.destination);
        oscillator.onended = () => {
          oscillator.disconnect();
          gain.disconnect();
        };
        oscillator.start(start);
        oscillator.stop(start + 0.32);
      });
    } catch {
      /* Audio is an optional enhancement. */
    }
  }, []);
  const setEnabled = useCallback((value) => {
    if (value) {
      try {
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return;
        if (!context.current) context.current = new Audio();
        void context.current.resume();
      } catch {
        return;
      }
    }
    enabled.current = value;
    setSound(value);
    if (!value) void context.current?.suspend();
  }, []);
  useEffect(() => {
    const visibility = () => {
      if (document.hidden) void context.current?.suspend();
      else if (enabled.current) void context.current?.resume();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      void context.current?.close();
    };
  }, []);
  return { sound, setEnabled, play };
}
