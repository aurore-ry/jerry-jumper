import React, {
  CSSProperties,
  FC,
  useCallback,
  useEffect,
  useRef,
} from "react";
// app
import type { Entity } from "../types";
import { GameCanvas } from "../components";
import { useAssetsLoaders } from "../hooks/useAssetsLoaders";

type GameViewProps = {
  assetsByUrl: Record<string, string>;
  width: number;
  height: number;
};

const CANVAS_FPS = 60;
const FISH_SIZE = 85;
const SPEED_FACTOR_X = 1;
const SPEED_FACTOR_Y = 2;

export const GameView: FC<GameViewProps> = ({ assetsByUrl, height, width }) => {
  const [loadingAssets, loadedAssets] = useAssetsLoaders(assetsByUrl);
  const entities = useRef<Entity[]>([]);

  const ctxRef = useRef<null | CanvasRenderingContext2D>(null);

  const onFishUpdate = useCallback(
    (ctx: CanvasRenderingContext2D, dt: number) => {
      console.log("onUpdate fish:", dt);
      if (fishEntity.current.x <= ctx.canvas.width) {
        fishEntity.current.x += 1 * SPEED_FACTOR_X;
      } else {
        fishEntity.current.x = 10;
      }

      if (fishEntity.current.y < 30) {
        fishEntity.current.y += 0.2 * SPEED_FACTOR_Y;
      } else {
        fishEntity.current.y = 10;
      }

      fishEntity.current.y = Math.max(10, Math.min(fishEntity.current.y, 150));
    },
    []
  );

  const onFishRender = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "red";
      ctx.strokeRect(
        fishEntity.current.x,
        fishEntity.current.y,
        fishEntity.current.width,
        fishEntity.current.height
      );

      if (loadedAssets.fish != null) {
        ctx.drawImage(
          loadedAssets.fish,
          fishEntity.current.x,
          fishEntity.current.y,
          fishEntity.current.width,
          fishEntity.current.height
        );
      }
      return true;
    },
    [loadedAssets.fish]
  );

  const fishEntity = useRef<Entity>({
    sprite: loadedAssets.fish!,
    x: 10,
    y: 10,
    width: FISH_SIZE,
    height: FISH_SIZE,
    onUpdate: onFishUpdate,
    render: onFishRender,
  });

  fishEntity.current.onUpdate = onFishUpdate;
  fishEntity.current.render = onFishRender;

  console.log("GameView::assets", loadingAssets, loadedAssets);

  const loaderStyles = {
    backgroundImage: `url('${assetsByUrl.background_loading}')`,
  };

  useEffect(() => {
    if (Object.keys(loadedAssets).length === Object.keys(assetsByUrl).length) {
      entities.current = [...entities.current, fishEntity.current];
    }
  }, [assetsByUrl, fishEntity, loadedAssets]);

  if (loadingAssets) {
    return (
      <div
        id={"game-loader"}
        style={{
          ...styles.gameWrapper,
          ...styles.gameLoadingWrapper,
          ...loaderStyles,
        }}
      >
        <h1 style={styles.loadingText}>Loading assets...</h1>
      </div>
    );
  }

  return (
    <div id={"game-wrapper"} style={styles.gameWrapper}>
      <GameCanvas
        ref={ctxRef}
        assets={loadedAssets}
        entities={entities.current}
        fps={CANVAS_FPS}
        height={height}
        width={width}
      />
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  gameWrapper: {
    backgroundColor: "#00ede9",
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
    minHeight: "100vh",
    height: "100vh",
    maxHeight: "100vh",
  },
  gameLoadingWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "whitesmoke",
  },
  loadingText: {
    margin: 0,
    padding: 0,
    width: "100%",
    textAlign: "center",
  },
};
