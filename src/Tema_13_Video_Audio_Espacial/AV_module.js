
import * as BABYLON from "babylonjs";
import "babylonjs-loaders"



/**
 * 
 * @param {String} videoUrl
 * @param {BABYLON.Mesh} mesh 
 * @param {Boolean} options.loop 
 * @param {Boolean} options.autoPlay 
 * @param {Boolean} options.autoUpdateTexture
 * @param {Boolean} options.muted
 * @param {String} options.poster   
 * @param {BABYLON.scene} scene 
 */
export function VideoTextureToMesh(videoUrl, mesh, options = { loop: false, autoPlay: false, autoUpdateTexture: true, muted: false, poster: '' }, scene) {

    options.loop = options.loop !== undefined ? options.loop : false;
    options.autoPlay = options.autoPlay !== undefined ? options.autoPlay : false;
    options.autoUpdateTexture = options.autoUpdateTexture !== undefined ? options.autoUpdateTexture : true;
    options.muted = options.muted !== undefined ? options.muted : false;
    options.poster = options.poster !== undefined ? options.poster : '';



    let videoTexture = new BABYLON.VideoTexture("videoTexture", videoUrl,
        scene, true, false,
        BABYLON.VideoTexture.TRILINEAR_SAMPLINGMODE, options);

    let videoMaterial = new BABYLON.StandardMaterial("videoMat", scene);
    videoMaterial.diffuseTexture = videoTexture;
    videoMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);

    mesh.material = videoMaterial;


}





/**
* 
* @param {String} videoUrl 
* @param {String} audioUrl 
* @param {{}} videoTextureSettings 
* @param {{}} AudioSettings 
* @param {{}} videoPlaneOptions 
* @param {BABYLON.Scene} scene 
* @returns the instanced video player
*/
export function VideoPlayerTexture(videoUrl, audioUrl, videoTextureSettings, AudioSettings, videoPlaneOptions, scene) {



    videoTextureSettings = videoTextureSettings !== undefined ? videoTextureSettings : {
        loop: false,
        autoPlay: false,
        autoUpdateTexture: true,
        muted: true,
        poster: ''
    };


    AudioSettings = AudioSettings !== undefined ? AudioSettings : {
        loop: false,
        autoPlay: false,
        spatialSound: true,
        distanceModel: "exponential",
        maxDistance: 10,
        refDistance: 5,
        rolloffFactor: 0.8,
    };

    videoPlaneOptions = videoPlaneOptions !== undefined ? videoPlaneOptions : {
        height: 1,
        width: 1 * 1.77,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    };


    let videoTexture = new BABYLON.VideoTexture("videoTexture", videoUrl,
        scene, true, false,
        BABYLON.VideoTexture.TRILINEAR_SAMPLINGMODE, videoTextureSettings);
    // videoTexture.video.preload = "auto";
    //videoTexture.XRpickable=true;

    var videoPlane = BABYLON.MeshBuilder.CreatePlane("videoPlane", videoPlaneOptions, scene);
    var vidPos = (new BABYLON.Vector3(0, 2, 0.1))
    videoPlane.position = vidPos;
    videoPlane.XRpickable = true;

    if (audioUrl == undefined || "") {
        audioUrl = videoTexture.video;
        videoTexture.video.muted = false;
    }

    const videoSound = new BABYLON.Sound("testSound", audioUrl, scene, () => {
        console.log("ready to play video sound")

    }, AudioSettings);

    videoSound.attachToMesh(videoPlane);

    let videoMaterial = new BABYLON.StandardMaterial("videoMat", scene);
    videoMaterial.diffuseTexture = videoTexture;
    videoMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
    videoPlane.material = videoMaterial;


    let clicked = false;

    videoPlane.actionManager = new BABYLON.ActionManager(scene);
    videoPlane.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {


        if (clicked == false && videoSound.isReady()) {
            clicked = true;
            videoTexture.video.play().then(() => {
                videoSound.play();
            })


        } else {
            videoTexture.video.pause();
            videoSound.pause();
            clicked = false;

        }
    }));
    videoPlane.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnDoublePickTrigger, () => {

        videoTexture.video.currentTime = 0;
        videoTexture.video.pause();
        videoSound.stop();

    }))

    return { videoTexture, videoSound, videoPlane, videoMaterial };

}

