import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';


/**
 * 
 * @param {String} name the name of the window
 * @param {Number} width the width of the window in pixels
 * @param {Number} height the height of the window in pixels
 * @param {String} videoURL the URL of the video to be played
 * @param {String} audioURL the URL of the audio to be played
 * @param {Boolean} videoSettings.loop object with the video settings
 * @param {Boolean} videoSettings.autoPlay object with the audio settings
 * @param {Boolean} videoSettings.autoUpdateTexture object with the audio settings
 * @param {Boolean} videoSettings.muted object with the audio settings
 * @param {String} videoSettings.poster object with the audio settings
 * @param {BABYLON.Scene} scene the instanced BABYLON.js scene
 * @returns the UI elements for the window.
 */
export function VideoUI(name, width, height, videoURL, videoSettings = { loop: false, autoPlay: false, autoUpdateTexture: true, mute: true, poster: '' }, scene) {

    var barMesh = BABYLON.MeshBuilder.CreatePlane("windown_plane", {
        width: width * 0.001,
        height: 150 * 0.001,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    }, scene);

    barMesh.XRpickable = true;
    barMesh.nonXREditable = true;


    var bar_texture = GUI.AdvancedDynamicTexture.CreateForMesh(barMesh);
    bar_texture.scaleTo(width, 150);



    var bar_rectangle = new GUI.Rectangle("container");
    //win_rectangle.width = 1;
    //win_rectangle.height = 1;

    //container.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    //container.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

    bar_rectangle.cornerRadius = 20;
    bar_rectangle.color = "#2acaea";
    bar_rectangle.thickness = 7;
    bar_rectangle.background = '#00000066';

    //container.paddingTopInPixels = 15;
    //container.paddingLeftInPixels = 15;
    //container.zIndex=-1;


    var bar_grid = new GUI.Grid("win_grid")
    bar_grid.addRowDefinition(1);
    bar_grid.addColumnDefinition(.77, false); //1400px
    bar_grid.addColumnDefinition(150, true); //150px
    bar_grid.addColumnDefinition(150, true); //150px
    bar_grid.addColumnDefinition(150, true); //150px

    const win_text_name = new GUI.TextBlock("win_text_name");
    win_text_name.fontFamily = "Helvetica";
    //win_text_name.textWrapping = true;
    win_text_name.text = name;
    win_text_name.color = "white";
    win_text_name.fontSize = 50;
    //win_text_name.height = "200px";
    win_text_name.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    win_text_name.paddingLeftInPixels = 15;

    var close_button = GUI.Button.CreateImageOnlyButton("close_button", "images/close.png");
    //close_button.color = "transparent"
    close_button.background = '#ea2a2ad9';
    close_button.image.fixedRatio = 1;
    close_button.horizontalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    var follow_button = GUI.Button.CreateImageOnlyButton("maximize_button", "images/centering.png");
    //minimize_button.color = "#2acaea"
    follow_button.background = '#2acaead9';
    follow_button.image.fixedRatio = 1;
    //follow_button.image.width = 0.9;
    follow_button.horizontalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;

    var min_max_button = GUI.Button.CreateImageOnlyButton("minimize_button", "images/minimize.png");
    //minimize_button.color = "#2acaea"
    min_max_button.background = '#2acaead9';
    min_max_button.image.fixedRatio = 1;
    min_max_button.horizontalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;


    bar_grid.addControl(win_text_name, 0, 0);
    bar_grid.addControl(min_max_button, 0, 1);
    bar_grid.addControl(follow_button, 0, 2);
    bar_grid.addControl(close_button, 0, 3);


    bar_rectangle.addControl(bar_grid);
    bar_texture.addControl(bar_rectangle);



    videoSettings = videoSettings !== undefined ? videoSettings : {
        loop: false,
        autoPlay: false,
        autoUpdateTexture: true,
        muted: true,
        poster: ''
    };


    var videoMeshSettings = {
        width: width * (0.001),
        height: height * (0.001),
        sideOrientation: BABYLON.Mesh.DOUBLESIDE
    };

    let videoTexture = new BABYLON.VideoTexture("videoTexture", videoURL,
        scene, true, false,
        BABYLON.VideoTexture.TRILINEAR_SAMPLINGMODE, videoSettings);


    var windowMesh = BABYLON.MeshBuilder.CreatePlane("windowUI", videoMeshSettings, scene);



    let videoMaterial = new BABYLON.StandardMaterial("videoMat", scene);
    videoMaterial.diffuseTexture = videoTexture;
    videoMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
    windowMesh.material = videoMaterial;


    let clicked = false;

    windowMesh.actionManager = new BABYLON.ActionManager(scene);
    windowMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {




        if (clicked == false) {

            videoTexture.video.play().then(() => {


            })

            clicked = true;

        } else {
            videoTexture.video.pause();


            clicked = false;

        }
    }));

    windowMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnDoublePickTrigger, () => {


        videoTexture.video.pause();

        videoTexture.video.currentTime = 0;

    }));

    var ajust_pos = windowMesh.getBoundingInfo().boundingBox.maximum.y + barMesh.getBoundingInfo().boundingBox.maximum.y
    var change_axis = new BABYLON.Vector3(0, -ajust_pos, .02);

    var local_pos = new BABYLON.Vector3(-0.7, 1, 0);
    barMesh.position = local_pos;

    windowMesh.parent = barMesh;
    windowMesh.position = change_axis;

    barMesh.lookAt(scene.activeCamera.position, Math.PI, 0, 0, BABYLON.Space.WORLD);



    var animation_framerate = 10;

    var window_close = new BABYLON.Animation("close", "scaling.y", animation_framerate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    var window_rectangle_close = new BABYLON.Animation("close", "height", animation_framerate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

    const keyframes = [];

    keyframes.push({
        frame: 0,
        value: 1
    });

    keyframes.push({
        frame: animation_framerate,
        value: 0
    });

    /*keyframes.push({
        frame: animation_framerate*2,
        value: 1
    });*/

    window_close.setKeys(keyframes);
    window_rectangle_close.setKeys(keyframes);


    var window_open = new BABYLON.Animation("open", "scaling.y", animation_framerate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    var window_rectangle_open = new BABYLON.Animation("open", "height", animation_framerate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    const keyframes2 = [];


    keyframes2.push({
        frame: 0,
        value: 0
    });

    keyframes2.push({
        frame: animation_framerate,
        value: 1
    });

    window_open.setKeys(keyframes2);
    window_rectangle_open.setKeys(keyframes2);

    var easingFunction = new BABYLON.ExponentialEase(9.7);
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);


    window_close.setEasingFunction(easingFunction);
    window_rectangle_close.setEasingFunction(easingFunction);
    window_open.setEasingFunction(easingFunction);
    window_rectangle_open.setEasingFunction(easingFunction);


    var isopen = true;

    min_max_button.onPointerUpObservable.add(() => {

        if (isopen) {
            console.log("minimize button pressed")

            scene.beginDirectAnimation(windowMesh, [window_close], 0, animation_framerate, false);

            min_max_button.image.source = "images/maximize.png";
            isopen = false;


        } else {
            console.log("maximize_button pressed")
            scene.beginDirectAnimation(windowMesh, [window_open], 0, animation_framerate, false);

            min_max_button.image.source = "images/minimize.png";
            isopen = true;

        }


    });


    follow_button.onPointerUpObservable.add(() => {


        var new_pos = scene.activeCamera.position.clone();
        new_pos.addInPlace(scene.activeCamera.getDirection(BABYLON.Vector3.Backward()));

        barMesh.setAbsolutePosition(new_pos);

        barMesh.lookAt(scene.activeCamera.position, 0, 0, 0, BABYLON.Space.WORLD);

        var offset = scene.activeCamera.getFrontPosition(2);

        barMesh.setAbsolutePosition(offset);



    });


    close_button.onPointerUpObservable.add(() => {

        console.log("close button pressed");

        scene.beginDirectAnimation(barMesh, [window_close], 0, animation_framerate, false, 1, () => {

            videoTexture.dispose();
            barMesh.dispose();


        });



    });


    return { barMesh, bar_rectangle, windowMesh }


}