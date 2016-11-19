let API = "enter your api key"
let words = ["swift", "node", "dart", "java"]
let country = "us"
let state = "ca"
let city = "Boston"

let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

$(document).ready(function() {
    $( "#load_button" ).click(function(event) {
        loadEvents()
    });
});

function loadEvents() {
    $("#load_button").text("Loading...");
    $('#load_button').prop("disable", true);

    $.ajax({
            url: "https://api.meetup.com/2/open_events",
            type: "GET",
            dataType: 'jsonp',
            data: {
                "time": nextWeek(),
                "limited_events": "false",
                "key": API,
                "country": country,
                "text": words.join(", "),
                "state": state,
                "city": city,
            }
        })
        .done(function(data, textStatus, jqXHR) {
            createHTMLDocumentForEvents(data["results"])
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            failure()
        });
}

function createHTMLDocumentForEvents(events) {
    for (let i = 0; i < 7; i++) {
        let eventsOfDay = events.filter(function (event) {
            let day = createDateForEvent(event).getDay()
            return  day == amCalendar(i)
        })
        
        let day = days[i]
        document.write("<h2>" + day +  "(" + eventsOfDay.length + " events)" +"</h2>")
        
        if (eventsOfDay.length > 0) {
            document.write("<ul>")
        } else {
            continue
        }
        
        var current_event = 0
        for (let event of eventsOfDay) {
            current_event += 1
            document.write("<li>")
            document.write("<h3>" + current_event + ") " + event["name"] + "</h3>")
            document.write("<h4>" + "Address: " + createAddressForEvent(event) + "</h4>")
            document.write("<h4>" + "Date: " + createDateForEvent(event).toLocaleString() + "</h4>")
            document.write("<h4>Description:</h4>")
            document.write("<div>")
            document.write(event["description"])
            document.write("</div>")
            document.write("</li>")
        }
        document.write("</ul>")
    }
}

function failure() {
    $('#load_button').prop("disabled", false);
    $("#load_button").text("Try again");
}


function amCalendar(day) {
    if (day == 7) {
        return 0
    } else {
        return day + 1
    }
}

function nextWeek() {
    let now = new Date().getDay()
    var nextMonday = 0
    if (now == 0) {
        nextMonday = 1
    } else {
        nextMonday = 7 - now + 1
    }
    return nextMonday + "d," + (nextMonday + 7) + "d"
}

function createDateForEvent(event) {
    let event_time = event["time"]
    let timezone_offset = event["utc_offset"]
    let day = new Date(event_time)
    let time = day.getTime() + (day.getTimezoneOffset() * 60000);
    return new Date(time + timezone_offset)
}

function createAddressForEvent(event) {
    let address = event["venue"]
    if (address == undefined) {
        return "Disable address"
    }
    return  address["name"] + " (" + address["address_1"] + ", " + address["city"] + ")"
}