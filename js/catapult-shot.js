class CatapultShot {
    constructor(settings) {
        this.drawable = true;
        this.pos = {
            x: settings.x || 0,
            y: settings.y || 0
        };
        this.target = settings.target || null;
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        translate(-catapultShotImage.width / 2, -catapultShotImage.height / 2);
        image(catapultShotImage, 0, 0);
        pop();
    }

    update(delta) {
        let deltaX = this.target.pos.x - this.pos.x;
        let deltaY = this.target.pos.y - this.pos.y;
        let distance = sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance < this.target.radius) {
            removeEntity(this);
            this.target.currentHealth -= 15;
        }
        else {
            this.pos.x += deltaX / distance * 250 * delta;
            this.pos.y += deltaY / distance * 250 * delta;
        }
    }
}

