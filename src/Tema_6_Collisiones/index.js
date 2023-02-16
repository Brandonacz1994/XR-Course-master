
import React from "react";
import * as BABYLON from "babylonjs";
import SceneComponent from "../Babylon_components/SceneComponent";
import {PlayGround} from "./PlayGround";


const onSceneReady = (e) => {

  const { canvas, scene, engine } = e;
  // This creates and positions a free camera (non-mesh)
  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, false);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  var sphere = new BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene)
  sphere.position = new BABYLON.Vector3(3, 1, 0);

  var box = new BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, scene);
  box.position.y = 1;

  // Our built-in 'ground' shape.
  //var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
  //ground.checkCollisions = true;

  scene.gravity = new BABYLON.Vector3(0, -0.98, 0)
  scene.collitionsEnabled = true;

  camera.checkCollisions = true;
  camera.applyGravity = true;
  camera.ellipsoid =  new BABYLON.Vector3(2,1,2);

  box.checkCollisions = true;
  sphere.checkCollisions = true;
  
  var test =PlayGround({playground_width:100,playground_depth:100},scene)

  scene.onBeforeRenderObservable.add(() => {
    if (box !== undefined) {
      const deltaTimeInMillis = scene.getEngine().getDeltaTime();

      const rpm = 30
      box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    }

  });

};


function Scene() {
  return (
    <SceneComponent antialias onSceneReady={onSceneReady} id="SceneCanvas" />
  );
}

export default Scene;
