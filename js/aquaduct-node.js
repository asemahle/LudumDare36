class AquaductNode {
    constructor(settings) {
        settings = settings || {};

        this.drawable = true;
        this.clickable = true;
        this.aquaductable = true;
        this.hoverable = true;

        this.hovering = false;

        this.pos = {
            x: settings.x || 0,
            y: settings.y || 0
        };
        this.radius = settings.radius || 25;
        
        this.sink = settings.sink || 0;
        this.water = settings.water || 0;
        this.maxWater = settings.maxWater || 1;
        this.shouldSpew = settings.shouldSpew || false;
        
        this.aquaducts = [];
    }

    onhover(e) { }

    onclick(e) { }

    spew(dir) {
        if (!this.shouldSpew) return;
        while (this.water > 0.1) {
            this.water -= 0.1;
            let angle = Math.random() * 0.1 - 0.05;
            angle += Math.atan2(dir.y, dir.x);
            let speed = 100 * Math.random() + 300;
            let particle = new WaterParticle({
                x: this.pos.x,
                y: this.pos.y,
                vx: speed * Math.cos(angle),
                vy: speed * Math.sin(angle),
                lifespan: 0.3});
            addEntity(particle);
        }
    }
    
    addAquaduct(aquaduct) {
        if (this.aquaducts.indexOf(aquaduct) === -1) {
            this.aquaducts.push(aquaduct);
        }
    }
    
    removeAquaduct(aquaduct) {
        this.aquaducts.splice(this.aquaducts.indexOf(aquaduct), 1);
    }

    collides(point) {
        if (this.radius > sqrt(sq(point.x - this.pos.x) + sq(point.y - this.pos.y))) {
            return true;
        }
        return false;
    }

    draw() {
        push();
        fill(color(0, 0, 0, 0));
        if (this.hovering) {
            stroke('#69f0ff');
            strokeWeight(4);
            ellipse(this.pos.x, this.pos.y, this.radius*2, this.radius*2);
        }
        pop();
    }
    
    update(delta) {
        this.water -= this.sink * delta;
        if (this.water < 0) {
            this.water = 0;
        }
        if (this.water > this.maxWater) {
            this.water = this.maxWater;
        }
    }

    destroy() {
        removeEntity(this);
        for (let aquaduct of this.aquaducts.slice()) {
            aquaduct.destroy();
        }

    }
}
