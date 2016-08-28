const ARROW_COST = 3;

class Tower extends BuildingNode {	
	
    constructor(settings) {
        super(settings);	
		
		this.waterCollected = 0;
        this.image = loadImage("./res/tower.png");
    }
	
	operate(water, delta) {
		this.waterCollected += water;
		
		if(this.waterCollected > ARROW_COST) {			
			for (let entity of entities) {
				if (entity instanceof Unit && entity.isEnemy) {
					if(dist(this.x, this.y, entity.x, entity.y) < 200) {						
						this.waterCollected -= ARROW_COST;
						addEntity({x: this.x, y: this.y, target: entity});
						console.log("enemy attacked!!!!!");
						break;
					}
				}
			}
		}
    }
}