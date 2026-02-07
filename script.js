/* SAFARI HEIGHT FIX */
function setAppHeight() {
  document.documentElement.style.setProperty(
    "--app-height",
    `${window.innerHeight}px`
  );
}
window.addEventListener("resize", setAppHeight);
window.addEventListener("orientationchange", setAppHeight);
setAppHeight();

/* MAP INIT */
const map = L.map("map").setView([12.9716, 77.5946], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

let marker;

const placeName = document.getElementById("placeName");
const addressEl = document.getElementById("address");

/* MAP CLICK */
map.on("click", async (e) => {
  const { lat, lng } = e.latlng;

  if (marker) map.removeLayer(marker);
  marker = L.marker([lat, lng]).addTo(map);

  placeName.textContent = "Loading...";
  addressEl.textContent = "Fetching address...";

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();

    placeName.textContent =
      data.name || data.address.suburb || "Selected Location";

    addressEl.textContent = data.display_name;
  } catch {
    addressEl.textContent = "Unable to fetch address";
  }

  setTimeout(() => {
    map.invalidateSize();
  }, 300);
});

/* TIMINGS TOGGLE */
document.getElementById("toggleTimings").onclick = () => {
  document.getElementById("timings").classList.toggle("hidden");
};
