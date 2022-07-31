import React, { useCallback, useEffect, useRef, useState } from "react";

import { GameView } from "./views";
import { assetsByUrl } from "./assets";

const DESIRED_FPS = 60;
const FPS = DESIRED_FPS / 100;

export function App() {
  const [gameSize, setGameSize] = useState<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  let onWindowResizeLastCalledAtEpoch = useRef<null | number>(null);

  const onWindowResize = useCallback(() => {
    // const now = Date.now().valueOf();
    // if (
    //   onWindowResizeLastCalledAtEpoch.current != null &&
    //   now - onWindowResizeLastCalledAtEpoch.current <= FPS * 1000
    // ) {
    //   return undefined;
    // }

    // onWindowResizeLastCalledAtEpoch.current = now;
    const width = window.innerWidth;
    const height = window.innerHeight;
    setGameSize({ height, width });
    return undefined;
  }, [setGameSize]);

  useEffect(() => {
    window.addEventListener("resize", onWindowResize, true);
    return () => {
      window.removeEventListener("resize", onWindowResize, true);
    };
  }, []);

  useEffect(() => {
    onWindowResize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <GameView
        assetsByUrl={assetsByUrl}
        width={gameSize.width}
        height={gameSize.height}
      />
    </div>
  );
}
