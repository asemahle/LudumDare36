const ARROW_SPEED = 300; // pixels per second
const ARROW_DAMAGE = 5; 

class Arrow {	
	constructor(settings) {
        settings = settings || {};

        this.drawable = true;

        this.pos = {
            x: settings.x || 0,
            y: settings.y || 0
        };
				
        this.image = loadImage("./res/tower_shot.png");
		this.target = settings.target;
		
		this.lifeTime = dist(this.pos.x, this.pos.y, this.target.pos.x, this.target.pos.y) / ARROW_SPEED;
		this.angle = atan2(this.target.pos.y - this.pos.y, this.target.pos.x - this.pos.x);
    }
	    
	draw() {
        push();
        translate(this.pos.x, this.pos.y);
		rotate(this.angle);
        image(this.image, -this.image.width / 2, -this.image.height / 2);
        pop();
    }
	
	update(delta) {
		this.angle = atan2(this.target.pos.y - this.pos.y, this.target.pos.x - this.pos.x);
		
		this.pos.x += ARROW_SPEED * cos(this.angle) * delta;
		this.pos.y += ARROW_SPEED * sin(this.angle) * delta;
		
		this.lifeTime -= delta;
		
		if(this.lifeTime < 0 || dist(this.pos.x, this.pos.y, this.target.pos.x, this.target.pos.y) < 16) {
			removeEntity(this);
			this.target.currentHealth -= ARROW_DAMAGE;
		} else if (this.target.currentHealth < 0) {
			removeEntity(this);			
		}
				
	}
}