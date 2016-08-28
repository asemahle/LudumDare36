class Building extends AquaductNode {
    constructor(settings) {
        super(settings);
        this.water = 0;
        this.sink = 0;

        this.health = settings.health || 100;
    }

    update(delta) {
        super.update();
        operate(this.water, delta);
        this.water = 0;
        if (this.health < 0) {
            this.destroy();
        }
    }

    operate(water, delta) {
    }
}

