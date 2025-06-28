
import { useCallback } from 'react';

export const useBeepSounds = () => {
  const playSuccessBeep = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800; // Frequência mais alta para sucesso
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }, []);

  const playErrorBeep = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Primeiro beep (mais grave)
    const oscillator1 = audioContext.createOscillator();
    const gainNode1 = audioContext.createGain();
    
    oscillator1.connect(gainNode1);
    gainNode1.connect(audioContext.destination);
    
    oscillator1.frequency.value = 300; // Frequência mais baixa para erro
    oscillator1.type = 'square';
    
    gainNode1.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator1.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 0.2);
    
    // Segundo beep (ainda mais grave)
    const oscillator2 = audioContext.createOscillator();
    const gainNode2 = audioContext.createGain();
    
    oscillator2.connect(gainNode2);
    gainNode2.connect(audioContext.destination);
    
    oscillator2.frequency.value = 200;
    oscillator2.type = 'square';
    
    gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime + 0.3);
    gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator2.start(audioContext.currentTime + 0.3);
    oscillator2.stop(audioContext.currentTime + 0.5);
  }, []);

  const playRequestBeep = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 1000; // Frequência alta para requisição
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Volume mais alto
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.4);
  }, []);

  return {
    playSuccessBeep,
    playErrorBeep,
    playRequestBeep
  };
};
