var beaches, inspections, map, directionsManager, myChart, chartLabels, geometricAreas, infobox, searchManager;

// Get array of beaches
function getBeaches(){
    $.ajax({
        url: "php/get_beaches.php",
        datatype: JSON,
        success: function (data) {
            beaches = JSON.parse(data);
        }
    });
}



// Get beach inspections
$.ajax({
    url: "php/get_inspections.php",
    datatype: JSON,
    success: function (data) {
        inspections = JSON.parse(data);
    }
});

//Reset the blacklist
function resetBlacklist() {
    $.ajax({
        url: "php/reset_blacklist.php",
    });
}


window.addEventListener("resize", adjustSize);

//Adjusts sizes based on window width
function adjustSize() {
    
    $("#beachGraph").attr("height", $("#graphDiv").height() * 0.8);
    if ($(window).width() > 768) {
        setDesktop();
    } else {
        setMobile();
    }

}
//Adjust screen for desktop screens
function setDesktop() {
    $("#beachMap").attr("hidden", false);
    $("#graphDiv").attr("hidden", false);
    $("#toggleButton").attr("hidden", true);
    $("#beachDiv").attr("hidden", false);

    $("#userControls").attr("hidden", false);
    $("#beachMap").removeClass();
    $("#beachMap").addClass("col-5");

    $("#graphDiv").removeClass();
    $("#graphDiv").addClass("col-5");

    $("#beachDiv").removeClass();
    $("#beachDiv").addClass("col-2");
}

//adjust screens for mobile
function setMobile() {

    $("#beachMap").attr("hidden", false);
    
    $("#userControls").attr("hidden", false);
    $("#beachDiv").attr("hidden", false);
    $("#graphDiv").attr("hidden", true);
    $("#toggleButton").attr("hidden", false);

    $("#beachMap").removeClass();
    $("#beachMap").addClass("col-7");

    $("#graphDiv").removeClass();
    $("#graphDiv").addClass("col-12");

    $("#beachDiv").removeClass();
    $("#beachDiv").addClass("col-5");
}



$(document).ready(function () {
    adjustSize();
    getBeaches();
    
    //Adds chart
    var ctx = document.getElementById("beachGraph").getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        responsive: true,
        data: {
            labels: [],
            datasets: [{
                label: 'Geometric Mean of E. Coli',

                backgroundColor: [
                    'rgba(255, 99, 132, 1)',

                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 1000,
                        beginAtZero: true
                    }
                }]
            }
        }
    });

});

// Add data to chart
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
        dataset.backgroundColor.push('rgba(255, 99, 132, 1)');
        dataset.borderColor.push("rgba(255, 99, 132, 1)")
    });
    chart.update();
}

// Remove data from chart
function removeData(chart) {
    while (chart.data.labels.length != 0) {
        chart.data.labels.pop();
        chart.data.datasets.forEach((dataset) => {
            dataset.data.pop();
        });
    }

    chart.update();
}

