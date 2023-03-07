import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui"
import "babylonjs-loaders"

import robot from "../Assets/3Dmodels/dummy3.babylon"

export function interactiveRobotimport(scene) {


    BABYLON.SceneLoader.ImportMesh("", robot,"", scene, function (newMeshes, particleSystems, skeletons) {
        var skeleton = skeletons[0];

        /*
         shadowGenerator.addShadowCaster(scene.meshes[0], true);
         for (var index = 0; index < newMeshes.length; index++) {
             newMeshes[index].receiveShadows = false;;
         }
         */

    
        // ROBOT
        skeleton.animationPropertiesOverride = new BABYLON.AnimationPropertiesOverride();
        skeleton.animationPropertiesOverride.enableBlending = true;
        skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
        skeleton.animationPropertiesOverride.loopMode = 1;

        var idleRange = skeleton.getAnimationRange("YBot_Idle");
        var walkRange = skeleton.getAnimationRange("YBot_Walk");
        var runRange = skeleton.getAnimationRange("YBot_Run");
        var leftRange = skeleton.getAnimationRange("YBot_LeftStrafeWalk");
        var rightRange = skeleton.getAnimationRange("YBot_RightStrafeWalk");

        // IDLE
        if (idleRange) scene.beginAnimation(skeleton, idleRange.from, idleRange.to, true);

        // UI
        var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var UiPanel = new GUI.StackPanel();
        UiPanel.width = "220px";
        UiPanel.fontSize = "14px";
        UiPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        UiPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        advancedTexture.addControl(UiPanel);
        // ..
        var button = GUI.Button.CreateSimpleButton("but1", "Play Idle");
        button.paddingTop = "10px";
        button.width = "100px";
        button.height = "50px";
        button.color = "white";
        button.background = "green";
        button.onPointerDownObservable.add(() => {
            if (idleRange) scene.beginAnimation(skeleton, idleRange.from, idleRange.to, true);
        });
        UiPanel.addControl(button);
        // ..
        var button1 = GUI.Button.CreateSimpleButton("but2", "Play Walk");
        button1.paddingTop = "10px";
        button1.width = "100px";
        button1.height = "50px";
        button1.color = "white";
        button1.background = "green";
        button1.onPointerDownObservable.add(() => {
            if (walkRange) scene.beginAnimation(skeleton, walkRange.from, walkRange.to, true);
        });
        UiPanel.addControl(button1);
        // ..
        var button1 = GUI.Button.CreateSimpleButton("but3", "Play Run");
        button1.paddingTop = "10px";
        button1.width = "100px";
        button1.height = "50px";
        button1.color = "white";
        button1.background = "green";
        button1.onPointerDownObservable.add(() => {
            if (runRange) scene.beginAnimation(skeleton, runRange.from, runRange.to, true);
        });
        UiPanel.addControl(button1);
        // ..
        var button1 = GUI.Button.CreateSimpleButton("but4", "Play Left");
        button1.paddingTop = "10px";
        button1.width = "100px";
        button1.height = "50px";
        button1.color = "white";
        button1.background = "green";
        button1.onPointerDownObservable.add(() => {
            if (leftRange) scene.beginAnimation(skeleton, leftRange.from, leftRange.to, true);
        });
        UiPanel.addControl(button1);
        // ..
        var button1 = GUI.Button.CreateSimpleButton("but5", "Play Right");
        button1.paddingTop = "10px";
        button1.width = "100px";
        button1.height = "50px";
        button1.color = "white";
        button1.background = "green";
        button1.onPointerDownObservable.add(() => {
            if (rightRange) scene.beginAnimation(skeleton, rightRange.from, rightRange.to, true);
        });
        UiPanel.addControl(button1);
        // ..
        var button1 = GUI.Button.CreateSimpleButton("but6", "Play Blend");
        button1.paddingTop = "10px";
        button1.width = "100px";
        button1.height = "50px";
        button1.color = "white";
        button1.background = "green";
        button1.onPointerDownObservable.add(() => {
            if (walkRange && leftRange) {
                scene.stopAnimation(skeleton);
                var walkAnim = scene.beginWeightedAnimation(skeleton, walkRange.from, walkRange.to, 0.5, true);
                var leftAnim = scene.beginWeightedAnimation(skeleton, leftRange.from, leftRange.to, 0.5, true);

                // Note: Sync Speed Ratio With Master Walk Animation
                walkAnim.syncWith(null);
                leftAnim.syncWith(walkAnim);
            }
        });
        UiPanel.addControl(button1);

    });


}
