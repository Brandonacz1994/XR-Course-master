import * as BABYLON from "babylonjs"
import * as  MATERIALS from "babylonjs-materials"


/**
 * function that generates a random color material
 * @param {BABYLON.scene} scene 
 * @returns the random generated material
 */
export function MaterialRandom(scene) {
    var material = new BABYLON.StandardMaterial("material_random", scene);
    material.diffuseColor = BABYLON.Color3.Random();

    return material;
}


/**
 * Helper function to create material from RBG hex string (#ffffff) format
 * @param {string} name
 * @param {string} diffuseColor_hex 
 * @param {string} specularColor_hex
 * @param {string} emissiveColor_hex
 * @param {string} ambientColor_hex
 * @param {BABYLON.scene} scene 
 * @returns the generated standard material
 */
export function MaterialFromRGB_Hex(name,{diffuseColor_hex=undefined, specularColor_hex=undefined, emissiveColor_hex=undefined, ambientColor_hex=undefined } = {}, scene) {


    var material = new BABYLON.StandardMaterial(name, scene)

    if (diffuseColor_hex) {
        material.diffuseColor = BABYLON.Color3.FromHexString(diffuseColor_hex)
    }

    if (specularColor_hex) {
        material.specularColor = BABYLON.Color3.FromHexString(specularColor_hex)
    }

    if (emissiveColor_hex) {
        material.emissiveColor = BABYLON.Color3.FromHexString(emissiveColor_hex)
    }

    if (ambientColor_hex) {
        material.ambientColor = BABYLON.Color3.FromHexString(ambientColor_hex)
    }

    return material
}


/**
 * Helper function to create material from textures (URL format)
 * @param {string} name 
 * @param {string} diffuseTexture
 * @param {string} specularTexture 
 * @param {string} emisissiveTexture 
 * @param {string} ambientTexture  
 * @param {BABYLON.scene} scene 
 * @returns the generated material
 */
export function MaterialFromTexture(name,{diffuseTexture=undefined, specularTexture=undefined, emisissiveTexture=undefined, ambientTexture=undefined } = {}, scene) {


    var material = new BABYLON.StandardMaterial(name, scene)

    if (diffuseTexture) {
        material.diffuseTexture = new BABYLON.Texture(diffuseTexture,scene)
    }

    if (specularTexture) {
        material.specularTexture = new BABYLON.Texture(specularTexture,scene)
    }

    if (emisissiveTexture) {
        material.emissiveTexture = new BABYLON.Texture(emisissiveTexture,scene)
    }

    if (ambientTexture) {
        material.ambientTexture = new BABYLON.Texture(ambientTexture,scene)
    }

    return material
}


