
import React from "react";
import * as BABYLON from "babylonjs";
import * as MATERIALS from "babylonjs-materials"
import SceneComponent from "../Babylon_components/SceneComponent";
import * as earcut from "earcut";
// import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.


const onSceneReady = (e = { engine: new BABYLON.Engine, scene: new BABYLON.Scene, canvas: new HTMLCanvasElement }) => {

  const { canvas, scene, engine } = e;
  // This creates and positions a free camera (non-mesh)
  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, false);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;
  light.diffuse = new BABYLON.Color3(1,1,1);
  

  //Display 3D axes
  const axes3D = new BABYLON.AxesViewer(scene, 2)

  // Our built-in set shapes examples.
  var box = BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, scene);
  var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameterX: 2, diameterY: 2, diameterZ: 2 }, scene)
  var cone = BABYLON.MeshBuilder.CreateCylinder("cone", { height: 2, diameterTop: 0, diameterBottom: 2, tessellation: 4 }, scene)
  var plane = BABYLON.MeshBuilder.CreatePlane("plane", { width: 5, height: 2 }, scene);

  var torus = BABYLON.MeshBuilder.CreateTorus("torus", { thickness: 0.2, diameter: 2 }, scene);

  // Our built-in parametric shapes examples.

  //Array of points to construct lines
  var trianglePoints = [
    new BABYLON.Vector3(1, 3, 0),
    new BABYLON.Vector3(3, 6, 0),
    new BABYLON.Vector3(5, 3, 0),
    new BABYLON.Vector3(1, 3, 0)
  ];

  var rectanglePoints = [
    new BABYLON.Vector3(6, 3, 1),
    new BABYLON.Vector3(9, 3, 1),
    new BABYLON.Vector3(9, 6, 1),
    new BABYLON.Vector3(6, 6, 1),
    new BABYLON.Vector3(6, 3, 1),
  ];

  //Create lines 
  var lines = BABYLON.MeshBuilder.CreateLines("lines", { points: trianglePoints }, scene);
  lines.color = new BABYLON.Color3.Blue();
  var lines2 = BABYLON.MeshBuilder.CreateDashedLines("lines2", { points: rectanglePoints, dashSize: 5, gapSize: 3, dashNb: 60 }, scene);
  lines2.color = new BABYLON.Color3.Green();


  //Array points to construct a spiral with lines
  var spiralPoints = [];

  var deltaTheta = 0.3;
  var deltaY = 0.05;

  var radius = 2;
  var theta = 0;
  var X = 12;
  var Y = 5;
  var Z = 3;
  for (var i = 0; i < 200; i++) {
    spiralPoints.push(new BABYLON.Vector3(X + radius * Math.cos(theta), Y, Z + radius * Math.sin(theta)));
    theta += deltaTheta;
    Y += deltaY
  }

  //Create spiral 
  var spiral = BABYLON.MeshBuilder.CreateLines("spiral", { points: spiralPoints }, scene);
  spiral.color = new BABYLON.Color3.Red();

  //Array of paths to construct extrusion
  var starShape = [
    new BABYLON.Vector3(0, 3, 0),
    new BABYLON.Vector3(1, 1, 0),
    new BABYLON.Vector3(3, 0, 0),
    new BABYLON.Vector3(1, -1, 0),
    new BABYLON.Vector3(0, -3, 0),
    new BABYLON.Vector3(-1, -1, 0),
    new BABYLON.Vector3(-3, 0, 0),
    new BABYLON.Vector3(-1, 1, 0)
  ];

  starShape.push(starShape[0]);

  var starExtrusion = [
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 0, 1),
    new BABYLON.Vector3(0, 0, 2),
    new BABYLON.Vector3(0, 0, 3),
    new BABYLON.Vector3(0, 0, 4),
    new BABYLON.Vector3(0, 0, 5),
  ];

  //Create extrusion with updatable parameter set to true for later changes
  var extrusion = BABYLON.MeshBuilder.ExtrudeShape("star", { shape: starShape, path: starExtrusion, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: true }, scene);
  extrusion.position.set(-10, 5, 0);
  extrusion = BABYLON.MeshBuilder.ExtrudeShape("star", { shape: starShape, path: starExtrusion, rotation: 0, sideOrientation: BABYLON.Mesh.DOUBLESIDE, instance: extrusion });


//Polygon shape in XoZ plane
const starPoligon = [ 
  
  new BABYLON.Vector3(0, 0, 3), 
      new BABYLON.Vector3(1, 0, 1), 
      new BABYLON.Vector3(3, 0, 0), 
      new BABYLON.Vector3(1, 0, -1), 
      new BABYLON.Vector3(0, 0, -3), 
      new BABYLON.Vector3(-1, 0, -1), 
      new BABYLON.Vector3(-3, 0, 0), 
      new BABYLON.Vector3(-1, 0, 1)
  ];
      
