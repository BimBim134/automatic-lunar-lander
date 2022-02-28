class part {
    constructor(pos_, vel_, s_) {
        this.pos = pos_; // particule position
        this.vel = vel_; // particule velocity
        this.s = s_; // particule size
        this.m = random(- 0.0001, 0.0001); // particule initial rotationnal speed

        this.draw = function () {
            push();

            translate(this.pos.x, this.pos.y);
            rotate(this.vel.heading());
            scale(this.s * this.vel.magSq(), this.s * this.vel.mag());

            noStroke();
            fill(255);
            circle(0, 0, 10);

            pop();
        }

        this.update = function () {
            this.pos.add(this.vel); // make it move
            this.vel.mult(0.95); // slow it down
            this.m *= 1.2;
            this.vel.rotate(this.m); // make it swirl a little more
        }
    }
}

class explosion {
    constructor(x_, y_) {

        let nb_p = 100;
        this.beam_s = 40;

        this.p = [];

        for (let i = 0; i < nb_p; i++) {
            this.p[i] = new part(createVector(x_, y_), p5.Vector.random2D().mult(random(15)), random(0.5));
        }

        this.pos = createVector(x_, y_);

        this.update = function () {
            for (let i = 0; i < nb_p; i++) {
                this.p[i].update();
            }
            this.beam_s *= 0.8;
        }

        this.draw = function () {
            for (let i = 0; i < nb_p; i++) {
                this.p[i].draw();
            }
            if (this.beam_s > 2) {
                fill(255);
                rect(this.pos.x - this.beam_s / 2, 0, this.beam_s, sy);
            }
        }
    }
}
