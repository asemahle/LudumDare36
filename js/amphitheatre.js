class Amphitheatre extends BuildingNode {
    constructor(settings) {
        super(settings);
        this.image = loadImage("./res/amphitheatre.png");
        this.radius = 32;
        this.health = 100;
    }

    operate(water, delta) {
        score += farmEfficiency * water * 3;
    }
}

