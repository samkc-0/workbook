declare global {
  type Position3D =
    | { x: number; y: number; z: number }
    | [number, number, number];
}

export {};
