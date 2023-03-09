import * as BABYLON from "babylonjs";
import * as MATERIALS from "babylonjs-materials"
import * as GUI from "babylonjs-gui"
import "babylonjs-loaders"

import SceneComponent from "../Babylon_components/SceneComponent";

import ammo from "ammo.js"

import { showWorldAxis, showLocalAxes } from "../Babylon_components/Axes"
import { PlayGround } from "../Tema_6_Collisiones_Fisicas/PlayGround";
import { GizmoInterface } from "../Tema_9_Interacciones_interfaces/GizmoInterface";

import { interactiveRobotimport } from "./interactiveRobotimport";

import ufo from "../Assets/3Dmodels/ufo.glb"
import chair from "../Assets/3Dmodels/SheenChair.glb"


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

    GizmoInterface(scene);

    var box = BABYLON.MeshBuilder.CreateBox("box", { size: .5 }, scene);
    box.position.set(2, 5, 3);

    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { restitution: 0.1, mass: 13 }, scene);

    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: .5 }, scene);
    sphere.position.set(-2, 5, 3);
    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { restitution: 0.9, mass: 14 }, scene);

    var playground = PlayGround({ playground_width: 100, playground_depth: 100 }, scene)
    playground.ground.physicsImpostor = new BABYLON.PhysicsImpostor(playground.ground, BABYLON.PhysicsImpostor.BoxImpostor, { restitution: 0.9, mass: 0 }, scene);

    box.XRpickable = true;
    sphere.XRpickable = true;

    var meshes = [];
    meshes.push(box, sphere, skybox);


    // The first parameter can be used to specify which mesh to import. Here we import all meshes

    const mychair = await BABYLON.SceneLoader.ImportMeshAsync(
        "",
        chair,
        "",
        scene,
        function (meshes) {

        },
    );

    mychair.meshes[0].position = new BABYLON.Vector3(0, 0, -1);
    attachToCollider(mychair.meshes[0]);

    BABYLON.SceneLoader.ImportMesh(
        "",
        "https://raw.githubusercontent.com/BabylonJS/MeshesLibrary/master/",
        "emoji_heart.glb",
        scene,
        function (meshes) {
            console.log(meshes);
            meshes[0].scaling = new BABYLON.Vector3(20, 20, 20);
            meshes[0].position = new BABYLON.Vector3(0, 0, 1);
            meshes[1].XRpickable = true;

        });



    const assetManager = new BABYLON.AssetsManager(scene);

    var tasky = assetManager.addMeshTask("task", "", ufo);

    tasky.onSuccess = function (task) {

        console.log(task.loadedMeshes);
        task.loadedMeshes[0].position = new BABYLON.Vector3(0, 2, 3);
        task.loadedMeshes[0].rotate(new BABYLON.Vector3(0, 1, 0), BABYLON.Tools.ToRadians(180), BABYLON.Space.LOCAL)
        attachToCollider(task.loadedMeshes[0])
    }

    tasky.onError = function (task, message, exception) {
        console.log(message, exception);
    };

    assetManager.load();

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

    interactiveRobotimport(scene);

}


function Scene() {


    return (
        <SceneComponent antialias onSceneReady={onSceneReady} />

    );
}

export default Scene;
