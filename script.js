const map = L.map("map").setView([12.9716, 77.5946], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

let marker;

const placeName = document.getElementById("placeName");
const address = document.getElementById("address");
const rating = document.getElementById("rating");
const timings = document.getElementById("timings");

map.on("click", async function (e) {
  const { lat, lng } = e.latlng;

  if (marker) {
    marker.setLatLng(e.latlng);
  } else {
    marker = L.marker(e.latlng).addTo(map);
  }

  placeName.textContent = "Loading place…";
  address.textContent = "Fetching address…";
  rating.textContent = "—";

  try {

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );

    const data = await response.json();

    const name =
      data.name ||
      data.address?.amenity ||
      data.address?.road ||
      "Selected Location";

    const fullAddress = data.display_name || "Address not available";

    placeName.textContent = name;
    address.textContent = fullAddress;
    rating.textContent = "4.3 ★★★★☆ · Place";

  } catch (error) {
    placeName.textContent = "Unknown location";
    address.textContent = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
  }
});

function toggleTimings() {
  timings.style.display =
    timings.style.display === "block" ? "none" : "block";
}
