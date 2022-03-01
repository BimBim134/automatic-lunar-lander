class stars {
    constructor() {
        let nb_stars = 100;
        this.stars = [];
        
        for (let i = 0; i < nb_stars; i++) {
            this.stars[i] = createVector(random(sx), random(sy));
        }
        
        this.draw = function() {
            push();
            for (let i = 0; i < sy; i++) { // background
                stroke(map(i, 0, sy, 25, 100));
                line(0, i, sx, i);
            }
            noStroke(); // stars
            fill(255);

            for (let i = 0; i < nb_stars; i++) {
                circle(this.stars[i].x, this.stars[i].y, 1);
            }

            fill(75); // planet
            circle(100, 100, 150);
            pop();
        }
    }
}
