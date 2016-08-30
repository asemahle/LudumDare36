function postScore(username, score) {
    var settings = {
        async: true,
        crossDomain: true,
        url: "https://aqueduct-tycoon.firebaseio.com/.json?auth=zz9yZ5dPm9f1y4oHud1DBhIFDi4P0JFkSSHgnoic",
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        processData: false,
        data: JSON.stringify({"name": username, "score": score})
    }
    console.log(settings);  
    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}