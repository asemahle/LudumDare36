class Carpenter extends BuildingNode {
    constructor(settings) {
        super(settings);
        this.image = loadImage("./res/carpenter.png");
        this.radius = 32;
        this.health = 100;
    }
    
    operate(water, delta) {
        var healAmount = water * 20 * farmEfficiency;
        for (let entity of entities) {
            if (entity instanceof BuildingNode) {
                entity.currentHealth += healAmount;
                entity.currentHealth = Math.min(entity.currentHealth, entity.health);
            }
        }
    }
}

