class ReservoirNode extends BuildingNode {
    constructor(settings) {
        super(settings);
        this.regenRate = settings.regenRate || 2.0;
        this.sink = 0;
        this.maxWater = settings.maxWater || 100;
        this.water = this.maxWater;
        this.health = settings.health || 100;
        this.radius = settings.radius || 24;
        this.images = [
            loadImage("./res/empty-reservoir.png"),
            loadImage("./res/half-empty-reservoir.png"),
            loadImage("./res/reservoir.png")];
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        let img = this.images[floor(2.99 * this.water / this.maxWater)];
        image(img, -img.width / 2, -img.height / 2);
        this.drawHealthBars();
        this.drawWaterBars();
        pop();
    }

    drawWaterBars() {
        push();
        translate(0, this.radius * 1.5 + 4);
        fill(0);
        rect(-32, 0, 2 * 32, 4);
        var waterBarX = this.water / this.maxWater * 2 * 32;
        fill("blue");
        rect(-32, 0, waterBarX, 4);
        pop();
    }

 update(delta) {
        if (raining) {
            this.water += delta * this.regenRate;
        }
        if (this.water < 0) {
            this.water = 0;
        }
        if (this.water > this.maxWater) {
            this.water = this.maxWater;
        }
        //console.log("water " + this.water);
    }
}

