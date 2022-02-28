class PID {
    constructor(kp_, ki_, kd_) {
        this.kp = kp_; // proportionnal gain
        this.ki = ki_; // integral grain
        this.kd = kd_; // derivative gain

        this.ei = 0; // cumulative error

        this.compute = function (setpoint, p, v) {
            this.ei -= this.ki * (this.kp * (setpoint - p) - this.kd * v);
            return this.kp * (setpoint - p) - this.kd * v - this.ei;
        };

        this.reset = function () { // reset cumulative error
            this.ei = 0;
        };

    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////

class target {
    constructor(x_, y_, r_) {

        this.ld_p = createVector(lander.x_pos, lander.y_pos); // landing pad position

        this.reset = function (x_, y_, lpx_) {
            this.p1 = createVector(x_, y_); // first waypoint at lander position
            this.p2 = createVector(lpx_, sy - 50); // second waypoint at landing pad position

            this.t = 0;
            this.radius = r_; // max lander distance from target
            this.tgt = createVector(x_, y_);
            this.dist = this.tgt.dist(this.p2); // distance from wpt 1 to wpt 2
        }

        this.reset(x_, y_, r_); // initilization

        this.update = function (t_) {
            this.ld_p.set(lander.x_pos, lander.y_pos);
            this.accuracy = this.radius / (this.radius + p5.Vector.dist(this.ld_p, this.tgt));

            this.t += t_ * this.accuracy; // if the tgt is too far, dont change it too much
            this.where = constrain(this.t / 4, 0, 1); // calculate tgt position
            // note that the spacecraft has around 4 second to get to wpt 2

            if (this.where < 1) {
                this.tgt = p5.Vector.lerp(this.p1, this.p2, this.where); // update tgt position along the path
            } else if (this.where == 1 && this.accuracy > 0.9) { // check if lander is at wpt 2
                this.tgt.add(0, 0.5); // final descent
            }
        }

        this.cursor = function (p_, s_, scale_) { // just drawn a little rotating cross with a bit of text
            push();
            translate(p_.x, p_.y);
            fill(0, 168, 255);
            textAlign(LEFT, CENTER);
            text(s_, 10, 0);

            rotate(this.t * PI / 10);
            scale(scale_);
            stroke(0, 168, 255);
            strokeWeight(1 / scale_);
            line(- 10, -10, 10, 10);
            line(- 10, 10, 10, -10);
            pop();
        }

        this.draw = function () { // draw the whole path

            push();
            this.cursor(this.p1, "", 0.5);
            this.cursor(this.p2, "", 0.5);
            this.cursor(this.tgt, "tgt", 1);

            stroke(0, 168, 255);
            strokeWeight(3);
            point(p5.Vector.lerp(this.p1, this.p2, this.t % 1));
            point(this.p2.x, lerp(this.p2.y, sy, this.t % 1));
            strokeWeight(1);
            stroke(0, 168, 255, 25);
            line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
            line(this.p2.x, this.p2.y, this.p2.x, sy);

            stroke(0, 168, 255, this.accuracy * 255);
            line(this.ld_p.x, this.ld_p.y, this.tgt.x, this.tgt.y);
            pop();
        }
    }
}
