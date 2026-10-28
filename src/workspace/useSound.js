import { useCallback, useEffect, useRef, useState } from "react";

export default function useSound() {
  const context = useRef(null);
  const ambient = useRef(null);
  const enabled = useRef(true);
  const [sound, setSound] = useState(true);

  const activate = useCallback(() => {
    if (!enabled.current || document.hidden) return null;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return null;
      if (!context.current || context.current.state === "closed") {
        context.current = new Audio();
      }
      const audio = context.current;
      void audio
        .resume()
        .then(() => {
          if (!enabled.current || document.hidden || context.current !== audio || ambient.current)
            return;
          // A quiet, locally synthesized ambient loop; no downloaded recording.
          const level = audio.createGain();
          level.gain.setValueAtTime(0, audio.currentTime);
          level.gain.linearRampToValueAtTime(0.008, audio.currentTime + 1.5);
          const filter = audio.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.value = 240;
          filter.connect(level);
          level.connect(audio.destination);
          const voices = [55, 82.41, 110].map((frequency, index) => {
            const oscillator = audio.createOscillator();
            oscillator.type = "sine";
            oscillator.frequency.value = frequency;
            oscillator.detune.value = index - 1;
            oscillator.connect(filter);
            oscillator.start();
            return oscillator;
          });
          const pulse = audio.createOscillator();
          const depth = audio.createGain();
          pulse.frequency.value = 0.12;
          depth.gain.value = 0.002;
          pulse.connect(depth);
          depth.connect(level.gain);
          pulse.start();
          ambient.current = {
            stop() {
              [...voices, pulse].forEach((voice) => {
                voice.stop();
                voice.disconnect();
              });
              depth.disconnect();
              filter.disconnect();
              level.disconnect();
            },
          };
        })
        .catch(() => {
          /* Browser activation may still be required. */
        });
      return audio;
    } catch {
      return null;
    }
  }, []);

  const play = useCallback((kind = "open") => {
    if (!enabled.current) return;
    try {
      const audio = context.current;
      // Do not queue sounds in a suspended context before visitor interaction.
      if (!audio || audio.state !== "running") return;
      const notes =
        kind === "welcome"
          ? [220, 330, 440, 660]
          : kind === "signal"
            ? [164.81, 329.63]
            : kind === "authenticate"
              ? [246.94, 369.99, 493.88]
              : kind === "win"
                ? [392, 494, 587]
                : kind === "gate"
                  ? [440]
                  : [330, 495];
      notes.forEach((frequency, index) => {
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        const start =
          audio.currentTime + index * (kind === "welcome" ? 0.13 : 0.075);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.018, start + 0.015);
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
      /* Optional audio must not interrupt navigation. */
    }
  }, []);

  const setEnabled = useCallback(
    (value) => {
      enabled.current = value;
      setSound(value);
      if (value) activate();
      else void context.current?.suspend().catch(() => {});
    },
    [activate],
  );

  useEffect(() => {
    // Start immediately when autoplay is allowed; otherwise the first gesture
    // resumes the same context without presenting an audio opt-in screen.
    activate();
    let firstInteraction = true;
    const unlock = () => {
      const audio = activate();
      if (firstInteraction && audio) {
        firstInteraction = false;
        void audio
          .resume()
          .then(() => play("signal"))
          .catch(() => {});
      }
    };
    const visibility = () => {
      if (document.hidden) void context.current?.suspend().catch(() => {});
      else if (enabled.current) activate();
    };
    // Autoplay policies require a trusted gesture; no sound-choice form is needed.
    document.addEventListener("pointerdown", unlock, { capture: true });
    document.addEventListener("keydown", unlock, { capture: true });
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("pointerdown", unlock, { capture: true });
      document.removeEventListener("keydown", unlock, { capture: true });
      document.removeEventListener("visibilitychange", visibility);
      ambient.current?.stop();
      ambient.current = null;
      const audio = context.current;
      context.current = null;
      void audio?.close().catch(() => {});
    };
  }, [activate, play]);

  return { sound, setEnabled, play };
}
