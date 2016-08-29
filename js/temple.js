class Temple extends BuildingNode {
    constructor(settings) {
        super(settings);
        this.waterDebit = 0;
    }
	
    operate (water, delta) {
        this.waterDebit = water/delta;
        rainChance = 0.08 * this.waterDebit * farmEfficiency + 0.04;
    }
}
