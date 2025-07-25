import { useState, useEffect } from 'react';

export function useCardWidth() {
  const [cardWidth, setCardWidth] = useState(null);

  useEffect(() => {
    function calcCardWidthGradual() {
      const screenW = window.innerWidth;
      let width;
      if (screenW >= 1366) {
        const min = 360;
        const max = 600;
        const rangeStart = 1366;
        const rangeEnd = 1920;
        let percent = (screenW - rangeStart) / (rangeEnd - rangeStart);
        percent = Math.max(0, Math.min(percent, 1));
        width = min + (max - min) * percent;
      } else {
        const min = 244;
        const max = 360;
        const rangeStart = 600;
        const rangeEnd = 1366;
        let percent = (screenW - rangeStart) / (rangeEnd - rangeStart);
        percent = Math.max(0, Math.min(percent, 1));
        percent = Math.pow(percent, 0.6);
        width = min + (max - min) * percent;
      }
      width = Math.max(244, width);
      setCardWidth(width);
    }
    calcCardWidthGradual();
    window.addEventListener('resize', calcCardWidthGradual);
    return () => {
      window.removeEventListener('resize', calcCardWidthGradual);
    };
  }, []);

  return cardWidth;
}
