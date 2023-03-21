import * as BABYLON from "babylonjs";
import SceneComponent from "../Babylon_components/SceneComponent";
import * as Cameras_Module from "../Tema_3_Camaras/Cameras_Module"


const onSceneReady = (e = { engine: BABYLON.Engine, scene: BABYLON.Scene, canvas: HTMLCanvasElement }) => {

    const { canvas, scene, engine } = e;


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

    // Our set of diferent cameras examples by using Cameras_Module.

    //Cameras_Module.FreeCameraDefault(canvas, scene);
    //Cameras_Module.UniversalCameraDefault(canvas, scene);
    //Cameras_Module.ArcRotateCameraDefault(canvas, scene);
    Cameras_Module.FollowCameraDefault(canvas, box, scene);


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
