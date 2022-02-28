class spaceport {
    constructor(x_) {
        this.light = true;
        this.x_pos = x_;
        this.i = 0;

        this.increment = function () {
            this.i += 1;
            if (this.i == 10) {
                this.light = !this.light;
                this.i = 0;
            }
        }
        
        this.draw = function() {
            push();
            
            fill(180); // landing pad
            noStroke();
            rect(this.x_pos, sy - 5, 100, 10);
            
            stroke(150); // light
            strokeWeight(2);
            line(this.x_pos + 10, sy - 5, this.x_pos + 10, sy - 60);
            
            strokeWeight(5); 
            if (this.light == true) { // blinking
                stroke(255);
            } else {
                stroke(0);
            } 
            line(this.x_pos + 10, sy - 60, this.x_pos + 10, sy - 65); // light bulb
            
            pop();
        }
    }
}
