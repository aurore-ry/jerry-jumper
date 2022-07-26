/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
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
    console.log("onUpdate");
    return undefined;
  }, []);

  // Dessiner les objets selon leurs props a l'ecran
  const render = useCallback(() => {
    let ctx = ctxRef.current;
    if (ctx == null) return undefined;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(assets.background!, 0, 0, width, height);
    console.log("render");
    return undefined;
  }, [height, width]);

  const gameloop = useCallback(() => {
    console.log("----gameloop start");
    onUpdate();
    console.log("gameloop render");
    render();
    console.log("----gameloop end");
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

  return (
    <canvas id={"game-canvas"} ref={canvasRef}>
      Please download a modern HTML5 browser that supports Canvas.
    </canvas>
  );
});
