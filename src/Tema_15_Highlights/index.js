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


    //Rendering edges with a different color
    box.enableEdgesRendering();
    box.edgesColor.copyFromFloats(0, 0, 1, 0.8);
    box.edgesWidth = 2;
    box.edgesShareWithInstances = true;

    //Rendering hightligt with babylon.highlightlayer
    engine.setStencilBuffer(true);
    var hl = new BABYLON.HighlightLayer("hl1", scene);
    hl.addMesh(sphere, BABYLON.Color3.Red());

    //picking the vertices of the mesh
    var vertexData = BABYLON.VertexData.ExtractFromMesh(box);
    var positions = vertexData.positions;
    var indices = vertexData.indices;
    var normals = vertexData.normals;

    //select mesh edges and vertices

    var edges = [];
    var ridges = [];


    var mat = new BABYLON.StandardMaterial("material", scene);
    mat.emissiveColor = new BABYLON.Color3(0, 0, 1);
    mat.alpha = 0;
    var edge = BABYLON.Mesh.CreateSphere("sphere", 10, 0.08, scene);


    var makeClickResponse = function (mesh) {
        mesh.actionManager = new BABYLON.ActionManager(scene);
        mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (m) {
                // console.log('In');
                m.meshUnderPointer.material.alpha = 1;
            })
        );

        mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (m) {
                // console.log('Out');
                m.meshUnderPointer.material.alpha = 0;
            })
        );
    }



    var createFacePoints = function (id, pos, mesh) {
        edges[id] = edge.clone("helper");
        edges[id].material = mat.clone();
        edges[id].position = pos;
        edges[id].parent = mesh;
        makeClickResponse(edges[id]);
    };



    function getVertices(mesh) {
        if (!mesh) { return; }
        var piv = mesh.getPivotPoint();
        var positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        if (!positions) { return; }
        var numberOfPoints = positions.length / 3;

        var level = false;
        var map = [];
        var poGlob = [];
        for (var i = 0; i < numberOfPoints; i++) {
            var p = new BABYLON.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
            var found = false;
            for (var index = 0; index < map.length && !found; index++) {
                var array = map[index];
                var p0 = array[0];
                if (p0.equals(p) || (p0.subtract(p)).lengthSquared() < 0.01) {
                    found = true;
                }
            }
            if (!found) {
                var array = [];
                poGlob.push(BABYLON.Vector3.TransformCoordinates(p, mesh.getWorldMatrix()));
                array.push(p);
                map.push(array);
            }
        }
        return poGlob;
    }

    function addEdges(id, vStart, vEnd, mesh) {
        var distance = BABYLON.Vector3.Distance(vStart, vEnd);
        console.log(vStart, vEnd, distance);

        ridges[id] = BABYLON.MeshBuilder.CreateTube("tube", { path: [vStart, vEnd,], radius: .02 }, scene);
        ridges[id].material = mat.clone();

        ridges[id].parent = mesh;


        makeClickResponse(ridges[id]);
    }


    function createEdgesAndVertices(mesh) {
        var vertInfo = [];
        var startVertice;
        var endVertice;

        vertInfo = getVertices(mesh);
        console.log(vertInfo);
        for (var i = 0; i < vertInfo.length; i++) {
            createFacePoints(i, vertInfo[i], mesh);
            if (i != vertInfo.length - 1) {
                startVertice = vertInfo[i];
                endVertice = vertInfo[i + 1];
            } else {
                startVertice = vertInfo[0];
                endVertice = vertInfo[i];
            }
            addEdges(i, startVertice, endVertice, mesh);

        }

    }


    createEdgesAndVertices(box);




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

            meshes[0].scaling = new BABYLON.Vector3(20, 20, 20);
            meshes[0].position = new BABYLON.Vector3(0, 0, 1);
            meshes[1].XRpickable = true;

            hl.addMesh(meshes[1], BABYLON.Color3.FromInts(255, 0, 255));



        });



    const assetManager = new BABYLON.AssetsManager(scene);

    var tasky = assetManager.addMeshTask("task", "", ufo);

    tasky.onSuccess = function (task) {

        task.loadedMeshes[0].position = new BABYLON.Vector3(0, 2, 3);
        task.loadedMeshes[0].rotate(new BABYLON.Vector3(0, 1, 0), BABYLON.Tools.ToRadians(180), BABYLON.Space.LOCAL)

        hl.addMesh(task.loadedMeshes[1], BABYLON.Color3.FromInts(0, 0, 255));

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
