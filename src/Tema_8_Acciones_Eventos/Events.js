import * as BABYLON from "babylonjs";


export function GeneralEvents(scene) {

    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                console.log("POINTER DOWN");
                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                console.log("POINTER UP");
                break;
            case BABYLON.PointerEventTypes.POINTERMOVE:
                console.log("POINTER MOVE");
                break;
            case BABYLON.PointerEventTypes.POINTERWHEEL:
                console.log("POINTER WHEEL");
                break;
            case BABYLON.PointerEventTypes.POINTERPICK:
                console.log("POINTER PICK");
                break;
            case BABYLON.PointerEventTypes.POINTERTAP:
                console.log("POINTER TAP");
                break;
            case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
                console.log("POINTER DOUBLE-TAP");
                break;
        }
    });

    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case BABYLON.KeyboardEventTypes.KEYDOWN:
                console.log("KEY DOWN: ", kbInfo.event.key);
                break;
            case BABYLON.KeyboardEventTypes.KEYUP:
                console.log("KEY UP: ", kbInfo.event.keyCode);
                break;
        }
    });


}

export function DragEvents(camera,ground,canvas,scene) {



    var startingPoint;
    var currentMesh;

    var getGroundPosition = function () {
        var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == ground; });
        if (pickinfo.hit) {
            return pickinfo.pickedPoint;
        }

        return null;
    }

    var pointerDown = function (mesh) {
        currentMesh = mesh;
        startingPoint = getGroundPosition();
        if (startingPoint) { // we need to disconnect camera from canvas
            setTimeout(function () {
                camera.detachControl(canvas);
            }, 0);
        }
    }

    var pointerUp = function () {
        if (startingPoint) {
            camera.attachControl(canvas, true);
            startingPoint = null;
            return;
        }
    }

    var pointerMove = function () {
        if (!startingPoint) {
            return;
        }
        var current = getGroundPosition();
        if (!current) {
            return;
        }

        var diff = current.subtract(startingPoint);
        currentMesh.position.addInPlace(diff);

        startingPoint = current;

    }

    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                if (pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh != ground) {
                    pointerDown(pointerInfo.pickInfo.pickedMesh)
                }
                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                pointerUp();
                break;
            case BABYLON.PointerEventTypes.POINTERMOVE:
                pointerMove();
                break;
        }
    });

}

export function KeyBoardEvents(mesh,scene) {

	scene.onKeyboardObservable.add((kbInfo) => {
		switch (kbInfo.type) {
			case BABYLON.KeyboardEventTypes.KEYDOWN:
				switch (kbInfo.event.key) {
                    case "a":
                    case "A":
                        mesh.position.x -= 0.1;
                    break
                    case "d":
                    case "D":
                        mesh.position.x += 0.1;
                    break
                    case "w":
                    case "W":
                        mesh.position.y += 0.1;
                    break
                    case "s":
                    case "S":
                        mesh.position.y -= 0.1;
                    break
                }
			break;
		}
	});
    
}
