
import React from "react";
import * as BABYLON from "babylonjs";
import SceneComponent from "../Babylon_components/SceneComponent";
import { showWorldAxis, showLocalAxes } from "./Axes"


const onSceneReady = (e) => {

  const { canvas, scene, engine } = e;
  // This creates and positions a free camera (non-mesh)
  //const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
  const camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 0, new BABYLON.Vector3(2, 3, 4), scene);

  // This targets the camera to scene origin
  //camera.setTarget(BABYLON.Vector3.Zero());
  camera.setPosition(new BABYLON.Vector3(10, 3, -10))

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
  var pilot = BABYLON.Mesh.MergeMeshes([body, arm], true);

  /*Create world and local axes */

  showWorldAxis(8, scene)

  var localOrigin = showLocalAxes(2, scene);
  localOrigin.parent = pilot;


  /* Change pilot position */
  pilot.position = new BABYLON.Vector3(2, 3, 4);

  /* Change pilot rotation */
  //pilot.rotation.x = Math.PI/2;  //number is a radian 
  pilot.rotation.x = Degrees_to_radians(0)

  //pilot.rotation.y = Math.PI/2;  //number is a radian 
  pilot.rotation.y = Degrees_to_radians(0)

  //pilot.rotation.z = Math.PI/2;  //number is a radian 
  pilot.rotation.z = Degrees_to_radians(0)


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


  var box1 = BABYLON.Mesh.CreateBox("Box1", 1.0, scene);
  var box2 = BABYLON.Mesh.CreateBox("Box2", 1.0, scene);

  var mainbox = BABYLON.MeshBuilder.CreateBox("mainbox", options, scene, true)

  var box4 = BABYLON.Mesh.CreateBox("Box4", 1.0, scene);
  var box5 = BABYLON.Mesh.CreateBox("Box5", 1.0, scene);
  var box6 = BABYLON.Mesh.CreateBox("Box6", 1.0, scene);
  var box7 = BABYLON.Mesh.CreateBox("Box7", 1.0, scene);


  //Adding local axes for main box
  var localOriginBox = showLocalAxes(2, scene);
  localOriginBox.parent = mainbox;

  //Moving boxes on the x axis
  box1.position.x = -4.0;
  box2.position.x = -2.0;
  mainbox.position.x = 0;
  box4.position.x = 2;
  box5.position.x = 4;
  box6.position.x = 6;

  //Rotate box around the x axis
  box1.rotation.x = Math.PI / 6;

  //Rotate box around the y axis
  box2.rotation.y = Math.PI / 3;

  //Scaling on the x axis
  box4.scaling.x = 2;

  //Scaling on the y axis
  box5.scaling.y = 2;

  //Scaling on the z axis
  box6.scaling.z = 2;

  //Moving box7 relatively to box1
  box7.parent = box1;
  box7.position.z = -2;


  /**
   * funcion para convertir grados a radianes
   * @param {*} degrees 
   * @returns un mumero en radianes
   */
  function Degrees_to_radians(degrees) {

    var result_radians = degrees * (Math.PI / 180)

    return result_radians
  }


  var rot_x = Math.PI/128;
  var rot_y = 0;
  var rot_z = 0;

  var rot_count = 0; // for oscillation (rotation)
  var rot_temp;

  var a = 0; // for oscillation (translation)

  scene.onBeforeRenderObservable.add(() => {

    if(rot_count == 128) {
      rot_count = 0;
      rot_temp = rot_z;
      rot_z = rot_y;
      rot_y = rot_x;
      rot_x = rot_temp;
    }
    mainbox.addRotation(rot_x, rot_y, rot_z); // for adding rotation
    rot_count++;

    a +=0.005;
    var sign = Math.cos(a)/Math.abs(Math.cos(a)); //signoidal function for movement
    //mainbox.locallyTranslate(new BABYLON.Vector3(0.02 * sign, 0, 0.02 * sign));

  });

};


function Scene() {
  return (
    <SceneComponent antialias onSceneReady={onSceneReady} id="SceneCanvas" />
  );
}

export default Scene;
