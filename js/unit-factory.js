class UnitFactory {
    constructor(settings) {
        settings = settings || {};
        this.garrisonSpawnRate = settings.garrisonSpawnRate || 0.1;
        this.averageGarrisonSize = settings.averageGarrisonSize || 2;
        this.garrisonGrowthRate = settings.garrisonGrowthRate || 1.01;
    }

    update(delta) {
        if (Math.random() < this.garrisonSpawnRate * delta) {

            console.log('Spawning UNITS');

            let garrisonSize = chance.normal({mean: this.averageGarrisonSize, dev: this.averageGarrisonSize * 0.2});
            let angle = Math.random() * TWO_PI;
            let v = p5.Vector.fromAngle(angle);
            console.log(angle, v);
            v.mult(sqrt(2 * sq(width)) + 10);
            v.x += width/2;
            v.y +=width/2;
            console.log(angle, v);

            let targets = [];
            for (let entity of entities) {
                if (entity instanceof BuildingNode) {
                    targets.push(entity);
                }
            }

            for(let i = 0; i < garrisonSize; i++) {
                let unit = new Unit({
                    x: v.x,
                    y: v.y,
                    targets: targets,
                    speed: 50,
                    image: loadImage('./res/enemy_soldier.png'),
                    numFrames: 2
                });

                addEntity(unit);
            }
        };
    }

    destroy() {
        removeEntity(this);
    }
}
