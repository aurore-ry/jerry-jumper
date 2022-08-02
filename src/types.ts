export type LoadedAssets = Record<string, HTMLImageElement>;

export type Entity = {
  sprite: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  onUpdate(ctx: CanvasRenderingContext2D, dt: number): void;
  render(ctx: CanvasRenderingContext2D): boolean;
};
