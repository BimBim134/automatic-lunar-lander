class mountain {
    constructor(c_, p_) {   

        let nb_vertex = int(random(20,35));
        this.hill = [];
        
        this.peak = p_; // peaks height
        this.c = c_; // color

        this.hill[0] = createVector(0, sy);
        this.hill[1] = createVector(0, sy - 20);
        for (let i = 2; i < nb_vertex - 2; i++) {
            this.hill[i] = createVector(map(i, 0, nb_vertex, 0, sx), sy - random(this.peak));
        }
        this.hill[nb_vertex - 2] = createVector(sx, sy - 20);
        this.hill[nb_vertex - 1] = createVector(sx, sy);

        
        this.draw = function () {
            fill(this.c);
            noStroke();
            beginShape();
            for (let i = 0; i < nb_vertex; i++) {
                vertex(this.hill[i].x, this.hill[i].y);
            }
            endShape();
        }
    }
}
