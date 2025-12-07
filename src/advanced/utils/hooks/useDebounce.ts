import { useState, useEffect } from 'react';

/**
 * 값이 변경되어도 지정된 시간 동안 대기 후 최종 값만 반환하는 훅
 * @param value - 디바운스할 값
 * @param delay - 대기 시간 (ms)
 * @returns 디바운스된 값
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 지정된 시간 후에 값 업데이트
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 값이 변경되면 이전 타이머 취소
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