function loadMapScenario() {
    resetBlacklist();
    // create a new map, centered in Hamilton
    map = new Microsoft.Maps.Map(
        document.getElementById('beachMap'), {
            center: new Microsoft.Maps.Location(43.2557, -79.871)
        });


    infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
        visible: false
    });

    map.entities.push(infobox);


    //Adds a beach to list with event handlers
    function addtoBeachList(beach) {
        name = beach.name;
        $("#beachList").append("<li>" + name + "<br><button id = 'beachListBtn" + beach.id + "' type ='button' class='btn btn-danger'>Blacklist</button>");
        changePinColor("yellow", beach.name);

        $("#beachListBtn" + beach.id).click(function () {
            $.ajax({
                type: "POST",
                url: "php/blacklist_beach.php",
                datatype: JSON,
                data: ({
                    blacklisted: 1
                }, {
                    id: beach.id
                }),
                success: function () {
                    //Add to to blacklist if not already there
                    if (document.getElementById("remove" + beach.id) == undefined) {
                        $("#blacklist").append("<li id = 'blacklist" + beach.id + "'>" + beach.name + "<br><button type='button' id='remove" + beach.id + "' class= 'btn btn-warning'>Remove</button></li>")
                        changePinColor("red", beach.name);
                        $("#remove" + beach.id).click(function () {
                            $.ajax({
                                type: "POST",
                                url: "php/remove_blacklist.php",
                                data: {
                                    id: beach.id
                                },
                                success: function () {
                                    $("#blacklist" + beach.id).remove();
                                    changePinColor("yellow", beach.name);
                                }

                            });


                        });
                    }

                }

            });


        });
    }

    //Changes pin color
    function changePinColor(color, name) {
        
        for (var i = map.entities.getLength() - 1; i >= 0; i--) {
            pushpin = map.entities.get(i);

            if (pushpin instanceof Microsoft.Maps.Pushpin) {

                if (pushpin.getTitle() == name) {
                    pushpin.setOptions({
                        color: color
                    });
                }
            }
        }
    }
    //Get latest inspection 
    function getLatestInspection(index, threshold) {
        beachId = beaches[index].id;
        $.ajax({
            type: "POST",
            url: "php/get_latest_inspection.php",
            datatype: JSON,
            data: {
                beachId: beachId
            },
            success: function (data) {
                if (data.length > 0) {
                    data = JSON.parse(data);

                    if (data[0].geometric_mean > threshold) {
                        addtoBeachList(beaches[index]);
                    }

                }

            }
        });

    }

    //Add pushpins for each beach
    for (let i = 0; i < beaches.length; i++) {

        let lat = beaches[i].latitude;
        let long = beaches[i].longitude;

        let location = new Microsoft.Maps.Location(
            lat,
            long
        );

        let pushpin = new Microsoft.Maps.Pushpin(
            location, {
                title: beaches[i].name,
                color: "green"
            }
        );


        Microsoft.Maps.Events.addHandler(pushpin, "click", function () {
            $("#graphTitle").html(beaches[i].name);
            removeData(myChart);
            chartLabels = [];
            geometricAreas = [];
            let inspectionCount = 0;
            let numPosted = 0;
            for (j = 0; j < inspections.length; j++) {
                if (beaches[i].id === inspections[j].beach_id) {
                    addData(myChart, inspections[j].date_sampled, inspections[j].geometric_mean);
                    inspectionCount++;
                    if(inspections[j].beach_posted)
                        numPosted++;
                }
            }
            water = beaches[i].water_source;

            infobox.setOptions({
                location: pushpin.getLocation(),
                title: pushpin.getTitle(),
                description: beaches[i].name + "<br>" +
                    "Inspections Done: " + inspectionCount +
                    "<br>Times Posted: " + numPosted +
                    "<br> <a id='" + beaches[i].id + "SourceLink' href='#'>Source of water</a>",
                visible: true

            });

            $("#" + beaches[i].id + "SourceLink").click(function () {

                if (water == "Lake Ontario") {
                    map.setView({
                        center: new Microsoft.Maps.Location(43.6333, -77.8271),
                        zoom: 8,
                    });
                } else if (water == "Hamilton Harbour") {
                    map.setView({
                        center: new Microsoft.Maps.Location(43.2893, -79.8355),
                        zoom: 14,
                    });
                } else if (water == "Conservation Area") {
                    map.setView({
                        center: new Microsoft.Maps.Location(beaches[i].latitude, beaches[i].longitude),
                        zoom: 20,
                    });
                }



            });
        });

        map.entities.push(pushpin);
    }

    //Filters beaches that are above a E. Coli rating from their last inspection
    $("#filterButton").click(function () {
        threshold = $("#thresholdInput").val();
        
        if (!isNaN(threshold) && threshold >= 0) {
            resetBlacklist();

            $("#beachList").html("");
            $("#blacklist").html("");

            
            for (i = 0; i < beaches.length; i++) {
                getLatestInspection(i, threshold);
            }

            getBeaches();
            for(i = 0; i < beaches.length; i++){
                changePinColor("green", beaches[i].name);
            }
        }


    });
    //Toggles between the map and the graph on mobile
    $("#toggleButton").click(function () {
        
        if ($("#graphDiv").is(":hidden")) {
            $("#graphDiv").attr("hidden", false);
            $("#beachMap").attr("hidden", true);
            $("#beachDiv").attr("hidden", true);
            $("#userControls").attr("hidden", true);


        } else {
            $("#graphDiv").attr("hidden", true);
            $("#beachDiv").attr("hidden", false);
            $("#beachMap").attr("hidden", false);
            $("#userControls").attr("hidden", false);
        }
    });


}