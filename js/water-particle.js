class WaterParticle {
    constructor(settings) {
        settings = settings || {};

        this.drawable = true;

        this.radius = settings.radius || 5;
        this.pos = {
            x: settings.x || 0,
            y: settings.y || 0
        };
        this.velocity = {
            x: settings.vx || 1,
            y: settings.vy || 1
        }
    }

    setEndNodePosition(point) {
        this.endNode.pos = point;
    }

    draw() {
        push();
        noStroke();
        fill(color(0, 0, 255));
        ellipse(this.pos.x, this.pos.y, this.radius*2, this.radius*2);
        pop();
    }

    update(delta) {
        this.pos.x += delta * this.velocity.x;
        this.pos.y += delta * this.velocity.y;
    }
}