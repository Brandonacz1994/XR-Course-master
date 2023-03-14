import * as BABYLON from "babylonjs";
import * as MATERIALS from "babylonjs-materials"
import * as GUI from "babylonjs-gui"
import "babylonjs-loaders"

import SceneComponent from "../Babylon_components/SceneComponent";

import ammo from "ammo.js"

import { showWorldAxis, showLocalAxes } from "../Babylon_components/Axes"
import { PlayGround } from "../Tema_6_Collisiones_Fisicas/PlayGround";
import { GizmoInterface } from "../Tema_9_Interacciones_interfaces/GizmoInterface";

import * as AV_module from "../Tema_13_Video_Audio_Espacial/AV_module";

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


    var playground = PlayGround({ playground_width: 100, playground_depth: 100 }, scene)
    playground.ground.physicsImpostor = new BABYLON.PhysicsImpostor(playground.ground, BABYLON.PhysicsImpostor.BoxImpostor, { restitution: 0.9, mass: 0 }, scene);


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

        //Using registerBeforeRender for a generic animation
        var direction = true;
        scene.registerBeforeRender(function () {
            // Check if box is moving right
            if (collider.position.z < 2 && direction) {
                // Increment box position to the right
                collider.position.z += 0.05;
            }
            else {
                // Swap directions to move left
                direction = false;
            }

            // Check if box is moving left
            if (collider.position.z > -2 && !direction) {
                // Decrement box position to the left
                collider.position.z -= 0.05;
            }
            else {
                // Swap directions to move right
                direction = true;
            }
        });


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


    let videoCube = BABYLON.MeshBuilder.CreateBox("videocube", { size: 2 }, scene);
    videoCube.position = new BABYLON.Vector3(0, 1, -1);
    videoCube.physicsImpostor = new BABYLON.PhysicsImpostor(videoCube, BABYLON.PhysicsImpostor.BoxImpostor, { restitution: 0.9, mass: 1 }, scene);
    videoCube.XRpickable = true;

    //Using registerBeforeRender for a generic animation
    var direction = true;

    scene.registerBeforeRender(function () {
        // Check if box is moving right
        if (videoCube.position.x < 2 && direction) {
            // Increment box position to the right
            videoCube.position.x += 0.05;
            //videoCube.rotation.y += BABYLON.Tools.ToRadians(1);
        }
        else {
            // Swap directions to move left
            direction = false;
        }

        // Check if box is moving left
        if (videoCube.position.x > -2 && !direction) {
            // Decrement box position to the left
            videoCube.position.x -= 0.05;
        }
        else {
            // Swap directions to move right
            direction = true;
        }
    });

    /*scene.onBeforeRenderObservable.add(() => {

        // Check if box is moving right
        if (videoCube.position.x < 2 && direction) {
            // Increment box position to the right
            videoCube.position.x += 0.05;
        }
        else {
            // Swap directions to move left
            direction = false;
        }

        // Check if box is moving left
        if (videoCube.position.x > -2 && !direction) {
            // Decrement box position to the left
            videoCube.position.x -= 0.05;
        }
        else {
            // Swap directions to move right
            direction = true;
        }


    })*/

   

    var frameRate = 10;

    //Position Animation
    var xSlide = new BABYLON.Animation("xSlide", "position.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var keyFramesP = [];

    keyFramesP.push({
        frame: 0,
        value: 4
    });

    keyFramesP.push({
        frame: frameRate*1.5,
        value: -4
    });

    keyFramesP.push({
        frame: frameRate*3,
        value: 4
    });


    xSlide.setKeys(keyFramesP);

    var easingFunction = new BABYLON.SineEase();
    // For each easing function, you can choose beetween EASEIN (default), EASEOUT, EASEINOUT
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    // Adding easing function to my animation
    xSlide.setEasingFunction(easingFunction);

    //Rotation Animation
    var yRot = new BABYLON.Animation("yRot", "rotation.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var keyFramesR = [];

    keyFramesR.push({
        frame: 0,
        value: 0
    });

    keyFramesR.push({
        frame: frameRate,
        value: Math.PI
    });

    keyFramesR.push({
        frame: 2 * frameRate,
        value: 2 * Math.PI
    });


    yRot.setKeys(keyFramesR);

    var movein = new BABYLON.Animation("movein", "position", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var movein_keys = [];

    movein_keys.push({
        frame: 0,
        value: new BABYLON.Vector3(0, 1, 5)
    });

    movein_keys.push({
        frame: 3 * frameRate,
        value: new BABYLON.Vector3(5, 2, 5)
    });

    movein_keys.push({
        frame: 5 * frameRate,
        value: new BABYLON.Vector3(-5, 2, -5)
    });

    movein_keys.push({
        frame: 8 * frameRate,
        value: new BABYLON.Vector3(0, 1, 5)
    });

    movein.setKeys(movein_keys);



     let videoCube1 = BABYLON.MeshBuilder.CreateBox("videocube", { size: 2 }, scene);
    videoCube1.position = new BABYLON.Vector3(0, 1, 2);
    videoCube1.XRpickable = true;

    let videoCube2 = BABYLON.MeshBuilder.CreateBox("videocube", { size: 2 }, scene);
    videoCube2.position = new BABYLON.Vector3(0, 1, 5);
    videoCube2.XRpickable = true;



    var animation1 = scene.beginDirectAnimation(videoCube1, [xSlide, yRot], 0, 3 * frameRate, true);
    //animations have these functions for control
    /*animation1.stop();
    animation1.pause();
    animation1.restart();
    animation1.reset();*/

    var nextAnimation = function () {
        scene.beginDirectAnimation(videoCube2, [movein], 0, 8 * frameRate, true);
    }


    scene.beginDirectAnimation(videoCube2, [yRot], 0, 2 * frameRate, false, 1, nextAnimation);



    /*
    // Create the animation group
    var animationGroup = new BABYLON.AnimationGroup("my group");
    animationGroup.addTargetedAnimation(xSlide, videoCube2);
    animationGroup.addTargetedAnimation(yRot, videoCube2);
    animationGroup.addTargetedAnimation(movein, videoCube1);

    // Make sure to normalize animations to the same timeline
    //animationGroup.normalize(0, 100);

    // UI
    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var panel = new GUI.StackPanel();
    panel.isVertical = false;
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    advancedTexture.addControl(panel);

    var addButton = function (text, callback) {
        var button = GUI.Button.CreateSimpleButton("button", text);
        button.width = "140px";
        button.height = "40px";
        button.color = "white";
        button.background = "green";
        button.paddingLeft = "10px";
        button.paddingRight = "10px";
        button.onPointerUpObservable.add(function () {
            callback();
        });
        panel.addControl(button);
    }

    addButton("Play", function () {
        animationGroup.play(true);
    });

    addButton("Pause", function () {
        animationGroup.pause();
    });

    addButton("Stop", function () {
        animationGroup.reset();
        animationGroup.stop();
    });

    */





    videoCube.actionManager = new BABYLON.ActionManager(scene)
    videoCube.actionManager.registerAction(new BABYLON.PlaySoundAction(BABYLON.ActionManager.OnPickUpTrigger, new BABYLON.Sound("up", audio_back, scene)));
    videoCube.actionManager.registerAction(new BABYLON.PlaySoundAction(BABYLON.ActionManager.OnPickDownTrigger, new BABYLON.Sound("down", audio_start, scene)));

    videoCube1.actionManager = new BABYLON.ActionManager(scene)
    videoCube1.actionManager.registerAction(new BABYLON.PlaySoundAction(BABYLON.ActionManager.OnPickUpTrigger, new BABYLON.Sound("up", audio_back, scene)));
    videoCube1.actionManager.registerAction(new BABYLON.PlaySoundAction(BABYLON.ActionManager.OnPickDownTrigger, new BABYLON.Sound("down", audio_start, scene)));

    videoCube2.actionManager = new BABYLON.ActionManager(scene)
    videoCube2.actionManager.registerAction(new BABYLON.PlaySoundAction(BABYLON.ActionManager.OnPickUpTrigger, new BABYLON.Sound("up", audio_back, scene)));
    videoCube2.actionManager.registerAction(new BABYLON.PlaySoundAction(BABYLON.ActionManager.OnPickDownTrigger, new BABYLON.Sound("down", audio_start, scene)));

    AV_module.VideoTextureToMesh(video2, videoCube, { loop: true, autoPlay: true, muted: true }, scene);

    AV_module.VideoTextureToMesh(video2, videoCube1, { loop: true, autoPlay: true, muted: true }, scene);

    AV_module.VideoTextureToMesh(video2, videoCube2, { loop: true, autoPlay: true, muted: true }, scene);









}


function Scene() {


    return (
        <SceneComponent antialias onSceneReady={onSceneReady} />

    );
}

export default Scene;
