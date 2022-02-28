class spaceship {
    constructor(x_, y_, angle_, m_, i_) {

        this.dt = 1 / fps;
        this.gravity = -1.622; // lunar gravity in m/s²

        this.x_pos = x_; // positions in m and rad
        this.y_pos = y_;
        this.angle = angle_;

        this.mass = m_;  // in Kg and Kg.m²
        this.inertia = i_;

        this.x_spd = 0;  // speeds in m/s and rad/s
        this.y_spd = 0;
        this.roll_rate = 0;

        this.thruster = 0;
        this.rcs = 0;
        this.thruster_ext = 0;
        this.rcs_ext = 0;

        this.thrust = 2000; //in N
        this.torque = 50; // N.m

        this.fuel = 200; // in L
        this.fuel_rate = 0.02; // in L/N.s

        this.integrity = true;
        this.landed = false;


        /////////////////////////////////////////////////////////////////////////////////////////////////

        this.checkControls = function () {
            // USER INPUT //
            //checking thruster
            if (keyIsPressed == true) {
                if (keyCode === UP_ARROW) {
                    this.thruster = 1;
                }

                // checking rcs
                if (keyCode === RIGHT_ARROW) {
                    this.rcs = 1;
                } else if (keyCode === LEFT_ARROW) {
                    this.rcs = -1;
                }
            } else {
                this.thruster = 0;
                this.rcs = 0;
            }

            this.rcs += this.rcs_ext;
            this.rcs = constrain(this.rcs, -1, 1);

            this.thruster += this.thruster_ext;
            this.thruster = constrain(this.thruster, 0, 1);
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////

        this.isLanded = function () {
            //check landing conditions
            if (this.y_pos > height - 22 && this.angle < PI / 6 && this.angle > - PI / 6 && this.y_spd < 2) {
                return true;
            } else {
                return false;
            }
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////

        this.simulate = function () {
            if (this.landed == false) {
                if (this.isLanded() == false) {
                    this.checkControls();
                    //speed
                    this.y_spd -= this.gravity * this.dt; // gravity

                    if (this.fuel > 0) {
                        // main thruster
                        this.y_spd -= this.thruster * cos(this.angle) * this.thrust * this.dt / this.mass;
                        this.x_spd += this.thruster * sin(this.angle) * this.thrust * this.dt / this.mass;
                        this.fuel -= this.thruster * this.fuel_rate * this.thrust * this.dt;

                        // rcs
                        this.roll_rate += this.rcs * this.torque * this.dt / this.inertia;
                        this.fuel -= abs(this.rcs) * this.fuel_rate * this.torque * this.dt;
                    }

                    if (this.fuel < 0) { // min fuel is 0
                        this.fuel = 0;
                    }

                    if (this.y_pos > sy - 22 && this.y_spd > 1) { //CRASH
                        this.integrity = false;
                        kaboom = new explosion(this.x_pos, this.y_pos); // OH YEAH BABY
                        shakeCam = 25; // OMGGGGG
                    }

                    //integrate speeds
                    this.y_pos += this.y_spd;
                    this.x_pos += this.x_spd;
                    this.angle += this.roll_rate;

                } else if (this.isLanded() == true) { // you finally made it to the ground safely
                    this.y_pos = sy - 22;
                    this.y_spd = 0;

                    this.angle = 0;
                    this.rcs = 0;
                    this.landed = true;
                }
            } else { // landed but this a bit of lateral speed
                this.x_spd *= 0.9;
                this.x_pos += this.x_spd;
            }
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////

        this.draw = function () {
            push();
            translate(this.x_pos, this.y_pos);
            rotate(this.angle);

            noStroke();

            fill(20);
            triangle(0, 0, -5, 15, 5, 15); // nozzle
            triangle(- 20, -3, -20, 3, -23, 0); //rcs left
            triangle(20, -3, 20, 3, 23, 0); //rcs right

            // flames
            if (this.fuel > 0) {
                fill(255);
                let l = random(3, 5);
                if (this.thruster != 0) {
                    triangle(- l, 15, l, 15, 0, this.thruster * 20 + l * 5);
                }
                if (this.rcs > 0.05) {
                    triangle(- 20, 3, -23, 0, (- 18 - 2 * l), 2 * l - 1); // left rcs
                }
                if (this.rcs < -0.05) {
                    triangle(20, 3, 23, 0, (18 + 2 * l), 2 * l - 1); // right rcs
                }
            }

            stroke(color(225)); // cockpit
            fill(170);
            circle(0, -10, 20);

            stroke(115);
            fill(150);
            rect(- 20, -10, 40, 20, 3); // hull

            strokeWeight(4); //this.fuel meter
            stroke(0);
            line(15, 7, 15, -7);
            strokeWeight(3);
            stroke(255);
            line(15, 7, 15, map(this.fuel, 0, 200, 7, -7));

            stroke(0);
            strokeWeight(1);
            line(- 15, -11, -15, -20); // antenna
            if (this.landed == false) {
                stroke(60); // off if flying
            } else {
                stroke(255); // on if landed
            }
            strokeWeight(5);
            line(- 15, -20, -15, -21); // ligh

            stroke(0);
            strokeWeight(1);
            line(- 15, 10, -20, 20); // landing gear
            line(15, 10, 20, 20);
            strokeWeight(3);
            line(- 23, 20, -17, 20);
            line(23, 20, 17, 20);

            // infos
            fill(200);
            noStroke();
            textAlign(LEFT, CENTER);
            if (this.fuel < 50 && this.fuel != 0) {
                fill(255, 150, 150);
                text("fuel low", 25, 0); // better hurry up mate
            } else if (this.fuel == 0) {
                fill(255, 100, 100);
                text("no fuel", 25, 0); // I hope you are not too far from the ground
            }

            pop();
        }
    }
}
