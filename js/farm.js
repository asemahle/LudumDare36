class Farm extends BuildingNode {
    constructor(settings) {
        super(settings);
        this.image = loadImage("./res/farm.png");
        this.radius = 32;
        this.health = 100;
    }
    
    operate(water, delta) {
        farmEfficiency = 1.0 + farmEfficiency * water / delta * 0.3;
    }
}

