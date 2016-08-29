//const ARROW_COST = 0.5;
const TOWER_RANGE = 500;
//const MAX_TOWER_WATER = 4;
//const MAX_FIRE_RATE = 2;

class Tower extends BuildingNode {	
	
    constructor(settings) {
        super(settings);	
		
		this.lastFireCounter = 0;
		//this.waterCollected = 0;
        this.image = loadImage("./res/tower.png");
    }
	
	operate(water, delta) {
		//this.waterCollected += min(water, MAX_TOWER_WATER);
		this.lastFireCounter += delta;
		
		if(this.lastFireCounter < 1 / (water * 2 / delta) / farmEfficiency) {
			return;
		}
				
		for (let entity of entities) {
			if (entity instanceof Unit && entity.isEnemy) {
				if(dist(this.pos.x, this.pos.y, entity.pos.x, entity.pos.y) < TOWER_RANGE && entity.health > 0) {
					//this.waterCollected -= ARROW_COST;
					this.lastFireCounter = 0;
					addEntity(new Arrow({x: this.pos.x, y: this.pos.y, target: entity}));
					break;
				}
			}
		}
    }
}