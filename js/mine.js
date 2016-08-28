class Mine extends BuildingNode {
    constructor(settings) {
        super(settings);
        this.image = loadImage("./res/mine.png");
        this.radius = 32;
        this.health = 100;
        this.stone = 0.0;
    }
    
    operate(water, delta) {
        this.stone += water / delta * 0.1;
        let leftover = floor(this.stone);
        stone += leftover;
        this.stone -= leftover;
    }
}

