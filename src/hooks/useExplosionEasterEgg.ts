import { useState, useRef, useEffect } from 'react';

interface UseExplosionEasterEggProps {
  isEnabled: boolean;
}

export const useExplosionEasterEgg = ({
  isEnabled,
}: UseExplosionEasterEggProps) => {
  const [showExplosion, setShowExplosion] = useState(false);
  const lastRightClickTime = useRef(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (showExplosion) {
      timer = setTimeout(() => {
        setShowExplosion(false);
      }, 100);
    }
    return () => clearTimeout(timer);
  }, [showExplosion]);

  const handleContextMenu = (e: any) => {
    if (!isEnabled) return;

    e.evt.preventDefault();
    const now = Date.now();
    const DOUBLE_CLICK_THRESHOLD = 300; // ms

    if (now - lastRightClickTime.current < DOUBLE_CLICK_THRESHOLD) {
      setShowExplosion(true);
      lastRightClickTime.current = 0; // reset to prevent third click
    } else {
      lastRightClickTime.current = now;
    }
  };

  return { showExplosion, handleContextMenu };
};
