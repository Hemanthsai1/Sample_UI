declare module '*.png' {
  const src: string;
  export default src;
}

declare global {
  interface CanvasRenderingContext2D {
    roundRect(x: number, y: number, w: number, h: number, r: number): void;
  }
}