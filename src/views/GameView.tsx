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
const SPEED_FACTOR_X = 0.8;
const SPEED_FACTOR_Y = 0.8;

enum KeyCode {
  LEFT = "ArrowLeft",
  UP = "ArrowUp",
  RIGHT = "ArrowRight",
  DOWN = "ArrowDown",
}

// Prend les clés dans KeyCode et utilise les pour créer un object tel que
// clé = keyCode, valeur = pas pressé par défault
const initialPressedKeys = Object.values(KeyCode).reduce((acc, keyCode) => {
  acc = {
    ...acc,
    [keyCode]: false,
  };
  return acc;
}, {} as { [K in KeyCode]: boolean });

export const GameView: FC<GameViewProps> = ({ assetsByUrl, height, width }) => {
  const [loadingAssets, loadedAssets] = useAssetsLoaders(assetsByUrl);
  console.log("GameView::assets", loadingAssets, loadedAssets);

  const ctxRef = useRef<null | CanvasRenderingContext2D>(null);
  const entities = useRef<Entity[]>([]);
  const pressedKeys = useRef<{ [K in KeyCode]: boolean }>(initialPressedKeys);

  const loaderStyles = {
    backgroundImage: `url('${assetsByUrl.background_loading}')`,
  };

  const onFishUpdate = useCallback(
    (_: CanvasRenderingContext2D, dt: number) => {
      console.log("onUpdate fish:", dt);

      if (pressedKeys.current[KeyCode.RIGHT] === true) {
        fishEntity.current.x += 1 * SPEED_FACTOR_X;
      } else if (pressedKeys.current[KeyCode.LEFT] === true) {
        fishEntity.current.x -= 1 * SPEED_FACTOR_X;
      }

      if (pressedKeys.current[KeyCode.DOWN] === true) {
        fishEntity.current.y += 1 * SPEED_FACTOR_Y;
      } else if (pressedKeys.current[KeyCode.UP] === true) {
        fishEntity.current.y -= 1 * SPEED_FACTOR_Y;
      }
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

  const onKeyPress = useCallback((ev: KeyboardEvent) => {
    const keyCode = ev.code;
    console.log("key press:", keyCode);
    pressedKeys.current = {
      ...pressedKeys.current,
      [keyCode]: true,
    };
  }, []);

  const onKeyRelease = useCallback((ev: KeyboardEvent) => {
    const keyCode = ev.code;
    console.log("key release:", keyCode);
    pressedKeys.current = {
      ...pressedKeys.current,
      [keyCode]: false,
    };
  }, []);

  // Un effet qui ajoute le fishEntity à la scene une fois
  // les assets complètement chargés.
  useEffect(() => {
    if (Object.keys(loadedAssets).length === Object.keys(assetsByUrl).length) {
      entities.current = [...entities.current, fishEntity.current];
    }
  }, [assetsByUrl, fishEntity, loadedAssets]);

  // Un effet au mount qui écoute les keyup/keydown
  useEffect(() => {
    document.addEventListener("keydown", onKeyPress);
    document.addEventListener("keyup", onKeyRelease);
    console.log("keyboard events set");
    return () => {
      document.removeEventListener("keydown", onKeyPress);
      document.removeEventListener("keyup", onKeyRelease);
      console.log("keyboard events unset");
    };
  }, [onKeyPress, onKeyRelease]);

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
