import * as BABYLON from "babylonjs";
import SceneComponent from "../Babylon_components/SceneComponent";
import * as Lights_Module from "./Lights_Module"

import batman_texture from '../Tema_4_Iluminacion/batman.png'


const onSceneReady = (e = { engine: new BABYLON.Engine, scene: new BABYLON.Scene, canvas: new HTMLCanvasElement  }) => {

  const { canvas, scene, engine } = e;
  // This creates and positions a free camera (non-mesh)
  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, false);

  Lights_Module.DirectionalLight({diffuseColor:"#ffffff"},scene);
  //Lights_Module.PointLight(scene);
  Lights_Module.SpotLight(scene);
  //Lights_Module.HemisphericLight(scene);
  //Lights_Module.EmissiveLightFromTexture(batman_texture,scene);

  var sphere = new BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene)
  sphere.position = new BABYLON.Vector3(3, 1, 0);

  var box = new BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, scene);
  box.position.y = 1;

  // Our built-in 'ground' shape.
  BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);


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
