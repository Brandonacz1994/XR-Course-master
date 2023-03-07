
import * as BABYLON from 'babylonjs'
import * as GUI from 'babylonjs-gui';

export default class XRwindow {


    constructor(displayPlane, window_text, width, height, scene) {

        this.scene = scene;
        this.displayPlane=displayPlane;

        // WINDOW PLANE FOR CONTROL AND POSITION

        this.windowMesh = new BABYLON.MeshBuilder.CreatePlane("windown_plane", {
            width: width,
            height: height,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        }, scene);

        this.windowMesh.XRPickable = true;
        this.windowMesh.nonXREditable = true;

        displayPlane.XRPickable = false;
        displayPlane.nonXREditable = false;

        var window_texture = new GUI.AdvancedDynamicTexture.CreateForMesh(this.windowMesh);
        window_texture.scaleTo(width*500, height*1000)

        var win_rectangle = new GUI.Rectangle("container")
        win_rectangle.width = 1;
        win_rectangle.height = 1;

        //container.cornerRadius = 20;
        //container.color = "Orange";
        win_rectangle.thickness = 0;
        win_rectangle.background = '#00000066';

        //container.paddingTopInPixels = 15;
        //container.paddingLeftInPixels = 15;
        //container.zIndex=-1;


        var win_grid = new GUI.Grid("win_grid")
        win_grid.addRowDefinition(1);
        win_grid.addColumnDefinition(.7)
        win_grid.addColumnDefinition(.15)
        win_grid.addColumnDefinition(.15)

        win_grid.paddingLeftInPixels = 5;

        this.win_text_name = new GUI.TextBlock("win_text_name");
        this.win_text_name.fontFamily = "Helvetica";
        //win_text_name.textWrapping = true;
        this.win_text_name.text = window_text;
        this.win_text_name.color = "white";
        this.win_text_name.fontSize = 25;
        this.win_text_name.height = "100px";
        this.win_text_name.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT


        win_grid.addControl(win_text_name, 0, 0);
        win_rectangle.addControl(win_grid);
        window_texture.addControl(win_rectangle);

        //NOW CREATE AND MAKE AS CHILD THE DISPLAY PLANE

        var local_pos = new BABYLON.Vector3(0, 1.5, 0);

        this.windowMesh.position = local_pos
        this.windowMesh.rotation.y = (90 * (Math.PI / 180))


        var ajust_pos = displayPlane.getBoundingInfo().boundingBox.maximum.y + windowMesh.getBoundingInfo().boundingBox.maximum.y
        var change_axis = new BABYLON.Vector3(0, -ajust_pos, 0);

        displayPlane.parent = windowMesh;
        displayPlane.position = change_axis;

    }


    open() {


        var openKeys = [];
        openKeys.push({
            frame: 0,
            value: 0 //BABYLON.Vector2.Zero()
        });
        openKeys.push({
            frame: 10,
            value: 1 // new BABYLON.Vector2(1, 1)
        });

        var animationOpen = new BABYLON.Animation(
            'scaleAnimationOpen',
            'scaleX',
            30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT, //VECTOR2,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        animationOpen.setKeys(openKeys);

        let easingFunction = new BABYLON.BounceEase(1, 4);
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        animationOpen.setEasingFunction(easingFunction);

        this.scene.beginDirectAnimation(this.displayPlane, [animationOpen], 0, 100, false, 1);

    }

    close() {


        var keys = [];
        keys.push({
            frame: 0,
            value: 1
        });
        keys.push({
            frame: 10,
            value: 0
        });


        var animationClose = new BABYLON.Animation(
            'scaleAnimation',
            'scaleX',
            10,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        animationClose.setKeys(keys);

        let easingFunction = new BABYLON.ExponentialEase(9.7); // BABYLON.QuarticEase()
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        animationClose.setEasingFunction(easingFunction);


        this.scene.beginDirectAnimation(this.displayPlane, [animationClose], 0, 100, false, 1);

    }



}
