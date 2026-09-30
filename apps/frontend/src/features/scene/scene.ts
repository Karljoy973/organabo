import type { Engine } from "@babylonjs/core/Engines/engine";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Scene } from "@babylonjs/core/scene";

export function createScene(engine: Engine): Scene {
  const scene = new Scene(engine);
  scene.clearColor = Color4.FromHexString("#10161FFF");

  // Camera: orbit controls around the center of the scene.
  const camera = new ArcRotateCamera(
    "camera",
    -Math.PI / 2.2,
    Math.PI / 3,
    14,
    Vector3.Zero(),
    scene,
  );
  camera.lowerRadiusLimit = 6;
  camera.upperRadiusLimit = 30;
  camera.wheelDeltaPercentage = 0.02;
  camera.attachControl(engine.getRenderingCanvas(), true);

  // Lighting: soft hemispheric fill.
  const light = new HemisphericLight("hemispheric", new Vector3(0, 1, 0), scene);
  light.intensity = 0.9;
  light.diffuse = Color3.FromHexString("#E8EDF5");
  light.groundColor = Color3.FromHexString("#26313F");

  // Ground.
  const ground = MeshBuilder.CreateGround(
    "ground",
    { width: 24, height: 24, subdivisions: 2 },
    scene,
  );
  ground.material = mat(scene, "ground-material", "#2B3A4A");
  ground.receiveShadows = false;

  // Plinth in the middle.
  const plinth = MeshBuilder.CreateBox("plinth", { width: 2, height: 1, depth: 2 }, scene);
  plinth.position.y = 0.5;
  plinth.material = mat(scene, "plinth-material", "#3D5166");

  // Floating orb above the plinth.
  const orb = MeshBuilder.CreateSphere("orb", { diameter: 0.9, segments: 24 }, scene);
  orb.position.y = 1.6;
  orb.material = mat(scene, "orb-material", "#5FA8D3");

  // Ring around the orb.
  const ring = MeshBuilder.CreateTorus(
    "ring",
    { diameter: 3, thickness: 0.12, tessellation: 48 },
    scene,
  );
  ring.position.y = 1.6;
  ring.rotation.x = Math.PI / 2;
  ring.material = mat(scene, "ring-material", "#D98E5F");

  // Framerate-independent animation.
  scene.onBeforeRenderObservable.add(() => {
    const now = performance.now();
    const deltaSeconds = engine.getDeltaTime() / 1000;

    ring.rotation.z += deltaSeconds * 0.8;
    ring.rotation.x = Math.PI / 2 + Math.sin(now / 1200) * 0.2;
    orb.position.y = 1.6 + Math.sin(now / 900) * 0.15;
  });

  return scene;
}

function mat(scene: Scene, name: string, hex: string): StandardMaterial {
  const material = new StandardMaterial(name, scene);
  material.diffuseColor = Color3.FromHexString(hex);
  material.specularColor = Color3.Black();
  return material;
}
