import { useEffect, useRef } from "react";

import { Engine } from "@babylonjs/core/Engines/engine";

import { createScene } from "./scene.ts";

/**
 * 3D viewport: mounts the Babylon engine on a canvas owned by React,
 * inside the center panel. The engine is created once and disposed on
 * unmount; Redux state changes never re-create it.
 */
export function ScenePanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    let engine: Engine;
    let fallback: HTMLParagraphElement | undefined;

    try {
      engine = new Engine(canvas, true, { stencil: true });
      const scene = createScene(engine);
      engine.runRenderLoop(() => {
        scene.render();
      });
    } catch {
      fallback = document.createElement("p");
      fallback.textContent = "WebGL is not available on this device.";
      fallback.className = "scene-fallback";
      canvas.parentElement?.appendChild(fallback);
      return;
    }

    const onResize = () => {
      engine.resize();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      engine.dispose();
      fallback?.remove();
    };
  }, []);

  return <canvas ref={canvasRef} className="scene-canvas" />;
}
