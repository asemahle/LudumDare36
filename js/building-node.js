class Building extends AquaductNode {
    constructor(settings) {
        super(settings);
        this.water = 0;
        this.sink = 0;

        this.health = settings.health || 100;
        this.image = settings.image || createImage(2 * this.radius, 2 * this.radius);
    }

    draw() {
        push();
        translate(this.x, this.y);
        image(this.image, this.image.width / 2, this.image.height / 2);
        pop();
    }

    update(delta) {
        super.update();
        operate(this.water, delta);
        this.water = 0;
        if (this.health < 0) {
            this.destroy();
        }
    }

    operate(water, delta) {
    }
}

