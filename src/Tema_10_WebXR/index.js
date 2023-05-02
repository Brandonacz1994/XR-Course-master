import * as BABYLON from "babylonjs";
import * as MATERIALS from "babylonjs-materials"
import * as GUI from "babylonjs-gui"
import 'babylonjs-loaders';

import SceneComponent from "../Babylon_components/SceneComponent";


import { showWorldAxis, showLocalAxes } from "../Babylon_components/Axes"
import { PlayGround } from "../Tema_6_Collisiones_Fisicas/PlayGround";
import { GizmoInterface } from "../Tema_9_Interacciones_interfaces/GizmoInterface";

import * as XR_Module from "./XR_Module";

import url from "../Tema_10_WebXR"

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

    var box = BABYLON.MeshBuilder.CreateBox("box", { size: 0.2 }, scene);
    box.position.y = 5;

    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { restitution: 0.1, mass: 13 }, scene);

    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.4 }, scene);
    sphere.position.set(0, 5, 3);
    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { restitution: 0.9, mass: 14 }, scene);

    box.XRpickable = true;
    sphere.XRpickable = true;


    var playground = PlayGround({ playground_width: 100, playground_depth: 100 }, scene)
    playground.ground.physicsImpostor = new BABYLON.PhysicsImpostor(playground.ground, BABYLON.PhysicsImpostor.BoxImpostor, { restitution: 0.9, mass: 0 }, scene);
    playground.ground.receiveShadows = true;
    
    //const shadowMaterial = new MATERIALS.ShadowOnlyMaterial('shadowOnly', scene);
    //playground.ground.material = shadowMaterial;

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;


    var sphere1 = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.2, segments: 32 }, scene);
    var sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.2, segments: 32 }, scene);
    var sphere3 = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.2, segments: 32 }, scene);

    sphere1.material = new BABYLON.PBRMaterial('metal', scene);
    sphere1.material.roughness = 0.25;
    sphere1.material.metallic = 1.0;
    sphere1.material.realTimeFiltering = true;
    sphere1.material.realTimeFilteringQuality = BABYLON.Constants.TEXTURE_FILTERING_QUALITY_HIGH;
    sphere1.position.y = 0.1;
    // sphere.position.z = 1;

    sphere2.setPivotMatrix(BABYLON.Matrix.Translation(0.2, 0.1, 0), false);
    sphere2.material = new BABYLON.PBRMaterial('metal', scene);
    sphere2.material.albedoColor = new BABYLON.Color3(0.8, 0.0, 0.3);
    sphere2.material.roughness = 0.1;
    sphere2.material.metallic = 0.0;

    sphere3.setPivotMatrix(BABYLON.Matrix.Translation(0.4, 0.1, 0), false);
    sphere3.material = new BABYLON.PBRMaterial('metal', scene);
    sphere3.material.roughness = 0.1;
    sphere3.material.metallic = 0.3;
    sphere3.material.albedoColor = new BABYLON.Color3(0.3, 0.0, 0.8);

    scene.registerBeforeRender(function () {
        sphere2.rotation.y += 0.01;
        sphere3.rotation.y += 0.01;
    });

    
    var meshes = [];
    meshes.push(box, sphere, skybox);

    var mesheswithShadows = [];
    mesheswithShadows.push(box,sphere,sphere1,sphere2,sphere3);

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


    const XR_experience = XR_Module.XR_Experience(playground.ground, skybox, mesheswithShadows, scene);


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
