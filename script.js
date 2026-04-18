const baseURL = "https://de1.api.radio-browser.info"
let countries = [];
let stations = [];

// LOAD ALL COUNTRIES 
async function loadCountries() {
    const res = await fetch(`${baseURL}countries`);
    countries = await res.json();

    const select = document.getElementById("countrySelect");
    select.innerHTML = "";

    countries.forEach(c => {
        let opt = document.createElement("option");
        opt.value = c.name
        opt.textContent = c.name
        select.appendChild(opt) 
    });

    updateUI();
}
async function loadStation(country){
    const res = await fetch (`${baseURL}stations/byCountry/${country}?limit=100`)
    stations = await res.json();

    const select = document.getElementById("stationSelect");
    select.innerHTML = ""

    stations.forEach((s,i)=>{
        if(s.url_resolved){
            let opt = document.createElement("option")
            opt.value = i
            opt.textContent = s.name
            select.appendChild(opt)
        }
    });
}

function updateUI(){
    const station = stations[stationSelect.value];
    if(!station) return

    document.getElementById("stationName").textContent = station.name
    document.getElementById("stationInfo").textContent =
    `${station.tags || "No Genre"} 🔷 ${station.bitrate || "?"} kbps` 

    document.getElementById("stationLogo").src = 
        (station.favicon && station.favicon.startsWith("http"))
        ? station.favicon
        :"https://pnglove.com/detail?n=s3Z2"
}

countrySelect.addEventListener("change", e=>{
    loadStation(e.target.value)
});

stationSelect.addEventListener("change",updateUI)

// INITIATION
loadCountries();