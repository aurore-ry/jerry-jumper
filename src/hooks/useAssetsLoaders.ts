import { useCallback, useEffect, useMemo, useState } from "react";
// app
import type { LoadedAssets } from "../types";

type UseAssetsLoaderAPI = [boolean, LoadedAssets];

export function useAssetsLoaders(
  assetsByUrl: Record<string, string>
): UseAssetsLoaderAPI {
  const [loading, setLoading] = useState(true);
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
    [setLoadedAssets]
  );

  useEffect(() => {
    async function loadAllAssetsByUrl() {
      setLoading(true);
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
  }, [assetsByUrl, setLoading]);

  useEffect(() => {
    let timeoutId: null | NodeJS.Timer = null;

    if (Object.keys(loadedAssets).length === Object.keys(assetsByUrl).length) {
      timeoutId = setTimeout(() => {
        if (timeoutId != null) {
          clearTimeout(timeoutId);
        }
        setLoading(false);
      }, 3 * 1000);
    }

    return () => {
      if (timeoutId != null) {
        clearTimeout(timeoutId);
      }
    };
  }, [assetsByUrl, loadedAssets, setLoading]);

  return useMemo(() => [loading, loadedAssets], [loading, loadedAssets]);
}
