import * as BABYLON from "babylonjs"
import batman_texture from '../Tema_4_Iluminacion/batman.png'

/**
 * Point light: un punto de luz ubicda en el espacio, parecido a la luz de uN foco por ejemplo.
 * @param {BABYLON.Scene} scene 
 * @returns a constructed pointlight.
 */
export function PointLight(scene) {

    var pointlight = new BABYLON.PointLight("pointlight", new BABYLON.Vector3(0, 10, 0), scene);
    pointlight.diffuse = new BABYLON.Color3.FromHexString("#FFFFFF")
    pointlight.specular = new BABYLON.Color3(1, 1, 0)

    return pointlight;

}

/**
 * Directional light: luz global (se emite por todos lados) definida por una direccion, tiene un rango infinito.
 * @param {BABYLON.Scene} scene 
 * @returns a constructed directional light.
 */
export function DirectionalLight(scene) {

    var directionallight = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 0), scene);
    directionallight.diffuse = new BABYLON.Color3.FromHexString("#FFFFFF")
    directionallight.specular = new BABYLON.Color3(1, 1, 0)

    return directionallight;

}

/**
 * Spot light: luz definida por una posicion, direccion, angulo y un exponente, se define como un cono.
 * @param {BABYLON.scene} scene
 * @returns a pair of constructed spotlights 
 */
export function SpotLight(scene) {

    //Light direction is directly down from a position one unit up, slow decay
    var SpotLight = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(3, 4, 0), new BABYLON.Vector3(0, -1, 0), Math.PI / 2, 10, scene);
    SpotLight.diffuse = new BABYLON.Color3(1, 0, 0);
    SpotLight.specular = new BABYLON.Color3(0, 1, 0);

    //Light direction is directly down from a position one unit up, fast decay
    var SpotLight1 = new BABYLON.SpotLight("spotLight1", new BABYLON.Vector3(0, 4, 0), new BABYLON.Vector3(0, -1, 0), Math.PI / 2, 15, scene);
    SpotLight1.diffuse = new BABYLON.Color3(0, 1, 0);
    SpotLight1.specular = new BABYLON.Color3(0, 1, 0);

    return {SpotLight,SpotLight1}

}

/**
 * Hemispheric light: luz definida por una direccion, usualmente hacia arriba (cielo). Permite simular facilmente luz ambiental.
 * @param {BABYLON.Scene} scene 
 * @returns a constructed hemispheric light
 */
export function HemisphericLight(scene) {
    var hemisphericlight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 1), scene);
    hemisphericlight.intensity = 0.8;
    hemisphericlight.diffuse = new BABYLON.Color3.FromHexString("#FFFFFF");
    hemisphericlight.specular = new BABYLON.Color3(1, 1, 0);
    hemisphericlight.groundColor = new BABYLON.Color3(0.1, 0.1, 0.1);

    return hemisphericlight;

}

/**
 * Spot light from a texture example: usando una imagen png de una ventana.
 * @param {BABYLON.Scene} scene
 * @returns a constructed spotlight from a texture
 */
export function EmissiveLightFromTexture(scene) {

    var spotLight = new BABYLON.SpotLight("spotlight_texture", new BABYLON.Vector3(10, 15, 10),
        new BABYLON.Vector3(-1, -2, -1), 1.1, 16, scene);
    spotLight.projectionTexture = new BABYLON.Texture(batman_texture, scene);
    spotLight.setDirectionToTarget(BABYLON.Vector3.Zero());
    spotLight.intensity = 1.5;

    return spotLight;
}

