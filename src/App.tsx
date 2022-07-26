import React, { useCallback, useEffect, useState } from "react";

import { GameView } from "./views";
import { assetsByUrl } from "./assets";

export function App() {
  const [gameSize, setGameSize] = useState<{ width: number; height: number }>({
    width: 800,
    height: 600,
  });

  const onDocumentResize = useCallback(() => {
    document.body.getClientRects();
  }, []);

  useEffect(() => {
    document.addEventListener("resize", onDocumentResize);
    return () => {
      document.removeEventListener("resize", onDocumentResize);
    };
  });
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
