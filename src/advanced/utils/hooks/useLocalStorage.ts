// TODO: LocalStorage Hook
// 힌트:
// 1. localStorage와 React state 동기화
// 2. 초기값 로드 시 에러 처리
// 3. 저장 시 JSON 직렬화/역직렬화
// 4. 빈 배열이나 undefined는 삭제
//
// 반환값: [저장된 값, 값 설정 함수]
import { useState, useEffect, useCallback } from "react";

interface UseLocalStorageOptions {
  removeWhenEmpty?: boolean; // 빈 배열일 때 localStorage에서 삭제할지 여부
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions = {}
): [T, (value: T | ((val: T) => T)) => void] {
  const { removeWhenEmpty = false } = options;

  // 1. 초기값 로드 (lazy initialization)
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 2. 값 설정 함수 (함수형 업데이트 지원)
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      return valueToStore;
    });
  }, []);

  // 3. 상태 변경 시 localStorage 동기화
  useEffect(() => {
    try {
      const isEmpty = Array.isArray(storedValue) && storedValue.length === 0;

      if (removeWhenEmpty && isEmpty) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, removeWhenEmpty]);

  return [storedValue, setValue];
}