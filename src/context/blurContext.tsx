// src/context/blurContext.tsx  (alternate provider)
import React, { createContext, useContext, useRef, useState, useEffect, PropsWithChildren } from 'react';
import { View } from 'react-native';
import { BlurTargetView } from 'expo-blur';

type BlurContextType = {
  blurTargetRef: React.RefObject<View | null>;
  ready: boolean;
};

const BlurContext = createContext<BlurContextType>({
  blurTargetRef: { current: null },
  ready: false,
});

export const useBlurTarget = () => useContext(BlurContext);

export const BlurProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const blurTargetRef = useRef<View | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      if (blurTargetRef.current) setReady(true);
      else raf = requestAnimationFrame(check);
    };
    check();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <BlurContext.Provider value={{ blurTargetRef, ready }}>
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        {children}
      </BlurTargetView>
    </BlurContext.Provider>
  );
};
