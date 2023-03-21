import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import "babylonjs-loaders";



 //FUNCTION TO CREATE A SUBSCENE
 export  function createSubScene(engine,canvas) {

    var canvas = canvas
    //instance of a scene
    var subScene = new BABYLON.Scene(engine);

    //first we create a camera
    var camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 10, BABYLON.Vector3.Zero(), subScene);

    camera.attachControl(canvas, true);

    //then we create a light
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), subScene);
    //then we create a box
    var box = BABYLON.MeshBuilder.CreateBox("box1", { size: 2 }, subScene);
    //then we create a ground
    var ground = BABYLON.MeshBuilder.CreateGround("ground1", { width: 6, height: 6 }, subScene);

    //then we create a material
    var material = new BABYLON.StandardMaterial("material1", subScene);
    material.diffuseColor = new BABYLON.Color3(1, 0, 0);    
    //then we apply the material to the box
    box.material = material;

    return subScene;

}
