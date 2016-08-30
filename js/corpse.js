class Corpse {
    constructor(settings) {
        this.pos = {
            x: settings.x || 0,
            y: settings.y || 0
        };
        this.image = settings.image || createImage(64, 64);
        this.drawable = true;
        this.timer = settings.timer || 1;
    }

    draw() {
        push();
        translate(-this.image.width / 2, -this.image.height / 2);
        translate(this.pos.x, this.pos.y);
        image(this.image, 0, 0);
        pop();
    }

    update(delta) {
        this.timer -= delta;
        if (this.timer < 0) {
            removeEntity(this);
        }
    }
}

