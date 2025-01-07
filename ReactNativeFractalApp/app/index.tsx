import React from "react";
import { Canvas, Rect } from "@shopify/react-native-skia";
import { Dimensions } from "react-native";

export default function App() {
  const { width, height } = Dimensions.get("window");
  const pixelSize = 2; 

  const numRows = Math.ceil(height / pixelSize);
  const numCols = Math.ceil(width / pixelSize);


  const mandelbrot = (cx: number, cy: number): number => {
    let x = 0;
    let y = 0;
    let n = 0;

    while (x * x + y * y <= 4 && n < 100) {
      const xTemp = x * x - y * y + cx;
      y = 2 * x * y + cy;
      x = xTemp;
      n++;
    }

    return n;
  };

  return (
    <Canvas style={{ width, height }}>
      {Array.from({ length: numRows }).map((_, row) =>
        Array.from({ length: numCols }).map((_, col) => {

          const cx = ((col / numCols) * 3 - 2.5)+0.25; 
          const cy = ((row / numRows) * 3 - 1)-0.25;     

          const iteration = mandelbrot(cx, cy);
          const colorIntensity = Math.floor((iteration / 100) * 255);

          return (
            <Rect
              key={`${row}-${col}`}
              x={col * pixelSize}
              y={row * pixelSize}
              width={pixelSize}
              height={pixelSize}
              color={`rgb(${colorIntensity}, ${colorIntensity}, ${colorIntensity})`}
            />
          );
        })
      )}
    </Canvas>
  );
};

