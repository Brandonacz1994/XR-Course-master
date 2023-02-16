
import React from "react";
import * as BABYLON from "babylonjs";
import * as MATERIALS from "babylonjs-materials"
import SceneComponent from "../Babylon_components/SceneComponent";
import { showWorldAxis, showLocalAxes } from "./Axes"


const onSceneReady = (e) => {

  const { canvas, scene, engine } = e;
  // This creates and positions a free camera (non-mesh)
  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
  //const camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 0, new BABYLON.Vector3(2, 3, 4), scene);

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());
  //camera.setPosition(new BABYLON.Vector3(10, 3, -10))

  // This attaches the camera to the canvas
  camera.attachControl(canvas, false);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;


  /************Start Pilot*********************************/

  var body = BABYLON.MeshBuilder.CreateCylinder("body", { height: 0.75, diameterTop: 0.2, diameterBottom: 0.5, tessellation: 6, subdivisions: 1 }, scene);
  var arm = BABYLON.MeshBuilder.CreateBox("arm", { height: 0.75, width: 0.3, depth: 0.1875 }, scene);
  arm.position.x = 0.125;
  
  var pilot_with_WORLD_translate = BABYLON.Mesh.MergeMeshes([body, arm], true);

  var pilot_with_LOCAL_translate = pilot_with_WORLD_translate.createInstance("pilot local");

  /*Create world and local axes */

  

  showWorldAxis(8, scene)

  var localOrigin_1 = showLocalAxes(2, scene);
  localOrigin_1.parent = pilot_with_WORLD_translate;
  pilot_with_WORLD_translate.rotation.y = Degrees_to_radians(120);


  var localOrigin_2 = showLocalAxes(2,scene);
  localOrigin_2.parent = pilot_with_LOCAL_translate;
  pilot_with_LOCAL_translate.rotation.y = Degrees_to_radians(120);


  var direction_traslation_vector = new BABYLON.Vector3(0, 0, 4);
  direction_traslation_vector.normalize();
  var distance_per_render = 0.01;
  var i = 0;


  var unit_per_secs = 1
  var distance_final= 10


  scene.onBeforeRenderObservable.add(() => {

    const deltaTimeInMillis = scene.getEngine().getDeltaTime();
    const deltaTimeInsecs = (scene.getEngine().getDeltaTime())/1000;

    //if (i++ < 500) pilot_with_WORLD_translate.translate(direction_traslation_vector, distance_per_render*deltaTimeInMillis, BABYLON.Space.WORLD); //eje Z azul del mundo
    //if (i++ < 500) pilot_with_LOCAL_translate.translate(direction_traslation_vector, distance_per_render*deltaTimeInMillis, BABYLON.Space.LOCAL); //eje z azul del pilot

    i = i+unit_per_secs*deltaTimeInsecs;
    if (i <= distance_final) pilot_with_WORLD_translate.translate(direction_traslation_vector, unit_per_secs*deltaTimeInsecs, BABYLON.Space.WORLD);
      
    ; //eje Z azul del mundo
    if (i <= distance_final) pilot_with_LOCAL_translate.translate(direction_traslation_vector, unit_per_secs*deltaTimeInsecs, BABYLON.Space.LOCAL); //eje z azul del pilot


  });

  var ground = new BABYLON.MeshBuilder.CreateGround("ground",{width:100,height:100},scene)

  var groundMaterial = new MATERIALS.GridMaterial("groundmaterial", scene)
	groundMaterial.majorUnitFrequency = 5;
	groundMaterial.minorUnitVisibility = 0.45;
	groundMaterial.gridRatio = 1;
	groundMaterial.backFaceCulling = false;
	groundMaterial.mainColor = new BABYLON.Color3(1, 1, 1);
	groundMaterial.lineColor = new BABYLON.Color3(1.0, 1.0, 1.0);
	groundMaterial.opacity = 0.9;

  ground.material = groundMaterial;


  /*Examples using boxes  */

  var faceColors = [];
  faceColors[0] = BABYLON.Color3.Blue();
  faceColors[1] = BABYLON.Color3.Red();
  faceColors[2] = BABYLON.Color3.Green();
  faceColors[3] = BABYLON.Color3.White();
  faceColors[4] = BABYLON.Color3.Yellow();
  faceColors[5] = BABYLON.Color3.Black();

  var options = {
    width: 0.7,
    height: 0.7,
    depth: 0.7,
    faceColors: faceColors
  };

  var mainbox = BABYLON.MeshBuilder.CreateBox("mainbox", options, scene, true);
  //Adding local axes for main box
  var localOriginBox = showLocalAxes(2, scene);
  localOriginBox.parent = mainbox;

  
  /**
   * funcion para convertir grados a radianes
   * @param {*} degrees 
   * @returns un mumero en radianes
   */
  function Degrees_to_radians(degrees) {

    var result_radians = degrees * (Math.PI / 180)

    return result_radians
  }


  var rot_x = Math.PI / 128;
  var rot_y = 0;
  var rot_z = 0;

  var rot_count = 0; // for oscillation (rotation)
  var rot_temp;

  var a = 0; // for oscillation (translation)

  scene.onBeforeRenderObservable.add(() => {

    if (rot_count == 128) {
      rot_count = 0;
      rot_temp = rot_z;
      rot_z = rot_y;
      rot_y = rot_x;
      rot_x = rot_temp;
    }
    mainbox.addRotation(rot_x, rot_y, rot_z); // for adding rotation
    rot_count++;

    a += 0.005;
    var sign = Math.cos(a) / Math.abs(Math.cos(a)); //signoidal function for movement
    //mainbox.locallyTranslate(new BABYLON.Vector3(0.02 * sign, 0, 0.02 * sign));

  });

  
};


function Scene() {
  return (
    <SceneComponent antialias onSceneReady={onSceneReady} id="SceneCanvas" />
  );
}

export default Scene;
