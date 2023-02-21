import * as BABYLON from 'babylonjs'


interface Options{
    playground_width: number,
    playground_depth:number,
    walls_width:number,
    walls_height:number
}


/**
 * Creates a default playground with collisions
 * @param {number} options.playground_width the width of the playground (x axis dimension)
 * @param {number} options.playground_depth the depth of the playground (z axis dimension)
 * @param {number} options.walls_width the thickness of the walls
 * @param {number} options.walls_height the height of the walls
 * @param {BABYLON.Scene} scene 
 * @returns the generated playground
 */
export function PlayGroundAlt(options= {playground_width:50,playground_depth:50,walls_width:3,walls_height:10},scene: BABYLON.Scene) {

    console.log(options)

    var ground =  BABYLON.MeshBuilder.CreateGround("ground", { width: options.playground_width, height: options.playground_depth, subdivisionsX: 50, subdivisionsY: 50 },scene)

    var wallF =  BABYLON.MeshBuilder.CreateBox("wallF", { width: options.playground_width, height: options.walls_height, depth: options.walls_width },scene)
    wallF.position.set(0, options.walls_height/2, options.playground_depth/2+options.walls_width/2)

    var wallB =  BABYLON.MeshBuilder.CreateBox("wallB", { width: options.playground_width, height: options.walls_height, depth: options.walls_width },scene)
    wallB.position.set(0, options.walls_height/2, -options.playground_depth/2-options.walls_width/2)

    var wallL = BABYLON.MeshBuilder.CreateBox("wallL", { width: options.walls_width, height: options.walls_height, depth: options.playground_width },scene)
    wallL.position.set(-options.playground_width/2-options.walls_width/2, options.walls_height/2, 0)

    var wallR = BABYLON.MeshBuilder.CreateBox("wallR", { width: options.walls_width, height: options.walls_height, depth: options.playground_width },scene)
    wallR.position.set(options.playground_width/2+options.walls_width/2, options.walls_height/2 ,0)

    wallF.visibility=0.2;
    wallB.visibility=0.2;
    wallL.visibility=0.2;
    wallR.visibility=0.2;

    ground.checkCollisions=true;
    wallF.checkCollisions=true;
    wallB.checkCollisions=true;
    wallL.checkCollisions=true;
    wallR.checkCollisions=true;

    ground.addChild(wallF);
    ground.addChild(wallB);
    ground.addChild(wallL);
    ground.addChild(wallR);

    console.log(ground)

    return {ground, wallF, wallB, wallL, wallR};

}