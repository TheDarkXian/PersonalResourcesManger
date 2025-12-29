
import { useState, useCallback, useRef } from 'react';

/**
 * 资源定位 Ping 效果 Hook
 */
export const usePingHighlight = () => {
  const [pingId, setPingId] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const triggerPing = useCallback((id: string) => {
    // 如果有正在进行的定时器，先清除
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    setPingId(id);

    // 2.5秒后自动清除高亮状态，与 CSS 动画周期匹配
    timerRef.current = window.setTimeout(() => {
      setPingId(prev => (prev === id ? null : prev));
      timerRef.current = null;
    }, 2500);
  }, []);

  return { pingId, triggerPing };
};