//Holes in XoZ plane
const holes = [];
  holes[0] = [ 
    new BABYLON.Vector3(0, 0, 1.5), 
    new BABYLON.Vector3(0.5, 0, 0.5), 
    new BABYLON.Vector3(1.5, 0, 0), 
    new BABYLON.Vector3(0.5, 0, -0.5), 
    new BABYLON.Vector3(0, 0, -1.5), 
    new BABYLON.Vector3(-0.5, 0, -0.5), 
    new BABYLON.Vector3(-1.5, 0, 0), 
    new BABYLON.Vector3(-0.5, 0, 0.5)
      ];

  const polygon = BABYLON.MeshBuilder.CreatePolygon("polygon", {shape:starPoligon, /*holes:holes,*/ sideOrientation: BABYLON.Mesh.DOUBLESIDE },scene,earcut);
  polygon.position.set(-17, 5, 0);
  polygon.rotation.x = Degrees_to_radians(90)
  var extrudepolygon = BABYLON.MeshBuilder.ExtrudePolygon("polygon", {shape:starPoligon, depth: 2, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene,earcut);
  extrudepolygon.position.set(-24, 5, 0);
  extrudepolygon.rotation.x = Degrees_to_radians(90)

  // Our built-in 'ground' shape.
  var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100, subdivisions: 100 }, scene);

  // Move the position of each shape
  box.position.x = 0;
  box.position.y = 1;
  box.position.z = 0;

  sphere.setAbsolutePosition(new BABYLON.Vector3(-3, 1, 0));
  var newSpherePosition = sphere.position.addInPlace(new BABYLON.Vector3(0, 0, 0));

  cone.setAbsolutePosition(new BABYLON.Vector3(3, 1, 0));

  plane.setAbsolutePosition(new BABYLON.Vector3(0, 3, 2));

  torus.setAbsolutePosition(new BABYLON.Vector3(-6, 1, 0))


  const axesBox = new BABYLON.AxesViewer(scene, 1)
  axesBox.xAxis.parent = box;
  axesBox.yAxis.parent = box;
  axesBox.zAxis.parent = box;


  var ground_base_color = new BABYLON.StandardMaterial("ground_base_color", scene)
  ground_base_color.diffuseColor =  new BABYLON.Color3(1,1,1);
  ground.material = ground_base_color;


  var gridground=ground.clone("gridground")
  gridground.position.y= ground.position.y+0.001;
  var grid_ground_material = new MATERIALS.GridMaterial("groundmaterial", scene)
  grid_ground_material.majorUnitFrequency = 5;
  grid_ground_material.minorUnitVisibility = 0.45;
  grid_ground_material.gridRatio = 1;
  grid_ground_material.backFaceCulling = false;
  grid_ground_material.mainColor = new BABYLON.Color3(0, 0, 1);
  grid_ground_material.lineColor = new BABYLON.Color3(1, 0, 0);
  grid_ground_material.opacity = 0.98;

  gridground.material = grid_ground_material;



  /*
  var skyMaterial = new MATERIALS.GridMaterial("skyMaterial", scene);
  skyMaterial.majorUnitFrequency = 6;
  skyMaterial.minorUnitVisibility = 0.43;
  skyMaterial.gridRatio = 0.5;
  skyMaterial.mainColor = new BABYLON.Color3(0, 0.05, 0.2);
  skyMaterial.lineColor = new BABYLON.Color3(0, 1.0, 1.0);	
  skyMaterial.backFaceCulling = false;
	
  var skySphere = BABYLON.Mesh.CreateSphere("skySphere", 30, 110, scene);
  skySphere.material = skyMaterial;

  */

    /**
   * funcion para convertir grados a radianes
   * @param {*} degrees 
   * @returns un mumero en radianes
   */
    function Degrees_to_radians(degrees) {

      var result_radians = degrees * (Math.PI / 180)
  
      return result_radians
    }


  scene.onBeforeRenderObservable.add(() => {
    if (box !== undefined) {
      const deltaTimeInMillis = scene.getEngine().getDeltaTime();

      const rpm = 10
      box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
      //cone.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);  
      //sphere.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);   
    }

  });

  engine.runRenderLoop(() => {
    if (scene) {
        //window.document.title = engine.getFps().toFixed() + " fps";
        scene.render();

    }
});

};



function Tema() {
  return (
    <React.Fragment>

    <SceneComponent antialias onSceneReady={onSceneReady} id="SceneCanvas" />

    </React.Fragment>
  );
}

export default Tema;
