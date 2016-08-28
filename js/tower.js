class Tower extends BuildingNode {
	const ARROW_COST = 3;
	let waterCollected = 0;
	
    constructor(settings) {
        super(settings);
    }
	
	operate(water, delta) {
		waterCollected += water;
		
		if(waterCollected > ARROW_COST) {			
			for (let entity of entities) {
				if (entity instanceof EnemyUnit) {
					if(Math.dist(this.x, this.y, entity.x, entity.y) > 200) {						
						waterCollected -= ARROW_COST;
						addEntity({x: this.x, y: this.y, image: loadImage("./res/arrow.png"), target: entity}});
						break;
					}
				}
			}
		}
    }
}