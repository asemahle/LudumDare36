class Arrow {
	const SPEED = 100; // pixels per second
	
	constructor(settings) {
        settings = settings || {};

        this.drawable = true;

        this.pos = {
            x: settings.x || 0,
            y: settings.y || 0
        };
				
		this.image = settings.image;
		this.target = settings.target;
		
		this.lifeTime = target.x - this.x, target.y - this.y;
		this.angle = Math.dist(this.x, this.y, target.x, target.y);
    }
	    
	draw() {
        push();
		rotate(this.angle);
        translate(this.pos.x, this.pos.y);
        image(this.image, -this.image.width / 2, -this.image.height / 2);
        pop();
    }
	
	update(delta) {
		this.angle = Math.atan2(target.x - this.x, target.y - this.y);
		
		this.x += speed * Math.cos(this.angle);
		this.y += speed * Math.sin(this.angle);
		
		this.lifeTime -= delta;
		
		if(this.lifeTime < 0) {
			removeEntity(this);
			// kill target enemy
		}
	}
}