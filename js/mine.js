class Mine extends BuildingNode {
    constructor(settings) {
        super(settings);
        this.image = loadImage("./res/mine.png");
        this.radius = 32;
        this.maxHealth = 100;
        this.stone = 0.0;
    }
    
    operate(water, delta) {
        this.stone += water;
        let leftover = floor(this.stone);
        stone += leftover;
        this.stone -= leftover;
    }
}

