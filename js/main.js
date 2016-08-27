function run() {
    console.log('WE IN');

    // Init Crafty:
    Crafty.init();

    // green box
    Crafty.e("2D, Canvas, Color, green_box")
        .attr({x: 0, y: 0, w: 50, h: 50})
        .color("rgb(0,255,0)");

    // main gui component, put all your static gui stuff in here
    var gui = $('#game')[0];

    // one of the gui components: score text
    var scoreText = $('#score')[0];
    Crafty.bind("Score", function(newValue) {
        scoreText.innerHTML = newValue;
    });

    gui.appendChild(scoreText);
    Crafty.stage.elem.appendChild(gui);

    Crafty.bind("EnterFrame", function() {
        Crafty.viewport.x += 1; // all entites will move but gui won't
        Crafty.trigger("Score", Crafty.viewport.x);
    });
}
