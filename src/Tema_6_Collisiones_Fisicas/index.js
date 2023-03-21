import * as BABYLON from "babylonjs";
import SceneComponent from "../Babylon_components/SceneComponent";
import {PlayGround} from "./PlayGround";
import ammo from "ammo.js";


const onSceneReady = async (e = { engine: new BABYLON.Engine, scene: new BABYLON.Scene, canvas: new HTMLCanvasElement }) => {

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


  scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.AmmoJSPlugin(true,await ammo()));
  

  scene.gravity = new BABYLON.Vector3(0, -0.98, 0)
  scene.collitionsEnabled = true;

  camera.checkCollisions = true;
  camera.applyGravity = true;
  camera.ellipsoid =  new BABYLON.Vector3(2,1,2);

  var test =PlayGround({playground_width:100,playground_depth:100},scene)

  var sphere =  BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene)
  sphere.position = new BABYLON.Vector3(3, 5, 0);

  var box =  BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, scene);
  box.position.y = 1;

  box.checkCollisions = true;
  sphere.checkCollisions = true;
  
  //box.physicsImpostor = new BABYLON.PhysicsImpostor(box,BABYLON.PhysicsImpostor.BoxImpostor,{mass: 1, restitution:0.9}, scene)
  sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
	test.ground.physicsImpostor = new BABYLON.PhysicsImpostor(test.ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);


  sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(1, 0, 1));
  sphere.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(1, 0, 1, 0));


  sphere.material = new BABYLON.StandardMaterial("s-mat", scene);

  sphere.physicsImpostor.registerOnPhysicsCollide(test.ground.physicsImpostor, function(main, collided) {
    main.object.material.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
});



  scene.onBeforeRenderObservable.add(() => {
    if (box !== undefined) {
      const deltaTimeInMillis = scene.getEngine().getDeltaTime();

      const rpm = 30
      box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
      //box.rotate(BABYLON.Axis.Y, (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000));
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
