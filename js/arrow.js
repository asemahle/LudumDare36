const ARROW_SPEED = 100; // pixels per second
const ARROW_DAMAGE = 5; 

class Arrow {	
	constructor(settings) {
        settings = settings || {};

        this.drawable = true;

        this.pos = {
            x: settings.x || 0,
            y: settings.y || 0
        };
				
        this.image = loadImage("./res/arrow.png");
		this.target = settings.target;
		
		this.lifeTime = dist(this.x, this.y, target.x, target.y) / ARROW_SPEED;
		this.angle = Math.atan2(this.x, this.y, target.x, target.y);
    }
	    
	draw() {
        push();
		//rotate(this.angle);
        translate(this.pos.x, this.pos.y);
        image(this.image, -this.image.width / 2, -this.image.height / 2);
        pop();
    }
	
	update(delta) {
		this.angle = Math.atan2(target.x - this.x, target.y - this.y);
		
		this.x += ARROW_SPEED * Math.cos(this.angle);
		this.y += ARROW_SPEED * Math.sin(this.angle);
		
		this.lifeTime -= delta;
		
		if(this.lifeTime < 0) {
			removeEntity(this);
			this.target.health -= ARROW_DAMAGE;
		}
	}
}