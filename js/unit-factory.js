class UnitFactory {
    constructor(settings) {
        settings = settings || {};
        this.garrisonSpawnRate = settings.garrisonSpawnRate || 0.1;
        this.averageGarrisonSize = settings.averageGarrisonSize || 2;
        this.garrisonGrowthRate = settings.garrisonGrowthRate || 1.01;
    }

    update(delta) {
        if (Math.random() < this.garrisonSpawnRate * delta) {
            console.log('Enemies spawn');

            let garrisonSize = chance.normal({mean: this.averageGarrisonSize, dev: this.averageGarrisonSize * 0.2});
            let angle = Math.random() * TWO_PI;
            let v = p5.Vector.fromAngle(angle);
            v.mult(sqrt(2 * sq(width)) + 10);
            v.x += width / 2;
            v.y += height / 2;

            let targets = [];
            for (let entity of entities) {
                if (entity instanceof BuildingNode) {
                    targets.push(entity);
                }
            }
            shuffle(targets);

            for(let i = 0; i < garrisonSize; i++) {
                this.spawnSoldier(
                    v.x + (Math.random() - 0.5) * 60,
                    v.y + (Math.random() - 0.5) * 60,
                    targets);
            }
            this.spawnCatapult(v.x, v.y, targets);
        };
    }
    
    spawnSoldier(x, y, targets) {
        let unit = new Unit({
            x: x,
            y: y,
            targets: targets,
            maxSpeed: 4,
            image: loadImage('./res/enemy_soldier.png'),
            attackImage: loadImage('./res/attack-animation.png'),
            numFrames: 2,
            isEnemy: true,
            numAttackFrames: 4
        });

        addEntity(unit);
    }

    spawnCatapult(x, y, targets) {
        let unit = new Unit({
            x: x,
            y: y,
            targets: targets,
            maxSpeed: 2,
            image: loadImage('./res/catapult.png'),
            attackImage: loadImage('./res/catapult_attack.png'),
            numFrames: 1,
            isEnemy: true,
            numAttackFrames: 2,
            animationSpeed: 0.2,
            attackRadius: 256
        });
        unit.attack = function() {
            this.isAttacking = true;
            let shot = new CatapultShot({
                x: this.pos.x,
                y: this.pos.y,
                target: this.currentTarget
            });
            addEntity(shot);
            this.updateTarget();
        }
        addEntity(unit);
    }

    destroy() {
        removeEntity(this);
    }
}

