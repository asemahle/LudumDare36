class Aquaduct {
    constructor(startNode, endNode) {
        this.drawable = true;

        this.startNode = startNode;
        this.endNode = endNode;
    }

    setEndNodePosition(point) {
        this.endNode.pos = point;
    }

    draw() {
        push();
        stroke('white');
        strokeWeight(5);

        this.startNode.draw();
        this.endNode.draw();

        line(this.startNode.pos.x, this.startNode.pos.y, this.endNode.pos.x, this.endNode.pos.y);
        pop();
    }
}