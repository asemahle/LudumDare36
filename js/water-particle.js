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
        };

        this.friction = settings.friction || 0.92;
        this.growRate = settings.growRate || 1.04;
        this.damadge = settings.damadge || 2;

        this.opacity = 255;

        this.timeStep = 0.05;
        this.timePassed = 0;
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        scale(this.radius / 32, this.radius / 32);
        translate(-waterProjectileImage.width / 2, -waterProjectileImage.height / 2);
        image(waterProjectileImage, 0, 0);
        pop();
    }

    update(delta) {

        this.timePassed += delta;
        while (this.timePassed > this.timeStep) {
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
            this.radius *= this.growRate;
            this.opacity -= this.timeStep * 100;

            this.timePassed -= this.timeStep;
        }

        if (this.opacity < 0) {
            this.destroy();
        }

        this.pos.x += delta * this.velocity.x;
        this.pos.y += delta * this.velocity.y;

        for (let entity of entities) {
            if (entity instanceof Unit) {

                if (sq(this.radius + entity.radius) > sq(this.pos.x - entity.pos.x) + sq(this.pos.y - entity.pos.y)) {
//                    entity.currentHealth -= this.damadge * delta;
                    let velocity = sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                    entity.velocity.x += this.velocity.x / velocity * 300 * delta;
                    entity.velocity.y += this.velocity.y / velocity * 300 * delta;
                }

            }
        }
    }

    destroy() {
        removeEntity(this);
    }
}
