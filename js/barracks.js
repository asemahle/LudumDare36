let barracksThreshold = 10;
let maxSoldiers = 10;
let friendlySoldierCount = 0;

class Barracks extends BuildingNode {
    constructor(settings) {
        super(settings);
        this.waterReserve = 0;
        this.image = loadImage("./res/barracks.png");
        this.radius = 32;
        this.health = 100;
    }
        
    operate(water, delta) {
        this.waterReserve += water;
        if (this.waterReserve > barracksThreshold) {
            //generate a unit here
            console.log("Unit generated");
            
            if(friendlySoldierCount < maxSoldiers * farmEfficiency) {
                let targets = [];
                for (let entity of entities) {
                    if (entity instanceof Unit && entity.isEnemy) {
                        targets.push(entity);
                    }
                }
                
                friendlySoldierCount += 1;
                this.spawnFriendlySoldier(this.pos.x, this.pos.y + 32, targets);
                                
                this.waterReserve %= barracksThreshold;
            }
        }
    }    
    
    spawnFriendlySoldier(x, y, targets) {
        let unit = new Unit({
            x: x,
            y: y,
            targets: targets,
            maxSpeed: 100,
            image: loadImage('./res/soldier.png'),
            attackImage: loadImage('./res/friendly-attack-animation.png'),
            numFrames: 2,
            isEnemy: false,
            numAttackFrames: 2
        });

        addEntity(unit);
    }
}
