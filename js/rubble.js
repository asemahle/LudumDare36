class Rubble {
    constructor(settings) {
        this.drawable = true;
        this.pos = {
            x: settings.x || 0,
            y: settings.y || 0
        };
    }

    draw() {
        image(rubbleImage, this.pos.x - rubbleImage.width / 2, this.pos.y - rubbleImage.height / 2);
    }

    update(delta) {
    }
}

