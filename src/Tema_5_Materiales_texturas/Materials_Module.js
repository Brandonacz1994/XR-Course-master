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
 * @param {string} name string name of the instanced material
 * @param {string} options.diffuseColor_hex hex color string (#ffffff)
 * @param {string} options.specularColor_hex hex color string (#ffffff)
 * @param {string} options.emissiveColor_hex hex color string (#ffffff)
 * @param {string} options.ambientColor_hex hex color string (#ffffff)
 * @param {BABYLON.scene} scene a constructed babylonjs scene
 * @returns the generated standard material
 */
export function MaterialFromRGB_Hex(name, options = { diffuseColor_hex: "", specularColor_hex: "", emissiveColor_hex: '', ambientColor_hex: "" }, scene) {


    var material = new BABYLON.StandardMaterial(name, scene)

    if (options.diffuseColor_hex) {
        material.diffuseColor = BABYLON.Color3.FromHexString(options.diffuseColor_hex)
    }

    if (options.specularColor_hex) {
        material.specularColor = BABYLON.Color3.FromHexString(options.specularColor_hex)
    }

    if (options.emissiveColor_hex) {
        material.emissiveColor = BABYLON.Color3.FromHexString(options.emissiveColor_hex)
    }

    if (options.ambientColor_hex) {
        material.ambientColor = BABYLON.Color3.FromHexString(options.ambientColor_hex)
    }

    return material
}


/**
 * Helper function to create material from textures (URL format)
 * @param {string} name string name of the instanced material
 * @param {string} options.diffuseTexture URL (String) or import of the picture to load as a texture
 * @param {string} options.specularTexture URL (String) or import of the picture to load as a texture
 * @param {string} options.emisissiveTexture URL (String) or import of the picture to load as a texture
 * @param {string} options.ambientTexture URL (String) or import of the picture to load as a texture
 * @param {BABYLON.scene} scene a constructed babylonjs scene
 * @returns the generated material
 */
export function MaterialFromTexture(name, options={ diffuseTexture:"", specularTexture:"", emisissiveTexture:"", ambientTexture:"" }, scene) {


    var material = new BABYLON.StandardMaterial(name, scene)

    if (options.diffuseTexture) {
        material.diffuseTexture = new BABYLON.Texture(options.diffuseTexture, scene)
    }

    if (options.specularTexture) {
        material.specularTexture = new BABYLON.Texture(options.specularTexture, scene)
    }

    if (options.emisissiveTexture) {
        material.emissiveTexture = new BABYLON.Texture(options.emisissiveTexture, scene)
    }

    if (options.ambientTexture) {
        material.ambientTexture = new BABYLON.Texture(options.ambientTexture, scene)
    }

    return material
}


