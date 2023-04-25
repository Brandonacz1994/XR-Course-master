import * as BABYLON from "babylonjs";
import * as MATERIALS from "babylonjs-materials"
import * as GUI from "babylonjs-gui"
import SceneComponent from "../Babylon_components/SceneComponent";
import { showWorldAxis, showLocalAxes } from "../Babylon_components/Axes"
import { PlayGround } from "../Tema_6_Collisiones_Fisicas/PlayGround";
import { GizmoInterface } from "./GizmoInterface";
import * as GUI2D from "./GUI2D"
import * as GUI3D from "./GUI3D"

import { VideoUI } from "./VideoUI";
import { WindowUI } from "./WindowUI";

import videoRickroll from "../Assets/video/rickroll.mp4"

import ammo from "ammo.js"


const onSceneReady = async (e = { engine: new BABYLON.Engine, scene: new BABYLON.Scene, canvas: new HTMLCanvasElement }) => {

    const { canvas, scene, engine } = e;

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    //const camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 0, new BABYLON.Vector3(2, 3, 4), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    //camera.setPosition(new BABYLON.Vector3(10, 3, -10))

    // This attaches the camera to the canvass
    camera.attachControl(canvas, false);


    //scene.clearColor = new BABYLON.Color3(0, 0, 0);

    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.AmmoJSPlugin(true, await ammo()));


    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;



    showWorldAxis(8, scene);

    //GUI2D.GUI2D(scene);
    //GUI2D.SelectionPanelHelper(scene);

    //GUI3D.HorizontalPanel(scene);
    //GUI3D.SpherePanel(scene);
    //GUI3D.StackPanel(scene);


    //GUI3D.HolographicSlate(scene);



    // GUI

    var videoSettings = {
        loop: false,
        autoPlay: false,
        autoUpdateTexture: true,
        muted: false,
        poster: ''
    };


    var videoGUIDemo = VideoUI("VideoUIDemo", 1920,1080, videoRickroll, videoSettings, scene);

    //var windowGUIDemo = WindowUI("WindowUIDemo", 1920, 1080, scene);




    GizmoInterface(scene);


    var box = BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, scene);
    box.position.set(-3, 5, 0);

    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { restitution: 0.1, mass: 13 }, scene);

    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 4 }, scene);
    sphere.position.set(3, 5, 3);
    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { restitution: 0.9, mass: 14 }, scene);

    var playground = PlayGround({ playground_width: 100, playground_depth: 100 }, scene)
    playground.ground.physicsImpostor = new BABYLON.PhysicsImpostor(playground.ground, BABYLON.PhysicsImpostor.BoxImpostor, { restitution: 0.9, mass: 0 }, scene);

    box.XRpickable = true;
    sphere.XRpickable = true;


    var advancedTextureFullScreen = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

    var button1 = GUI.Button.CreateSimpleButton("but1", "Presioname");
    button1.width = "150px"
    button1.height = "40px";
    button1.color = "white";
    button1.cornerRadius = 20;
    button1.background = "green";
    button1.fontSize = "20px"
    button1.onPointerUpObservable.add(function () {
        alert("Lo hiciste!!");
    });
    advancedTextureFullScreen.addControl(button1);


    // GUI
    var meshGUI = BABYLON.MeshBuilder.CreatePlane("plane", {
        width: 1 * 1.8,
        height: 1,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    }, scene);

    meshGUI.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;


    var advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(meshGUI);

    var container = new GUI.Rectangle("container");
    container.width = 1;
    container.height = 1;
    container.thickness = 0;
    container.background = "white";
    container.alpha = 0.05;
    container.zIndex = -1;


    advancedTexture.addControl(container);
    advancedTexture.scaleTo(300, 150);

    var button1 = GUI.Button.CreateSimpleButton("but1", "Presioname");
    //button1.width = "400px";
    //button1.height = "100px";
    button1.color = "white";
    button1.fontSize = 28;
    button1.background = "green";
    button1.onPointerUpObservable.add(function () {
        alert("Lo hiciste!");
    });
    advancedTexture.addControl(button1);

    meshGUI.parent = box;
    meshGUI.position.addInPlaceFromFloats(0, 2, 0);


    engine.runRenderLoop(() => {
        if (scene) {
            scene.render();
        }
    });


}


function Scene() {
    return (
        <SceneComponent antialias onSceneReady={onSceneReady} id="SceneCanvas" />
    );
}

export default Scene;
