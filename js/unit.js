class Unit {
    constructor(settings) {
        settings = settings || {};
        this.drawable = true;
        this.pos = {
            x: settings.x || 0,
            y: settings.y || 0
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.acceleration = settings.acceleration || 10;
        this.friction = settings.friction || 0.92;
        this.radius = settings.radius || 25;

        this.health = settings.health || 10;
        this.currentHealth = this.health;
        this.damage = settings.damage || 10;
        this.attackTime = settings.attackTime || 1;

        this.maxSpeed = settings.maxSpeed || 10;
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
            let accel = createVector(this.currentTarget.pos.x - this.pos.x, this.currentTarget.pos.y - this.pos.y).normalize();
            accel.mult(this.acceleration);

            this.velocity.x += accel.x * delta;
            this.velocity.y += accel.y * delta;

            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;

            if(sqrt(sq(this.velocity.x) + sq(this.velocity.y)) > this.maxSpeed) {
                let newV = createVector(this.velocity.x, this.velocity.y).normalize().mult(this.maxSpeed);
                this.velocity.x = newV.x;
                this.velocity.y = newV.y;
            }

            let deltaX = this.currentTarget.pos.x - this.pos.x;
            let deltaY = this.currentTarget.pos.y - this.pos.y;
            let distance = sqrt(deltaX * deltaX + deltaY * deltaY);
            let attackRange = this.radius + this.currentTarget.radius;
            if (distance > attackRange) {
                this.pos.x += this.velocity.x;
                this.pos.y += this.velocity.y;
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
        if (this.currentHealth <= 0) {
            this.destroy();
        }
    }

    destroy() {
        removeEntity(this);
    }
    
    attack() {
        this.currentTarget.currentHealth -= this.damage;
        if (this.currentTarget.currentHealth < 0) {
            this.currentTarget.destroy();
            this.targets.shift();
            this.currentTarget = this.targets[0];
        }
    }
}

