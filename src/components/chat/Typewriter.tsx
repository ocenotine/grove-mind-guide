import React, { useState, useEffect, useCallback, useRef } from 'react';

interface TypewriterProps {
  text: string;
  delay?: number;
  onComplete?: () => void;
  cursor?: boolean;
}

const Typewriter: React.FC<TypewriterProps> = ({
  text,
  delay = 30,
  onComplete,
  cursor = false
}) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Keep a ref to the sound element
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create the audio element for typing sound
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio('/sounds/type.mp3');
      audio.volume = 0.2;
      audioRef.current = audio;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Play sound function with throttling
  const playTypeSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.info('Audio play failed:', error);
      });
    }
  }, []);

  useEffect(() => {
    if (currentIndex < text.length && !isPaused) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
        
        // Play sound for certain characters
        if (!/[.,;:!?\s]/.test(text[currentIndex])) {
          playTypeSound();
        }
      }, delay);
      
      return () => clearTimeout(timeout);
    } else if (currentIndex >= text.length && onComplete) {
      onComplete();
    }
  }, [currentIndex, delay, isPaused, onComplete, playTypeSound, text]);

  // Toggle pause/resume on click
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <span onClick={togglePause} style={{ cursor: 'pointer' }}>
      {currentText}
      {currentIndex < text.length && cursor && <span className="animate-pulse">|</span>}
    </span>
  );
};

export default Typewriter;
