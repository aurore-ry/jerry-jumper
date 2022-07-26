import React, { FC, useCallback, useEffect, useRef, useState } from "react";

import type { LoadedAssets } from "../types";
import { GameCanvas } from "../components";

type GameViewProps = {
  assetsByUrl: Record<string, string>;
  width: number;
  height: number;
};

export const GameView: FC<GameViewProps> = ({ assetsByUrl, height, width }) => {
  const [loadedAssets, setLoadedAssets] = useState<LoadedAssets>({});

  const loadImage = useCallback(
    (assetName: string, imageUrl: string): Promise<void> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onerror = function imageError(
          _: Event | string,
          __?: string,
          ___?: number,
          ____?: number,
          error?: Error
        ) {
          if (error != null) {
            reject(error);
          } else {
            reject(
              new Error(`Cannot load asset: ${assetName}, with: ${imageUrl}.`)
            );
          }
        };
        img.onload = function imageLoaded() {
          setLoadedAssets((prevAssets) => ({
            ...prevAssets,
            [assetName]: img,
          }));
          resolve(undefined);
        };
        img.src = imageUrl;
      }),
    []
  );

  const ctxRef = useRef<null | CanvasRenderingContext2D>(null);

  useEffect(() => {
    async function loadAllAssetsByUrl() {
      if (Object.keys(loadedAssets).length <= 0) {
        await Promise.all(
          Object.entries(assetsByUrl).map(async ([assetName, imageUrl]) => {
            return loadImage(assetName, imageUrl as string);
          })
        );
      }
    }
    loadAllAssetsByUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (Object.keys(loadedAssets).length !== Object.keys(assetsByUrl).length) {
    return (
      <div id={"game-loader"}>
        <h1>Loading assets...</h1>
      </div>
    );
  }

  return (
    <div id={"game-wrapper"}>
      <GameCanvas
        ref={ctxRef}
        assets={loadedAssets}
        height={height}
        width={width}
      />
    </div>
  );
};
