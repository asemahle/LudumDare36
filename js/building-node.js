class BuildingNode extends AquaductNode {
    constructor(settings) {
        super(settings);
        this.water = 0;
        this.sink = 0;

        this.health = settings.health || 100;
        this.image = settings.image || createImage(2 * this.radius, 2 * this.radius);

        this.pastWaterValues = [];
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        image(this.image, -this.image.width / 2, -this.image.height / 2);
        pop();
    }

    update(delta) {
        super.update(delta);
        this.pastWaterValues.push(this.water / delta);
        if (this.pastWaterValues.length > 30) {
            this.pastWaterValues.shift();
        }
        let average = 0.0;
        for (let item of this.pastWaterValues) {
            average += item;
        }
        average /= this.pastWaterValues.length;
        this.operate(average * delta, delta);
        this.water = 0;
        if (this.health < 0) {
            this.destroy();
        }
    }

    operate(water, delta) {
    }
}

