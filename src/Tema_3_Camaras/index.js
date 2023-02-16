import React from "react";
import * as BABYLON from "babylonjs";
import SceneComponent from "../Babylon_components/SceneComponent";


const onSceneReady = (e) => {

    const { canvas, scene, engine } = e;

    /********** FREE CAMERA EXAMPLE **************************/

    // This creates and positions a free camera (non-mesh)
    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    /********** UNIVERSAL CAMERA EXAMPLE **************************/

    // This creates and positions a universal camera (non-mesh)
    //const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 0, -10), scene);

    /********** ArcRotateCamera EXAMPLE **************************/

    // Creates, angles, distances and targets the ArcRotateCamera
    //var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    //This positions the camera
    //camera.setPosition(new BABYLON.Vector3(1, 12, 5));

  

    /**************************************************************/

    // This targets the camera to scene origin
    camera.setTarget(new BABYLON.Vector3(1,1,1));

    // This attaches the camera to the canvas
    camera.attachControl(canvas, false);

    /********** FOLLOW CAMERA EXAMPLE **************************/

    /*
    
    //This creates and initially positions a follow camera 	
    var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, -10), scene);
	
	//The goal distance of camera from target
	camera.radius = 30;
	
	// The goal height of camera above local origin (centre) of target
	camera.heightOffset = 10;
	
	// The goal rotation of camera around local origin (centre) of target in x y plane
	camera.rotationOffset = 0;
	
	//Acceleration of camera in moving from current to goal position
	camera.cameraAcceleration = 0.005
	
	//The speed at which acceleration is halted 
	camera.maxCameraSpeed = 10
	
	//camera.target is set after the target's creation

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    
	// This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    
    */
    

    
	/********** DEVICE ORIENTATION CAMERA EXAMPLE **************************/

    

    // This creates and positions a device orientation camera 	
    //var camera = new BABYLON.DeviceOrientationCamera("DevOr_camera", new BABYLON.Vector3(0, 0, 0), scene);

    // This targets the camera to scene origin
    //camera.setTarget(new BABYLON.Vector3(0, 0, 10));

    // This attaches the camera to the canvas
    //camera.attachControl(canvas, true);

    
	
	/**************************************************************/


    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'box' shape.
    var box = BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, scene);

    // Move the box upward 1/2 its height
    box.position.y = 1;

    // Our built-in 'ground' shape.
    BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);


    /*****************SET TARGET FOR CAMERA************************/ 
	//camera.lockedTarget = box;
	/**************************************************************/


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
