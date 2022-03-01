//// VARIABLES DECLARATION ////

new p5(); // yep, not great not terrible but it work.

// visuals
let fps = 30;
let sx  = 800;
let sy  = 600;
let score;

let lander  = new spaceship(sx / 2, sy - 20, 0, 500, 500); // whoohoo, new spaceship folks

let roll_ctrl  = new PID(4.47213595, 0, 21.35536313); // here is autopilot's brain
let alt_ctrl   = new PID( -1, -0.0001, -15); // it use some highly sensitive PID
let drift_ctrl = new PID(0.01, 0.0009, 0.46); //  because you suck at driving


let trajectory = new target(sx / 2,sy / 2, 100); // setting up the GPS

let angle; // where to write the autopilot command
let altitude;

let ap = false; // autopilot off by default, so you know why you have to use it

//landscape
let space = new stars();
let landscape1 = new mountain(125, 25);
let landscape2 = new mountain(110, 50);
let landingPad = new spaceport(random(50, width - 50));

let shakeCam = 0; // when something bad happen, the cameraman freaks out

//plot
let font;

// some plots to appreciate the beauty off not having to drive and thus be alive
let angle_plt = new plot("angle", sx - 120, 100, -1, 1);
let alt_plt   = new plot("altitude", sx - 120, 230, 0, sy);
let drift_plt = new plot("drift", sx - 120, 360, 0, sx);
let accuracy  = new plot("ap accuracy", sx - 120, 490, 0, 1);
let plt = false;

let kaboom = new explosion; // YEAH, YOU READ THAT RIGHT

let vig = vignette(50);

/////////////////////////////////////////////////////////////////////////////////////////////////

function preload() {
    font = loadFont("data/NimbusMonoPS-Regular.otf");
}

function setup() {
    createCanvas(sx, sy, P2D);
    smooth();
    frameRate(fps);

    textFont(font, 16);
}

/////////////////////////////////////////////////////////////////////////////////////////////////

function draw() {
    shakeCam *= 0.9;
    
    push();
    translate(random(shakeCam),random(shakeCam));
    
    space.draw(); // sky, stars and planet
    
    landscape2.draw(); // mountains
    landscape1.draw();
    
    landingPad.draw();
    landingPad.increment(); // function to make blinking light
    
///////////////////////////////////////////////////////////////////////////////////////////////
    
    if (ap ==  true) { // autopilot
        
        // here goes the PID controls //
        angle = constrain(drift_ctrl.compute(trajectory.tgt.x, lander.x_pos, lander.x_spd), -PI / 4, PI / 4);
        lander.rcs_ext = roll_ctrl.compute(angle, lander.angle, lander.roll_rate);
        
        altitude = trajectory.tgt.y;
        lander.thruster_ext = alt_ctrl.compute(altitude, lander.y_pos, lander.y_spd);
        
        trajectory.draw();
        trajectory.update(1 / fps);
        
        fill(200);
        textAlign(CENTER, CENTER);
        //textFont(font, 16);
        fill(0, 168, 255);
        text("autopilot : on", width / 2, 20);
        plt = true;
    } else {
        lander.rcs_ext = 0;
        lander.thruster_ext = 0;
    }
    
    if (lander.integrity == true) {
        lander.simulate(); // actualize positions and speeds
        lander.draw(); // lander
    } else {
        kaboom.draw();
        kaboom.update();
    }

    //background(255);
    image(vig,0,0);

    
    if (plt == true) {
        angle_plt.draw(lander.angle, angle);
        alt_plt.draw(sy - lander.y_pos, sy - trajectory.tgt.y);
        drift_plt.draw(lander.x_pos, trajectory.tgt.x);
        accuracy.draw(trajectory.accuracy, 1);
    }
    
///////////////////////////////////////////////////////////////////////////////////////////////
    
    //text
    if (lander.landed == true && lander.integrity == true) {
        fill(255);
        //textFont(font, 16);
        textAlign(CENTER, CENTER);
        score = map(abs((landingPad.x_pos + 50) - lander.x_pos),0,sx,1,0);
        score = pow(score,5) * 10;
        text("contact light ! your score is " + int(ceil(score)) + "/10\n\npress 'r' to restart\npress 'a' for autopilot\npress 'p' to plot data", width / 2, height / 2);
    }
    
    pop();
}

///////////////////////////////////////////////////////////////////////////////////////////////

// USER INPUTs
function keyPressed() {
    if (key == 'r') {

        lander = new spaceship(random(100, sx - 200), random(100,sy - 300), radians(random( -45, 45)), 500, 500);
        landingPad = new spaceport(random(200, width - 200));
        roll_ctrl.reset();
        trajectory.reset(lander.x_pos, lander.y_pos, landingPad.x_pos + 50);
        return false;

    } else if (key == 'a') {
        ap = !ap;
        return false;

    } else if (key == 'p') {
        plt = !plt;
        return false;
        
    }
}