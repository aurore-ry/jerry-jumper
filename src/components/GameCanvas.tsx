/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { mergeRefs } from "react-merge-refs";

import { LoadedAssets } from "../types";

type GameCanvasProps = {
  assets: LoadedAssets;
  width: number;
  height: number;
};

export const GameCanvas = React.forwardRef<
  null | CanvasRenderingContext2D,
  GameCanvasProps
>(({ assets, height, width }, parentCtxRef) => {
  const [isStared, setIsStared] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isStopped, setIsStopped] = useState<boolean>(false);

  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  const ctxRef = useRef<null | CanvasRenderingContext2D>(null);
  const animFrameIdRef = useRef<null | number>(null);

  // Faire bouger les trucs, changer couleur, forme, image, font, etc
  const onUpdate = useCallback(() => {
    let ctx = ctxRef.current;
    if (ctx == null) return undefined;

    return undefined;
  }, []);

  // Dessiner les objets selon leurs props a l'ecran
  const render = useCallback(() => {
    let ctx = ctxRef.current;
    if (ctx == null || canvasRef.current == null) return undefined;

    const w = canvasRef.current.width;
    const h = canvasRef.current.height;

    ctx.clearRect(0, 0, w, h);

    ctx.beginPath();

    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, w, h);

    ctx.drawImage(assets.background!, 0, 0, w, h);

    ctx.fillStyle = "lime";
    ctx.fillRect(w - 10, h / 2 - 100 / 2, 10, 100);
    ctx.fillRect(w / 2 - 100 / 2, h - 10, 100, 10);

    return undefined;
  }, [assets.background, height, width]);

  const gameloop = useCallback(() => {
    onUpdate();
    render();
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
