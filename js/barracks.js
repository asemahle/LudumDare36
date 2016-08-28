class Barracks extends BuildingNode {
    constructor(settings) {
        super(settings);
        this.waterReserve = 0;
    }
    
    operate(water, delta) {
        this.waterReserve += water;
        console.log("water to barracks: " + water);
        console.log("waterReserve: " + this.waterReserve);
        if (this.waterReserve > barracksThreshold) {
            //generate a unit here
            console.log("generated a unit!");
            this.waterReserve %= barracksThreshold;
        }
    }
}