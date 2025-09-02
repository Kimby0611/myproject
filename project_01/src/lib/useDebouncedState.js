import { useCallback, useEffect, useRef, useState } from "react";

const useDebouncedState = (initialState, delay) => {
  const [state, setState] = useState(initialState);
  const [debouncedState, setDebouncedState] = useState(initialState);
  const timeoutRef = useRef(null);

  const updateState = useCallback(
    (newState) => {
      setState(newState);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setDebouncedState(newState);
      }, delay);
    },
    [delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return [state, debouncedState, updateState];
};

export default useDebouncedState;
