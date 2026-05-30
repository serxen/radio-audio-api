const baseURL = "https://de1.api.radio-browser.info";

let countries = [];
let stations = [];

const countrySelect = document.getElementById("countrySelect");
const stationSelect = document.getElementById("stationSelect");

/* ======================
   LOAD ALL COUNTRIES
====================== */
async function loadCountries() {
    try {
        const res = await fetch(`${baseURL}/json/countries`);
        countries = await res.json();

        countrySelect.innerHTML = "";

        countries.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.name;
            opt.textContent = c.name;
            countrySelect.appendChild(opt);
        });

        // Optional: auto-load first country's stations
        if (countries.length) {
            loadStations(countries[0].name);
        }

    } catch (err) {
        console.error("Failed to load countries:", err);
    }
}

/* ======================
   LOAD STATIONS BY COUNTRY
====================== */
async function loadStations(country) {
    try {
        const res = await fetch(
            `${baseURL}/json/stations/bycountry/${encodeURIComponent(country)}?limit=100`
        );

        stations = (await res.json()).filter(s => s.url_resolved);

        stationSelect.innerHTML = "";

        stations.forEach((s, i) => {
            const opt = document.createElement("option");
            opt.value = i;
            opt.textContent = s.name;
            stationSelect.appendChild(opt);
        });

        // Auto-select first station
        if (stations.length) {
            stationSelect.value = 0;
            updateUI();
        }

    } catch (err) {
        console.error("Failed to load stations:", err);
    }
}

/* ======================
   UPDATE STATION UI
====================== */
function updateUI() {
    const station = stations[stationSelect.value];
    if (!station) return;

    document.getElementById("stationName").textContent = station.name;

    document.getElementById("stationInfo").textContent =
        `${station.tags ? station.tags.split(",")[0] : "No Genre"} 🔷 ${station.bitrate || "?"} kbps`;

    document.getElementById("stationLogo").src =
        station.favicon && station.favicon.startsWith("http")
            ? station.favicon
            : "https://via.placeholder.com/150?text=No+Logo";
}

/* ======================
   EVENT LISTENERS
====================== */
countrySelect.addEventListener("change", e => {
    loadStations(e.target.value);
});

stationSelect.addEventListener("change", updateUI);

/* ======================
   INIT
====================== */
loadCountries();