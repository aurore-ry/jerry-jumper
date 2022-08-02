/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { mergeRefs } from "react-merge-refs";

import type { Entity, LoadedAssets } from "../types";

type GameCanvasProps = {
  assets: LoadedAssets;
  entities: Entity[];
  fps: number;
  width: number;
  height: number;
};

const key_code_ctx = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

export const GameCanvas = React.forwardRef<
  null | CanvasRenderingContext2D,
  GameCanvasProps
>(({ assets, entities, fps, height, width }, parentCtxRef) => {
  const [isStared, setIsStared] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isStopped, setIsStopped] = useState<boolean>(false);

  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  const ctxRef = useRef<null | CanvasRenderingContext2D>(null);
  const animFrameIdRef = useRef<null | number>(null);
  const lastDeltaTimeRef = useRef<number>(Date.now());

  const _fps = 1 / fps;

  // Faire bouger les trucs, changer couleur, forme, image, font, etc
  const onUpdate = useCallback((ctx: CanvasRenderingContext2D, dt: number) => {
    entities.forEach((entity) => {
      entity.onUpdate(ctx, dt);
    });

    return undefined;
  }, []);

  // Dessiner les objets selon leurs props a l'ecran
  const render = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const w = ctx.canvas.width;
      const h = ctx.canvas.height;

      ctx.clearRect(0, 0, w, h);

      ctx.beginPath();

      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, w, h);

      ctx.drawImage(assets.background!, 0, 0, w, h);

      entities.forEach((entity) => {
        entity.render(ctx);
      });

      ctx.fillStyle = "lime";
      ctx.fillRect(w - 10, h / 2 - 100 / 2, 10, 100);
      ctx.fillRect(w / 2 - 100 / 2, h - 10, 100, 10);

      ctx.fillText(`FPS: ${fps}`, 10, 20);
      ctx.fillText(`DT: ${lastDeltaTimeRef.current}`, 10, 35);

      return undefined;
    },
    [assets.background, height, width]
  );

  const gameloop = useCallback(() => {
    let ctx = ctxRef.current;
    if (ctx == null || canvasRef.current == null) return undefined;

    const dt = Date.now();
    lastDeltaTimeRef.current = dt - lastDeltaTimeRef.current;

    if (lastDeltaTimeRef.current > _fps) {
      onUpdate(ctx, lastDeltaTimeRef.current);
      render(ctx);
    }

    animFrameIdRef.current = window.requestAnimationFrame(gameloop);
    return undefined;
  }, [onUpdate, render]);

  useEffect(() => {
    if (isStared || isPaused || isStopped) {
      return undefined;
    }

    if (ctxRef.current == null && canvasRef.current != null) {
      ctxRef.current = canvasRef.current.getContext("2d");
      mergeRefs([parentCtxRef])(ctxRef.current);
    }

    setIsStared(true);
    gameloop();
    return undefined;
  }, []);

  useLayoutEffect(() => {
    if (canvasRef.current != null) {
      canvasRef.current.height = height;
      canvasRef.current.width = width;
    }
  }, [height, width]);

  return (
    <canvas id={"game-canvas"} ref={canvasRef}>
      Please download a modern HTML5 browser that supports Canvas.
    </canvas>
  );
});
