
import React from "react";
import * as BABYLON from "babylonjs";
import * as MATERIALS from "babylonjs-materials"
import SceneComponent from "../Babylon_components/SceneComponent";
import { showWorldAxis, showLocalAxes } from "../Babylon_components/Axes"
import { Acciones } from "./Actions";
import * as Events from "./Events"

const onSceneReady = (e = { engine: new BABYLON.Engine, scene: new BABYLON.Scene, canvas: new HTMLCanvasElement }) => {

  const { canvas, scene, engine } = e;


  // This creates and positions a free camera (non-mesh)
  var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
  //const camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 0, new BABYLON.Vector3(2, 3, 4), scene);

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());
  //camera.setPosition(new BABYLON.Vector3(10, 3, -10))

  // This attaches the camera to the canvas
  camera.attachControl(canvas, false);


  scene.clearColor = new BABYLON.Color3(0, 0, 0);

  showWorldAxis(8, scene)

  var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene)

  var ground_grid = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene)

  var groundMaterial = new MATERIALS.GridMaterial("groundmaterial", scene)
  groundMaterial.majorUnitFrequency = 5;
  groundMaterial.minorUnitVisibility = 0.45;
  groundMaterial.gridRatio = 1;
  groundMaterial.backFaceCulling = false;
  groundMaterial.mainColor = new BABYLON.Color3(1, 1, 1);
  groundMaterial.lineColor = new BABYLON.Color3(1.0, 1.0, 1.0);
  groundMaterial.opacity = 0.9;

  ground_grid.material = groundMaterial;
  ground_grid.position.y = 0.02


  Acciones(camera, scene)

  Events.DragEvents(camera, ground_grid, canvas, scene);
  Events.KeyBoardEvents(scene.getMeshById("sphere"), scene);




};


function Scene() {
  return (
    <SceneComponent antialias onSceneReady={onSceneReady} id="SceneCanvas" />
  );
}

export default Scene;
