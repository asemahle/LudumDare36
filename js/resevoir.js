class Resevoir {
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
    }

    onhover(e) {
        console.log('you have hovered over the resevoir');
    }

    onclick(e) {
        console.log('you clicked the resevoir');
    }

    collides(point) {
        if (this.radius > sqrt(sq(point.x - this.pos.x) + sq(point.y - this.pos.y))) {
            return true;
        }
        return false;
    }

    draw() {
        push();
        stroke('white');
        if (this.hovering) {
            stroke('#69f0ff');
            strokeWeight(4);
        }
        ellipse(this.pos.x, this.pos.y, this.radius*2, this.radius*2);
        pop();
    }
}
