class Aquaduct {
    constructor(startNode, endNode, settings) {
        settings = settings || {};

        this.drawable = true;

        this.startNode = startNode;
        this.endNode = endNode;
        addEntity(this.startNode);
        addEntity(this.endNode);
        addEntity(this);
        startNode.addAquaduct(this);
        endNode.addAquaduct(this);

        this.flowRate = settings.flowRate || 200;

        this.length = 0;
        this.updateLength();
    }

    updateLength() {
        this.length = new p5.Vector(this.startNode.pos.x - this.endNode.pos.x, this.startNode.pos.y - this.endNode.pos.y).mag();
    }

    setEndNodePosition(point) {
        this.endNode.pos = point;
        this.updateLength();
    }

    setEndNode(node) {
        this.endNode.removeAquaduct(this);
        removeEntity(this.endNode);
        addEntity(node);
        node.addAquaduct(this);
        this.endNode = node;
        this.updateLength();
    }

    draw() {
        let angle = Math.atan2(this.endNode.pos.y - this.startNode.pos.y,
                               this.endNode.pos.x - this.startNode.pos.x);
        push();
        translate(this.startNode.pos.x, this.startNode.pos.y);
        rotate(angle);
        scale(this.length / aquaductTopImage.width, 1.0);
        translate(0, -aquaductTopImage.height / 2);
        colorMode(HSB);
        fill(240, 50 * (this.startNode.water / this.startNode.maxWater +
                         this.endNode.water / this.endNode.maxWater), 65);
        rect(0, 0, aquaductTopImage.width, aquaductTopImage.height);
        image(aquaductTopImage, 0, 0);
        pop();

        let numArches = round(this.length / aquaductSideImage.width);
        let sign = angle > -PI / 2 && angle < +PI / 2 ? +1 : -1;
        push();
        translate(
            this.startNode.pos.x - 0.5 * sign * aquaductTopImage.height * Math.sin(angle),
            this.startNode.pos.y + 0.5 * sign * aquaductTopImage.height * Math.cos(angle));
        shearY(angle);
        scale(this.length * Math.cos(angle) / (numArches * aquaductSideImage.width), 1.0);
        for (let i = 0; i < numArches; ++i) {
            image(aquaductSideImage, i * aquaductSideImage.width, 0);
        }
        pop();
    }

    spew() {
        if (this.endNode.aquaducts.length === 1) {
            let dir = new p5.Vector(this.endNode.pos.x - this.startNode.pos.x, this.endNode.pos.y - this.startNode.pos.y).normalize();
            this.endNode.spew(dir);
        }
        if (this.startNode.aquaducts.length === 1) {
            let dir = new p5.Vector(this.startNode.pos.x - this.endNode.pos.x, this.startNode.pos.y - this.endNode.pos.y).normalize();
            this.startNode.spew(dir);
        }
    }

    update(delta) {
        let dWater = (this.flowRate * delta * (this.endNode.water / this.endNode.maxWater - this.startNode.water / this.startNode.maxWater))/this.length;
        if ((dWater > 0 && this.endNode.water > 0 && this.startNode.water < this.startNode.maxWater) ||
            (dWater < 0 && this.startNode.water > 0 && this.endNode.water < this.endNode.maxWater)) {
            this.endNode.water -= dWater;
            this.startNode.water += dWater;
        }
    }
    
    destroy() {
        this.endNode.removeAquaduct(this);
        this.startNode.removeAquaduct(this);
        removeEntity(this);
    }
}
