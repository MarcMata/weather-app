//map
mapboxgl.accessToken = MAPBOX_API_TOKEN;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-streets-v12', // style URL
    center: [-98.489, 29.42692], // starting position [lng, lat]
    zoom: 9, // starting zoom
});
//removes markers, in place before all markers are set
function removeMarkers() {
    const markers = document.querySelectorAll(".mapboxgl-marker");
    if (markers) {
        markers.forEach(marker => {
            marker.remove();
        });
    }
}

let markerCoords = []
//when you hit the magnifying glass these events happen
let setSearch = document.querySelector("#searchMarkerButton")
    setSearch.addEventListener('click', event=>{
    event.preventDefault();
    const address = document.querySelector('#setMarker').value;
    geocode(address, MAPBOX_API_TOKEN).then(coords=>{
        console.log(coords)
        //individually grabs the lat long and pushes them into an outside variable
        removeMarkers()
        let mapboxLat = coords[1],
            mapboxLng = coords[0];
        markerCoords = [mapboxLat, mapboxLng]
        const newMarker = new mapboxgl.Marker()
            .setLngLat(coords)
            .addTo(map);
        const popup = new mapboxgl.Popup()
            .setHTML(`<p class="popup">${address}</p>`);
        newMarker.setPopup(popup);
        map.setCenter(coords);
        //when a new marker is set, remove the current marker
        console.log(markerCoords[0])
        console.log(markerCoords[1])
        setSearch.addEventListener('click', event=>{
        });
        weatherMapDaily(markerCoords[0], markerCoords[1])
        weatherMap5Day3Hour(markerCoords[0], markerCoords[1])
    });
});

//sets previous markers to null
let previousMarker = null;
//When you click on the map, it shows the weather
map.on('click', function(event) {
    removeMarkers();
    // get the latitude and longitude of the clicked point
    const latitude = event.lngLat.lat;
    const longitude = event.lngLat.lng;

    const newMarker = new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map);
    // set the previous marker to the new marker
    previousMarker = newMarker;

    // center the map on the new marker
    map.setCenter([longitude, latitude]);
    weatherMapDaily(event.lngLat.lat, event.lngLat.lng)
    weatherMap5Day3Hour(event.lngLat.lat, event.lngLat.lng)
});