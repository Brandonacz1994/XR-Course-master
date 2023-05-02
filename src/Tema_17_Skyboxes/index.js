import * as BABYLON from "babylonjs";
import * as MATERIALS from "babylonjs-materials";
import SceneComponent from "../Babylon_components/SceneComponent";

import * as Skyboxes from "../Tema_17_Skyboxes/SkyBoxes"


import images from '../Tema_17_Skyboxes/TropicalSunnyDay';
import hdr from '../Tema_17_Skyboxes/room.hdr';


import "babylonjs-loaders"

const onSceneReady = async (e = { engine: new BABYLON.Engine, scene: new BABYLON.Scene, canvas: new HTMLCanvasElement }) => {

  const { canvas, scene, engine } = e;
  // This creates and positions a free camera (non-mesh)
  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, false);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(-1, 1, 0), scene);


  // Default intensity is 1. Let's dim the light a small amount
  //light.intensity = 0.7;


  //Skyboxes.SkyMaterialDemo(1000, scene);
  //Skyboxes.SkyCubeTextureDemo(images,1000,scene);
  Skyboxes.SkyHDRTextureDemo(hdr,200,scene);

  var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene)
  sphere.position = new BABYLON.Vector3(3, 1, 0);


  var box = BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, scene);
  box.position.y = 1;

  // Our built-in 'ground' shape.
  var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);


  scene.onBeforeRenderObservable.add(() => {
    if (box !== undefined) {
      const deltaTimeInMillis = scene.getEngine().getDeltaTime();

      const rpm = 30
      box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    }

  });


  engine.runRenderLoop(() => {
    if (scene) {
      scene.render();
    }
  });

};


function Scene() {
  return (
    <SceneComponent antialias onSceneReady={onSceneReady} id="SceneCanvas" />
  );
}

export default Scene;
