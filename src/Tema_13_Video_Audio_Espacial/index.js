import * as BABYLON from "babylonjs";
import * as MATERIALS from "babylonjs-materials"
import * as GUI from "babylonjs-gui"
import "babylonjs-loaders"

import SceneComponent from "../Babylon_components/SceneComponent";

import ammo from "ammo.js"

import { showWorldAxis, showLocalAxes } from "../Babylon_components/Axes"
import { PlayGround } from "../Tema_6_Collisiones_Fisicas/PlayGround";
import { GizmoInterface } from "../Tema_9_Interacciones_interfaces/GizmoInterface";

import * as AV_module from "./AV_module";

import bus from "../Assets/3Dmodels/bus.gltf"
import chair from "../Assets/3Dmodels/SheenChair.glb"

import video1 from "../Assets/video/SonyVideoDemo.mp4"
import video2 from "../Assets/video/videoTextureSample.mp4"
import video3 from "../Assets/video/rickroll.mp4"


import marioMusic1 from "../Assets/audio/overworld.mp3"
import marioMusic2 from "../Assets/audio/hurry-overworld.mp3"
import marioCompletedFanfare from "../Assets/audio/level-completed.mp3"

import space_music from "../Assets/audio/CGI.mp3"

import audio_jump from "../Assets/audio/arcade-retro-jump.wav"

import audio_start from "../Assets/audio/software-interface-start.wav"
import audio_back from "../Assets/audio/software-interface-back.wav"
import audio_remove from "../Assets/audio/software-interface-remove.wav"

import audio_correct from "../Assets/audio/correct-answer.wav"
import audio_wrong from "../Assets/audio/wrong-answer.wav"

import idle_bus from "../Assets/audio/Idle-bus.wav"
import door_bus from "../Assets/audio/door-bus.wav"
import BabylonScene from "../Babylon_components/BabylonScene";


import * as XR_Module from "../Tema_10_WebXR/XR_Module";


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

    /**
     * 
     * @param {BABYLON.Mesh} mesh mesh to add reflective texture.
     * @param {[BABYLON.Mesh]} otherMeshs array of meshes to reflect.
     * @param {BABYLON.Scene} scene a constructed babylon js scene.
     */
    function CreateReflectionTexture(mesh, otherMeshs, scene) {

        // Reflection probe
        var rp = new BABYLON.ReflectionProbe('ref', 512, scene);
        otherMeshs.forEach(element => {

            rp.renderList.push(element);
        });

        // PBR
        var pbr = new BABYLON.PBRMaterial('pbr', scene);
        pbr.reflectionTexture = rp.cubeTexture;
        mesh.material = pbr;

        rp.attachToMesh(mesh);

    }
    //CreateReflectionTexture(box, meshes, scene);
    //CreateReflectionTexture(sphere, meshes, scene);

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

    const assetManager = new BABYLON.AssetsManager(scene);

    var tasky = assetManager.addMeshTask("task", "", bus);

    tasky.onSuccess = function (task) {

        console.log(task.loadedMeshes);
        task.loadedMeshes[0].position = new BABYLON.Vector3(4, 2, 3);
        task.loadedMeshes[0].scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
        var collider = attachToCollider(task.loadedMeshes[0]);


        var audiobusSettings = {
            loop: true,
            autoPlay: true,
            spatialSound: true,
            distanceModel: "exponential",
            maxDistance: 10,
            refDistance: 5,
            rolloffFactor: 0.8,
        };


        var busSound = SoundSpatialToMesh(collider, idle_bus, audiobusSettings, scene);

        var opendoor_sound = new BABYLON.Sound("door", door_bus, scene);

        collider.actionManager = new BABYLON.ActionManager(scene)
        collider.actionManager.registerAction(new BABYLON.PlaySoundAction(BABYLON.ActionManager.OnPickUpTrigger, opendoor_sound));


    }

    tasky.onError = function (task, message, exception) {
        console.log(message, exception);
    };

    /**
     * 
     * @param {BABYLON.Mesh} mesh 
     * @param {String} audioUrl 
     * @param {*} options.loop
     * @param {*} options.autoPlay
     * @param {*} options.spatialSound
     * @param {*} options.distanceModel
     * @param {*} options.maxDistance
     * @param {*} options.refDistance
     * @param {*} options.rolloffFactor
     * @param {*} scene 
     */
    function SoundSpatialToMesh(mesh, audioUrl, options = { loop: false, autoPlay: false, spatialSound: true, distanceModel: "exponential", maxDistance: 10, refDistance: 5, rolloffFactor: 0.8, }, scene) {

        const sound = new BABYLON.Sound(mesh.name + "_sound", audioUrl, scene, () => {
            console.log("ready to play video sound: " + audioUrl)
            sound.play();

        }, options);

        sound.attachToMesh(mesh);

        return sound;
    }


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

    assetManager.load();



    var videoSize = 1;

    let videoTextureSettings = {
        loop: false,
        autoPlay: false,
        autoUpdateTexture: true,
        muted: true,
        poster: ''
    };

    var AudioSettings = {
        loop: false,
        autoPlay: false,
        spatialSound: true,
        distanceModel: "exponential",
        maxDistance: 10,
        refDistance: 5,
        rolloffFactor: 0.8,
    };

    var videoPlaneOptions = {
        height: videoSize,
        width: videoSize * 1.77,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    };



    var videoplayer = AV_module.VideoPlayerTexture(video3, null, videoTextureSettings, AudioSettings, videoPlaneOptions, scene);
    //videoplayer.videoSound.attachToMesh(collider);



    let videoCube = BABYLON.MeshBuilder.CreateBox("videocube", { size: 2 }, scene);
    videoCube.position = new BABYLON.Vector3(0, 1, 4);
    videoCube.physicsImpostor = new BABYLON.PhysicsImpostor(videoCube, BABYLON.PhysicsImpostor.BoxImpostor, { restitution: 0.9, mass: 1 }, scene);
    videoCube.XRpickable = true;


    videoCube.actionManager = new BABYLON.ActionManager(scene)
    videoCube.actionManager.registerAction(new BABYLON.PlaySoundAction(BABYLON.ActionManager.OnPickUpTrigger, new BABYLON.Sound("up", audio_back, scene)));

    videoCube.actionManager.registerAction(new BABYLON.PlaySoundAction(BABYLON.ActionManager.OnPickDownTrigger, new BABYLON.Sound("down", audio_start, scene)));

    AV_module.VideoTextureToMesh(video2, videoCube, { loop: true, autoPlay: true, muted: true }, scene);




    var mesheswithShadows = [box,sphere];

    XR_Module.XR_Experience(playground.ground,skybox,mesheswithShadows,scene);


    engine.runRenderLoop(() => {
        if (scene) {
          scene.render();
        }
      });


}


function Scene() {


    return (
        <SceneComponent antialias onSceneReady={onSceneReady} />

    );
}

export default Scene;
