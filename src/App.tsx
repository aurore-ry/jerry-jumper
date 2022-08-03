import React, { useCallback, useEffect, useState } from "react";

import { GameView } from "./views";
import { assetsByUrl } from "./assets";

export function App() {
  const [gameSize, setGameSize] = useState<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const onWindowResize = useCallback(() => {
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
  }, [onWindowResize]);

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
