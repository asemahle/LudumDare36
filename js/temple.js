class Temple extends BuildingNode {
    constructor(settings) {
        super(settings);
        this.waterDebit = 0;
    }
	
    operate (water, delta) {
        this.waterDebit = water/delta;
        rainChance = this.waterDebit/10 + 0.01;
    }
}
