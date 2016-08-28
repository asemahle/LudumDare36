class Temple extends BuildingNode {
    constructor(settings) {
        super(settings);
        this.waterReceived = 0;
    }
    operate (water, delta) {
        this.waterReceived += water;
        console.log("water received is : " + this.waterReceived);
    }
}