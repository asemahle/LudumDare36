class Unit {
    constructor(settings) {
        settings = settings || {};
        this.drawable = true;
        this.pos = {
            x: settings.x || 0,
            y: settings.y || 0
        };
        this.radius = settings.radius || 25;

        this.health = settings.health || 10;
        this.damage = settings.damage || 10;
        this.attackTime = settings.attackTime || 1;

        this.speed = settings.speed || 10;
        this.targets = settings.targets || [];
        this.canAttack = false;
        this.currentAttackTime = 0;
        this.currentTarget = this.targets[0];

        this.image = settings.image || createImage(2 * this.radius, 2 * this.radius);
        this.numFrames = settings.numFrames || 1;
        this.animationSpeed = settings.animationSpeed || 10;
        this.currentFrame = 0;
		
		this.isEnemy = settings.isEnemy || false;
    }

    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        if (this.currentTarget != null && this.currentTarget.pos.x - this.pos.x < 0) {
            scale(-1, 1);
        }
        translate(-this.image.width/(2*this.numFrames), -this.image.height/2);
        image(
            this.image,
            floor(this.currentFrame) * this.image.width / this.numFrames, 0,
            this.image.width / this.numFrames, this.image.height,
            0, 0,
            this.image.width / this.numFrames, this.image.height
        );
        pop();
    }

    update(delta) {
        if (this.currentTarget != null) {
            let deltaX = this.currentTarget.pos.x - this.pos.x;
            let deltaY = this.currentTarget.pos.y - this.pos.y;
            let distance = sqrt(deltaX * deltaX + deltaY * deltaY);
            let attackRange = this.radius + this.currentTarget.radius;
            if (distance > attackRange) {
                this.pos.x += deltaX / distance * this.speed * delta;
                this.pos.y += deltaY / distance * this.speed * delta;
                this.currentFrame += this.animationSpeed * delta;
                if (this.currentFrame >= this.numFrames) {
                    this.currentFrame -= this.numFrames;
                }
            }
            else if (this.canAttack) {
                this.attack();
                this.canAttack = false;
                this.currentAttackTime = this.attackTime;
            }
            else if (this.currentAttackTime < 0.0) {
                this.canAttack = true;
            }
            else {
                this.currentAttackTime -= delta;
            }
        }
        if (this.health < 0) {
            this.destroy();
        }
    }

    destroy() {
        removeEntity(this);
    }

    attack() {
        this.currentTarget.health -= this.damage;
        if (this.currentTarget.health < 0) {
            this.currentTarget.destroy();
            this.targets.shift();
            this.currentTarget = this.targets[0];
        }
    }
}

