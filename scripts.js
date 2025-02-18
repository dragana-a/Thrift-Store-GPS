
    let map;  
    let geocoder;
    let start;
    let end; 
    
    async function initMap() { 
        const { Map } = await google.maps.importLibrary("maps");
        
        
        map = new Map(document.getElementById("maps"), {
            center: { lat: 43.2387, lng: -79.8881 }, 
            zoom: 11,
            mapId: "410e5d7369ae59c7"
        });
  
        
        //create custom marker
        const customMarker = document.createElement('div');
        customMarker.innerHTML = `
            <img src="https://maps.google.com/mapfiles/kml/paddle/pink-stars.png" 
            style="width: 40px; height: 40px;">
            `;
        let find_location = document.getElementById("findLocation");
            find_location.addEventListener("click", function() {
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(showPositionOnMap);
                } else {
                    alert("Geolocation is not supported by this browser.");
                }
            });
    
    //show user's location on map
    function showPositionOnMap(position){
        start = { lat: position.coords.latitude, lng: position.coords.longitude };
        let user_location = new google.maps.marker.AdvancedMarkerElement({
            position: start,
            map,
            title: "Your Location",
            content: customMarker
        });
    }
    
    //create directions service and renderer
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);


    let getDirections = document.getElementById("getDirections");

    //calculate directions
    getDirections.addEventListener("click", () => calcDirections());
    
    // Function to calculate directions
    function calcDirections() {
        if (!start) {
        alert("Please set your starting location first by clicking 'Find My Location'.");
        return;
        }
        if (!end) {
            alert("Click a marker's link to set your destination.");
            return;
        }

        //make request to get directions
        const request = {
            origin: start,
            destination: end,
            travelMode: "DRIVING",
        };
    
        directionsService.route(request, (result, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(result);
            }
        });
    }

// Function to create a marker and attach an info window
function createMarker(lat, lng, title, infoContent, address, map) {
    const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: lat, lng: lng },
        map: map,
        title: title,
    });
    //create link with onclick event to set destination
    link = `&nbsp;&nbsp;<a href="#" onclick="setDestination(${lat}, ${lng}); return false;">Set Destination</a>`
    makeInfoMarker(marker, infoContent, address, link);
    return marker;
}

// Value Village Markers
let value_village_marker_1 = createMarker(43.226471, -79.761542, "Value Village", contentString1, "114 Irene Avenue, Stoney Creek ON L8G 2B5 Stoney Creek Ontario Canada", map);
let value_village_marker_2 = createMarker(43.231400, -79.857300, "Value Village", contentString1, "530 Fennell Avenue East, Hamilton ON L8V 1S9 Hamilton Ontario Canada", map);
let value_village_marker_3 = createMarker(43.198985, -80.019127, "Value Village", contentString1, "100 Portia Drive, Ancaster ON L0R Ancaster Ontario Canada", map);
let value_village_marker_4 = createMarker(43.3325, -79.8912, "Value Village", contentString1, "63 Main Street South, Waterdown ON L8B Waterdown Ontario Canada", map);
let value_village_marker_5 = createMarker(43.39438, -79.79493, "Value Village", contentString1, "2030 Appleby Line, Burlington ON L7L 6M6 Burlington Ontario Canada", map);

// Talize Markers
let talize_marker_1 = createMarker(43.2094, -79.8912, "Talize", contentString2, "1400 Upper James St, Hamilton, ON L9B 1K3", map);
let talize_marker_2 = createMarker(43.226424, -79.881965, "Talize", contentString2, "1144 Courtland Ave E, Kitchener, ON N2C 1N2", map);

// Salvation Army Markers
let salvation_army_marker_1 = createMarker(43.254062, -79.861829, "Salvation Army", contentString3, "250 King St E, Hamilton, ON L8N 1B7", map);
let salvation_army_marker_2 = createMarker(43.226424, -79.881965, "Salvation Army", contentString3, "879 Upper James St, Hamilton, ON L9C 3A3", map);
let salvation_army_marker_3 = createMarker(43.235889, -79.758229, "Salvation Army", contentString3, "2500 Barton St E, Hamilton, ON L8E 3K8", map);

// Array of markers for filtering
    let vvmarkers = [
        value_village_marker_1,
        value_village_marker_2,
        value_village_marker_3,
        value_village_marker_4,
        value_village_marker_5
    ];
    let tsmarkers = [
        talize_marker_1,
        talize_marker_2
    ];
    let samarkers = [
        salvation_army_marker_1,
        salvation_army_marker_2,
        salvation_army_marker_3
    ];
    
