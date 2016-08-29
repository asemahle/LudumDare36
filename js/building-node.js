class BuildingNode extends AquaductNode {
    constructor(settings) {
        super(settings);
        this.water = 0;
        this.sink = 0;

        this.health = settings.health || 100;
        this.image = settings.image || createImage(2 * this.radius, 2 * this.radius);
        this.currentHealth = this.health;
        this.average = 0.0;

        this.pastWaterValues = [];
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        image(this.image, -this.image.width / 2, -this.image.height / 2);
        translate(0, this.radius * 1.5);
        fill(0);
        rect(-32, 0, 2 * 32, 8);
        fill("red");
        var healthBarX = this.currentHealth / this.health * 2 * 32;
        var maxWater = this.aquaducts.length != 0 ? this.aquaducts[0].flowRate / this.aquaducts[0].length : 0;
        var waterBarX = this.average / maxWater * 2 * 32;
        rect(-32, 0, healthBarX, 4);
        fill("lightblue");
        rect(-32, 4, waterBarX, 4);
        pop();
    }

    update(delta) {
        super.update(delta);
        this.pastWaterValues.push(this.water / delta);
        if (this.pastWaterValues.length > 30) {
            this.pastWaterValues.shift();
        }
        this.average = 0.0;
        for (let item of this.pastWaterValues) {
            this.average += item;
        }
        this.average /= this.pastWaterValues.length;
        this.operate(this.average * delta * farmEfficiency, delta);
        this.water = 0;
        if (this.currentHealth < 0) {
            this.destroy();
        }
    }

    operate(water, delta) {
    }
}

