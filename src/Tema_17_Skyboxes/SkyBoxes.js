import * as BABYLON from 'babylonjs';
import * as MATERIALS from 'babylonjs-materials';


import 'babylonjs-loaders';

/**
 * Example 1: Skybox using a SkyMaterial
 * @param {*} params 
 */
export function SkyMaterialDemo(size,scene) {

  var skyboxMaterial = new MATERIALS.SkyMaterial("skyMaterial", scene);
  skyboxMaterial.backFaceCulling = false;

  // Sky mesh (box)
  var skybox = BABYLON.Mesh.CreateBox("skyBox", size, scene);
  skybox.material = skyboxMaterial;

  skybox.material.inclination = -0.35;
    
}



/**
 * Example 2: Skybox using a CubeTexture
 * @param {*} scene 
 */
export function SkyCubeTextureDemo(ImagesArray,size,scene) {

  var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: size}, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;

  //skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/skybox", scene);
  /*
  var imagesCube = ["textures/skybox/skybox_px.jpg",
    "textures/skybox/skybox_py.jpg",
    "textures/skybox/skybox_pz.jpg",
    "textures/skybox/skybox_nx.jpg",
    "textures/skybox/skybox_ny.jpg",
    "textures/skybox/skybox_nz.jpg"]
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture.CreateFromImages(imagesCube,scene);
  */

  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture.CreateFromImages(ImagesArray, scene);

  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;

    
}

/**
 * Example 3: Skybox using a HDRTexture
 * @param {*} scene 
 */
export function SkyHDRTextureDemo(URL,size,scene) {

    var skybox3 = BABYLON.Mesh.CreateBox("skyBox3", size, scene);
    var skyboxMaterial3 = new BABYLON.StandardMaterial("skyBox3", scene);
    skyboxMaterial3.backFaceCulling = false;
    skyboxMaterial3.reflectionTexture = new BABYLON.HDRCubeTexture(URL, scene, 512);
    skyboxMaterial3.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial3.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial3.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox3.material = skyboxMaterial3;
   
}


