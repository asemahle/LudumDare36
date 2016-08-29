class UnitFactory {
    constructor(settings) {
        settings = settings || {};
        this.spawnTimer = 10;
        this.garrisonSpawnInterval = settings.garrisonSpawnInterval || 15;
        this.averageGarrisonSize = settings.averageGarrisonSize || 3;
    }

    update(delta) {
        this.spawnTimer -= delta;
        if (this.spawnTimer < 0) {

            this.spawnTimer = this.garrisonSpawnInterval;
            this.garrisonSpawnInterval *= 0.98;
            
            let garrisonSize = chance.normal({mean: this.averageGarrisonSize, dev: this.averageGarrisonSize * 0.2});
            let angle = Math.random() * TWO_PI;
            let v = p5.Vector.fromAngle(angle);
            v.mult(sqrt(2 * sq(width / 2)) + 10);
            v.x += width / 2;
            v.y += height / 2;

            let targets = [];
            for (let entity of entities) {
                if (entity instanceof Unit && !entity.isEnemy && !(entity instanceof BuildingNode)) {
                    targets.push(entity);
                }
            }
            for (let entity of entities) {
                if (entity instanceof BuildingNode) {
                    targets.push(entity);
                }
            }
            targets = shuffle(targets);

            for(let i = 0; i < garrisonSize; i++) {
                this.spawnSoldier(
                    v.x + (Math.random() - 0.5) * 120,
                    v.y + (Math.random() - 0.5) * 120,
                    targets);
            }
            if (garrisonSize < this.averageGarrisonSize) {
              this.spawnCatapult(v.x, v.y, targets);
            }
        };
    }
    
    spawnSoldier(x, y, targets) {
        let unit = new Unit({
            x: x,
            y: y,
            targets: targets,
            maxSpeed: 60,
            damage: 3,
            image: enemySoldierImage,
            attackImage: enemySoldierAttackImage,
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
            damage: 10,
            targets: targets,
            maxSpeed: 30,
            image: enemyCatapultImage,
            attackImage: enemyCatapultAttackImage,
            numFrames: 1,
            isEnemy: true,
            numAttackFrames: 2,
            animationSpeed: 0.5,
            attackTime: 4,
            attackRadius: 96
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

