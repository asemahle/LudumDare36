class Barracks extends BuildingNode {
    constructor(settings) {
        super(settings);
        this.waterReserve = 0;
    }
    
    operate(water, delta) {
        this.waterReserve += water;
        if (this.waterReserve > barracksThreshold) {
            //generate a unit here
            console.log("generated a unit!");
            this.waterReserve %= barracksThreshold;
        }
    }
}