//function to get the input address and geocode it, filter, then create a marker    
    function codeAddress(){
    let streetAddress = document.getElementById("streetAddress").value;
    let city = document.getElementById("city").value;
    let province = document.getElementById("province").value;
    let postalCode = document.getElementById("postalCode").value;
    let title = document.getElementById("name").value;
    
    let address = streetAddress + ", " + city + ", " + province + ", " + postalCode;
    geocoder = new google.maps.Geocoder();
    
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == 'OK') {
            const userInputLocation= document.createElement('div');
            userInputLocation.innerHTML = `
                <img src="https://maps.google.com/mapfiles/kml/paddle/purple-stars.png" 
                style="width: 40px; height: 40px;">
                `;
                let marker = new google.maps.marker.AdvancedMarkerElement({
                    position: results[0].geometry.location,
                    content: userInputLocation,
                    title: title
                });
                marker.setMap(map);
                
                //filter user input marker and push to respective array
                switch(title){
                    case "Value Village":
                        vvmarkers.push(marker);
                        break;
                    case "Talize":
                        tsmarkers.push(marker);
                        break;
                    case "Salvation Army":
                        samarkers.push(marker);
                        break;
                            }
                            //create link for user input marker to set destination
                            link = `&nbsp;&nbsp;<a href="#" onclick="setDestination(${results[0].geometry.location.lat()}, ${results[0].geometry.location.lng()}); return false;">Set Destination</a>`

                            makeInfoMarker(marker, "<h6>" + title + "</h6>", address, link);
                        } else {
                            alert('Geocode was not successful due to: ' + status);
                        }
                    });
                }
                
                //filter markers based on user selection
                let geocode = document.getElementById("submit");
                geocode.addEventListener("click", codeAddress);
                
                //only salvation army markers
                    let onlySA = document.getElementById("onlySA");
                    onlySA.addEventListener("click", function() {
                        vvmarkers.forEach(marker => marker.setMap(null));
                        tsmarkers.forEach(marker => marker.setMap(null));
                        samarkers.forEach(marker => marker.setMap(map));
                    });
                //only talize markers
                    let onlyTS = document.getElementById("onlyTS");
                    onlyTS.addEventListener("click", function() {
                        vvmarkers.forEach(marker => marker.setMap(null));
                        samarkers.forEach(marker => marker.setMap(null));
                        tsmarkers.forEach(marker => marker.setMap(map));
                    });
                //only value village markers
                    let onlyVV = document.getElementById("onlyVV");
                    onlyVV.addEventListener("click", function() {
                        tsmarkers.forEach(marker => marker.setMap(null));
                        samarkers.forEach(marker => marker.setMap(null));
                        vvmarkers.forEach(marker => marker.setMap(map));
                    });
                //display all markers
                    let all = document.getElementById("all");   
                    all.addEventListener("click", function() {
                        vvmarkers.forEach(marker => marker.setMap(map));
                        tsmarkers.forEach(marker => marker.setMap(map));
                        samarkers.forEach(marker => marker.setMap(map));
                    });
                }

// Function to create an info window for a marker
function makeInfoMarker(marker, content, address, link) {
    let infoWindow = new google.maps.InfoWindow({
        content: content + address + link
    });

    marker.addListener("click", () => {
        infoWindow.open(map, marker);
        shouldFocus = false;
    });
    
}


//formtaed content for info windows, basic information about each chain
//value village
let contentString1 = `
    <div>
        <h6>Value Village</h6>
        <p>Savers Value Village Inc. is a publicly held, for-profit thrift store retailer headquartered in Bellevue, Washington, United States, offering second hand merchandise, with supermajority ownership by private equity firm Ares Management</p>
    </div>
`;
//talize
let contentString2 = `
    <div>
        <h6>Talize</h6>
        <p>Talize is a proudly Canadian owned and operated national 
            for-profit retailer offering quality resale apparel and 
            housewares at unbeatable prices. As Canada’s newest and 
            most unique shopping experience we offer new, like-new 
            and vintage items all under one roof.</p>
    </div>
`;
//salvation army
let contentString3 = `
    <div>
        <h6>Salvation Army</h6>
        <p>Shop thrift & donate secondhand goods at your local Salvation Army Thrift Store, where we care for our communities & the planet we share.</p>
    </div>
`;

//function to set end destination to calc route
function setDestination(lat, lng) {
        end = new google.maps.LatLng(lat, lng);
    }
