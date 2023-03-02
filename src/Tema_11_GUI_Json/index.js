import * as BABYLON from "babylonjs";
import * as MATERIALS from "babylonjs-materials"
import * as GUI from "babylonjs-gui"

import SceneComponent from "../Babylon_components/SceneComponent";


import { showWorldAxis, showLocalAxes } from "../Babylon_components/Axes"
import { PlayGround } from "../Tema_6_Collisiones_Fisicas/PlayGround";
import { GizmoInterface } from "../Tema_9_Interacciones_interfaces/GizmoInterface";

import testUI from "./testUI.json"
import pickerUI from "./ColorPickerGui.json"
import demoUI from "./guiTexture.json"

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

    // Skybox
    /*var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(spacebox, scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;	*/

    // Sky material
    var skyboxMaterial = new MATERIALS.SkyMaterial("skyMaterial", scene);
    skyboxMaterial.backFaceCulling = false;

    // Sky mesh (box)
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
    skybox.material = skyboxMaterial;

    skybox.material.inclination = -0.35;


    showWorldAxis(8, scene);

    GizmoInterface(scene);

    var box = BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, scene);
    box.position.y = 5;

    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { restitution: 0.1, mass: 13 }, scene);

    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 4 }, scene);
    sphere.position.set(0, 5, 3);
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

    //const XR_experience = XR_Module.XR_Experience(playground.ground, skybox, scene);



    // Load a GUI from a URL JSON.
    let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);

    // Set the ideal W and H if you wish to scale with the window.
    advancedTexture.idealWidth = 1920;
    advancedTexture.idealHeight = 1080;

    //let miniAdvancedTexture =await GUI.AdvancedDynamicTexture.ParseFromFileAsync(pickerUI)

    let loadedGUI = await advancedTexture.parseSerializedObject(testUI);

    // Get controls by name
    let element = advancedTexture.getControlByName("Button");
    element.isVisible = true;





    /* // Get controls by name
    let element = advancedTexture.getControlByName("Button_XR");

    element.onPointerClickObservable.add(()=>{
        console.log(element);
    })*/


    let dragging = null;
    let mouseStart = new BABYLON.Vector2.Zero();


    /**
     * 
     * @param {GUI.Control} component 
     * @param {GUI.AdvancedDynamicTexture} advancedTexture 
     * @returns 
     */
    function createDragableComponent(component, advancedTexture) {

        // element.isVisible = false;

        component.isPointerBlocker = true;

        component.onPointerDownObservable.add(ev => {
            dragging = component;
            mouseStart.x = scene.pointerX;
            mouseStart.y = scene.pointerY;
            camera.detachControl();
            component.isPointerBlocker = false;
            console.log("down");
        });

        component.onPointerUpObservable.add(() => {

            if (dragging) {

                dragging.isPointerBlocker = true;

                dragging = null;
                camera.attachControl(canvas, true);
                console.log("up");
            }

        });

        return component;
    }

    createDragableComponent(element, advancedTexture);


    //added observables to scene to check pointer events
    scene.onPointerObservable.add(info => {
        if (info.type === BABYLON.PointerEventTypes.POINTERDOWN) {

        }

        if (info.type === BABYLON.PointerEventTypes.POINTERUP) {

        } else if (info.type === BABYLON.PointerEventTypes.POINTERMOVE && dragging) {
            const deltaX = scene.pointerX - mouseStart.x;
            const deltaY = scene.pointerY - mouseStart.y;
            dragging.topInPixels += deltaY;
            dragging.leftInPixels += deltaX;
            mouseStart.x = scene.pointerX;
            mouseStart.y = scene.pointerY;
            console.log(deltaX, deltaY);
        }
    })








}


function Scene() {


    return (
        <SceneComponent antialias onSceneReady={onSceneReady} />

    );
}

export default Scene;
