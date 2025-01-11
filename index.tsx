import React, { useState } from "react";
import { Canvas, Rect } from "@shopify/react-native-skia";
import { Dimensions, View, Pressable, StyleSheet, Text } from "react-native";
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  PanGestureHandler,
  TapGestureHandler,
  PinchGestureHandlerGestureEvent,
  PanGestureHandlerGestureEvent,
  TapGestureHandlerGestureEvent,
  Gesture,
  GestureDetector,
  PanGesture,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withDecay,
  runOnJS,
  clamp,
} from "react-native-reanimated";

export default function Index() {
  const { width, height } = Dimensions.get("window");
  const pixelSize = 2;
  const numRows = Math.ceil(height / pixelSize);
  const numCols = Math.ceil(width / pixelSize);

  const minZoom = 1;
  const maxZoom = 2;

  const scale = useSharedValue(minZoom); 
  const translateX = useSharedValue(0); 
  const translateY = useSharedValue(0); 

  const aspectRatio = width / height;
  const maxTranslateX = (width * (maxZoom - 1)) / 2;
  const maxTranslateY = (height * (maxZoom - 1)) / 2;

  const resetZoomAndPan = () => {
    scale.value = minZoom;
    translateX.value = 0;
    translateY.value = 0;
  };

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


  const zoomhHandler =
    useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
      onActive: (event) => {
        scale.value = clamp(event.scale, minZoom, maxZoom); 
      },
    });


  const doubleTapHandler =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onActive: () => {
        runOnJS(resetZoomAndPan)(); 
      },
    });


  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TapGestureHandler
        onGestureEvent={doubleTapHandler}
        numberOfTaps={2} 
      >
        <Animated.View style={{ flex: 1 }}>
            <Animated.View style={[{ flex: 1 }, animatedStyle]}>
              <PinchGestureHandler onGestureEvent={zoomhHandler}>
                <Animated.View style={{ flex: 1 }}>
                  <Canvas style={{ width, height }}>
                    {Array.from({ length: numRows }).map((_, row) =>
                      Array.from({ length: numCols }).map((_, col) => {
                        const cx =
                          ((col / numCols) * 3 - 2) / scale.value + 0.25;
                        const cy = ((row / numRows) * 3 - 1.5) / scale.value;

                        const iteration = mandelbrot(cx, cy);
                        const colorIntensity = Math.floor(
                          (iteration / 100) * 255
                        );

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
                </Animated.View>
              </PinchGestureHandler>
            </Animated.View>
        </Animated.View>
      </TapGestureHandler>
    </GestureHandlerRootView>
  );
}

