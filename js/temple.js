class Temple extends BuildingNode {
    constructor(settings) {
        super(settings);
        this.waterDebit = 0;
        this.image = loadImage("./res/building.png");
        this.radius = 32;
        this.health = 100;
    }
	
    operate (water, delta) {
        this.waterDebit = water/delta;
        rainChance = 0.08 * this.waterDebit * farmEfficiency + 0.04;
    }

    destroy() {
        super.destroy();
        rainChance = 0.04;
    }
}

