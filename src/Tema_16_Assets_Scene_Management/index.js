import * as BABYLON from "babylonjs";
import * as MATERIALS from "babylonjs-materials"
import * as GUI from "babylonjs-gui"
import "babylonjs-loaders"

import SceneComponent from "../Babylon_components/SceneComponent";

import ammo from "ammo.js"

import { showWorldAxis, showLocalAxes } from "../Babylon_components/Axes"
import { PlayGround } from "../Tema_6_Collisiones_Fisicas/PlayGround";
import { GizmoInterface } from "../Tema_9_Interacciones_interfaces/GizmoInterface";


import ufo from "../Assets/3Dmodels/ufo.glb"
import chair from "../Assets/3Dmodels/SheenChair.glb"

import * as subscene1 from "./subscene1";
import * as subscene2 from "./subscene2";


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


    // Sky material
    var skyboxMaterial = new MATERIALS.SkyMaterial("skyMaterial", scene);
    skyboxMaterial.backFaceCulling = false;

    // Sky mesh (box)
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
    skybox.material = skyboxMaterial;

    skybox.material.inclination = -0.35;


    showWorldAxis(8, scene);

    var gizmointerface = GizmoInterface(scene);
    gizmointerface.gizmos.boundingBoxGizmo.coloredMaterial.alpha = 0.5;
    gizmointerface.gizmos.boundingBoxGizmo.setEnabledScaling(false);


    var box = BABYLON.MeshBuilder.CreateBox("box", { size: .5 }, scene);
    box.position.set(2, 2, 3);
    box.visibility = 0.5

    //box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { restitution: 0.1, mass: 13 }, scene);

    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: .5 }, scene);
    sphere.position.set(-2, 5, 3);
    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { restitution: 0.9, mass: 14 }, scene);

    var playground = PlayGround({ playground_width: 100, playground_depth: 100 }, scene)
    playground.ground.physicsImpostor = new BABYLON.PhysicsImpostor(playground.ground, BABYLON.PhysicsImpostor.BoxImpostor, { restitution: 0.9, mass: 0 }, scene);

    box.XRpickable = true;
    sphere.XRpickable = true;

    var meshes = [];
    meshes.push(box, sphere, skybox);

    //Example of using BABYLON.SceneLoader.ImportMeshAsync
    // The first parameter can be used to specify which mesh to import. Here we import all meshes
    BABYLON.SceneLoader.ImportMesh(
        "",
        "https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/",
        "emoji_heart.glb",
        scene,
        function (meshes) {

            meshes[0].scaling = new BABYLON.Vector3(20, 20, 20);
            meshes[0].position = new BABYLON.Vector3(0, 0, 1);
            meshes[1].XRpickable = true;



        });

    //

    //Example of using BABYLON.AssetsManager to load a mesh and other assets

    const assetManager = new BABYLON.AssetsManager(scene);

    var container = new BABYLON.AssetContainer(scene);



    var loadUfo = assetManager.addMeshTask("task", "", ufo);

    loadUfo.onSuccess = function (task) {

        task.loadedMeshes[0].position = new BABYLON.Vector3(0, 2, 3);
        task.loadedMeshes[0].rotate(new BABYLON.Vector3(0, 1, 0), BABYLON.Tools.ToRadians(180), BABYLON.Space.LOCAL)

        var collider = attachToCollider(task.loadedMeshes[0])

        task.loadedMeshes.forEach((mesh) => {

            container.meshes.push(mesh);
        });

        container.meshes.push(collider);


    }

    loadUfo.onError = function (task, message, exception) {
        console.log(message, exception);
    };


    var loadChair = assetManager.addMeshTask("task", "", chair);

    loadChair.onSuccess = function (task) {


        task.loadedMeshes[0].position = new BABYLON.Vector3(0, 0, -1);

        var collider = attachToCollider(task.loadedMeshes[0])
        task.loadedMeshes[0].XRpickable = true;



        task.loadedMeshes.forEach((mesh) => {

            container.meshes.push(mesh);
        });

        container.meshes.push(collider);
    }

    loadChair.onError = function (task, message, exception) {
        console.log(message, exception);
    };

    assetManager.onFinish = function (tasks) {

        console.log("All tasks finished");


    }


    assetManager.load();


    //assets container demo
    container.meshes.push(box, sphere, skybox);
    //container.cameras.push(camera);



    //on click event

    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);


    var sub1 = subscene1.createSubScene(engine, canvas);
    var sub2 = subscene2.createSubScene(engine, canvas);


    var mainUI = ChangeSceneUIDemo(1, advancedTexture, scene);
    var ui1 = ChangeSceneUIDemo(2, advancedTexture, sub1);
    var ui2 = ChangeSceneUIDemo(0, advancedTexture, sub2);


    var renderLoopController = RenderLoopController(engine, scene, mainUI);

    renderLoopController.addScene(sub1, ui1);
    renderLoopController.addScene(sub2, ui2);



    var containerButton = GUI.Button.CreateSimpleButton("containerButton", "Remove elements from container");

    var toggle = true;

    containerButton.width = 0.2;
    containerButton.height = "40px";
    containerButton.color = "white";
    containerButton.background = "#220066";

    containerButton.onPointerClickObservable.add(function (evt) {
        if (toggle) {
            container.removeAllFromScene();
            toggle = false;
        } else {
            container.addAllToScene();
            toggle = true;
        }
    });

    mainUI.advancedTexture.addControl(containerButton);




    /**
     * Function to atach a (box mesh) collider with physics and interaction capabilities
     * @param {BABYLON.Mesh} rootMesh 
     * @returns 
     */
    function attachToCollider(rootMesh) {

        var collider = BABYLON.MeshBuilder.CreateBox(rootMesh.name + "_collider", { height: 1, width: 1, depth: 1 }, scene);
        collider.XRpickable = true;

        var boundingMinMax = rootMesh.getHierarchyBoundingVectors();
        var bounds = boundingMinMax.max.subtract(boundingMinMax.min);
        var geometricCenter = boundingMinMax.max.add(boundingMinMax.min).scale(0.5);

        collider.scaling.copyFrom(bounds);
        collider.visibility = 0;
        collider.physicsImpostor = new BABYLON.PhysicsImpostor(collider, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 99 }, scene);
        collider.position = geometricCenter;

        rootMesh.setParent(collider);

        return collider;

    }


    /**
     * Function to control the render loop of the engine
     * @param {BABYLON.Engine} engine the main engine
     * @param {GUI.AdvancedDynamicTexture} onScreenUI the UI to be displayed on the screen
     * @returns functions to add and remove subscenes from the render loop
     */
    function RenderLoopController(engine, scene, onScreenUI) {

        var sceneindex = 0;
        var subScenes = [];
        var rendering = true;

        var currentScene = { scene, ui: onScreenUI }
        subScenes.push(currentScene);

        currentScene.ui.Create();

        function addScene(scene, ui) {

            var subScene = { scene, ui }
            subScenes.push(subScene);
        }

        function setSceneIndex(index) {

            rendering = false;

            console.log("changing scene to " + index + "");

            subScenes[sceneindex].ui.Dispose();

            console.log("current ui disposed");

            sceneindex = index;

            var currentUI = subScenes[sceneindex].ui;
            currentUI.Create();

            rendering = true;


        }

        function getSceneIndex() {
            return sceneindex;
        }

        function getSceneIndexLength() {
            return subScenes.length;
        }


        engine.runRenderLoop(() => {

            if (subScenes[sceneindex] && rendering) {

                subScenes[sceneindex].scene.render();

            }

        });

        //var view = engine.registerView(canvas, camera);
        //engine.activeView.target= view;

        return { addScene, setSceneIndex, getSceneIndex, getSceneIndexLength };


    }

    /**
     * 
     * @param {Number} index 
     * @param {GUI.AdvancedDynamicTexture} advancedTexture 
     * @param {BABYLON.Scene} scene 
     * @returns 
     */
    function ChangeSceneUIDemo(index, advancedTexture, scene) {


        function Create() {


            advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
            var button = null;

            //create a GUI button
            button = GUI.Button.CreateSimpleButton("but", "A la escena " + index + "");
            button.width = 0.2;
            button.height = "40px";
            button.color = "white";
            button.background = "green";
            button.top = "10px";
            button.left = "10px";
            button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

            button.onPointerUpObservable.add(function () {

                renderLoopController.setSceneIndex(index);
                /*
                    if (index > renderLoopController.getSceneIndexLength() - 1) {
                        index = 0;
                        renderLoopController.setSceneIndex(index);
                    } else {
                        renderLoopController.setSceneIndex(index);
                        index++;
                    } */

            });


            advancedTexture.addControl(button);


        }


        function Dispose() {
            advancedTexture.dispose();
            advancedTexture = null;


        }


        return { advancedTexture, Create, Dispose };

    }








}


function Scene() {


    return (
        <SceneComponent antialias onSceneReady={onSceneReady} />

    );
}

export default Scene;
