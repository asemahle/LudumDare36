class UnitFactory {
    constructor(settings) {
        settings = settings || {};
        this.spawnTimer = 10;
        this.cavalrySpawnTimer = 60;
        this.catapultSpawnTimer = 140;
        this.garrisonSpawnInterval = settings.garrisonSpawnInterval || 15;
        this.cavalrySpawnInterval = settings.cavalrySpawnInterval || 20;
        this.catapultSpawnInterval = settings.catapultSpawnInteval || 20;
        this.averageGarrisonSize = settings.averageGarrisonSize || 2;
    }

    update(delta) {
        this.spawnTimer -= delta;
        this.cavalrySpawnTimer -= delta;
        this.catapultSpawnTimer -= delta;

        let garrisonSize = chance.normal({mean: this.averageGarrisonSize, dev: this.averageGarrisonSize * 0.2});
        let angle = Math.random() * TWO_PI;
        let v = p5.Vector.fromAngle(angle);
        v.mult(sqrt(2 * sq(width / 2)) + 10);
        v.x += width / 2;
        v.y += height / 2;

        let targets = [];
        if (this.spawnTimer < 0 || this.cavalrySpawnTimer < 0 || this.catapultSpawnTimer < 0) {
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
        }

        if (this.spawnTimer < 0) {
            this.spawnTimer = this.garrisonSpawnInterval;
            this.garrisonSpawnInterval *= 0.98;
            this.averageGarrisonSize += 0.1;
            for(let i = 0; i < garrisonSize; i++) {
                this.spawnSoldier(
                    v.x + (Math.random() - 0.5) * 120,
                    v.y + (Math.random() - 0.5) * 120,
                    targets);
            }
        }
        if (this.cavalrySpawnTimer < 0) {
            this.cavalrySpawnTimer = this.cavalrySpawnInterval;
            this.cavalrySpawnInterval *= 0.98;
            for (let i = 0; i < floor(garrisonSize / 2); ++i) {
                this.spawnCavalry(
                    v.x + (Math.random() - 0.5) * 120,
                    v.y + (Math.random() - 0.5) * 120,
                    targets[0]);
            }
        }
        if (this.catapultSpawnTimer < 0) {
            this.catapultSpawnTimer = this.catapultSpawnInterval;
            this.catapultSpawnInterval *= 0.98;
            for (let i = 0; i < floor(garrisonSize / 2); ++i) {
                this.spawnCatapult(
                    v.x + (Math.random() - 0.5) * 120,
                    v.y + (Math.random() - 0.5) * 120,
                    targets);
            }
        }
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
            deathImage: enemySoldierDeathImage,
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
            deathImage: enemyCatapultDeathImage,
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

    spawnCavalry(x, y, target) {
        let unit = new Unit({
            x: x,
            y: y,
            damage: 5,
            targets: [target],
            maxSpeed: 100,
            image: enemyCavalryImage,
            attackImage: enemyCavalryAttackImage,
            deathImage: enemyCavalryDeathImage,
            numFrames: 2,
            isEnemy: true,
            numAttackFrames: 2
        });
        addEntity(unit);
    }

    destroy() {
        removeEntity(this);
    }
}

