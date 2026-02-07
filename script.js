const map = L.map("map").setView([12.9716, 77.5946], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

let marker;

const placeName = document.getElementById("placeName");
const address = document.getElementById("address");
const rating = document.getElementById("rating");
const timings = document.getElementById("timings");
const panel = document.getElementById("panel");
const dragHandle = document.getElementById("dragHandle");

map.on("click", async (e) => {
  const { lat, lng } = e.latlng;

  if (marker) marker.setLatLng(e.latlng);
  else marker = L.marker(e.latlng).addTo(map);

  placeName.textContent = "Loading place…";
  address.textContent = "Fetching address…";
  rating.textContent = "—";

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();

    placeName.textContent =
      data.name ||
      data.address?.amenity ||
      data.address?.road ||
      "Selected Location";

    address.textContent = data.display_name;
    rating.textContent = "4.3 ★★★★☆ · Place";

    panel.classList.add("open"); // auto open on mobile
  } catch {
    placeName.textContent = "Unknown place";
    address.textContent = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
});

function toggleTimings() {
  timings.style.display =
    timings.style.display === "block" ? "none" : "block";
}

/* Bottom panel toggle */
dragHandle.addEventListener("click", () => {
  panel.classList.toggle("open");
});

/* Fix map resize */
window.addEventListener("resize", () => {
  map.invalidateSize();
});
