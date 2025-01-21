import Helper from "./Helper";
import conditionMap from "./conditionMap";

export default class WeatherApp {
    API_KEY = "X6WS2JMR5ETMBW469W9GKPJAH";
    metricWeek;
    imperialWeek;
    currentWeek;
    currentDayIndex;

    constructor() {
        this.init();
    }

    init() {
        const weatherContainer = document.getElementById("weather");
        const searchInput = document.getElementById("search");
        const searchBtn = document.getElementById("searchBtn");

        searchBtn.addEventListener("click", async () => {
            try {
                const city = searchInput.value;
                const data = await Helper.getWeatherData(city, this.API_KEY);

                this.metricWeek = Helper.getMetricWeek(data);
                this.imperialWeek = Helper.getImperialWeek(data);
                this.currentWeek = this.metricWeek;
                this.currentDayIndex = 0;

                weatherContainer.style.display = "block";
                this.renderWeather();
            } catch (error) {
                console.log(error);
                alert("Error, Check internet connection and try again");
            }
        });

        weatherContainer.addEventListener("click", (e) => {
            const dayElement = e.target.closest(".day");
            if (dayElement) {
                this.currentDayIndex = dayElement.id;
                this.renderWeather();
                return;
            }

            if (e.target.id === "celsius") {
                this.currentWeek = this.metricWeek;

                this.renderWeather();
                return;
            }

            if (e.target.id === "fahrenheit") {
                this.currentWeek = this.imperialWeek;

                this.renderWeather();
                return;
            }
        });

        document.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                searchBtn.click();
            }
        });
    }

    renderWeather() {
        const selectedDay = this.currentWeek[this.currentDayIndex];
        const weatherContainer = document.getElementById("weather");

        weatherContainer.innerHTML = `
        <div class="main">
            <div class="header">
                <div class="temperature">
                    <img src="${conditionMap[selectedDay.icon] || conditionMap["clear-day"]}" alt="${selectedDay.condition}">
                    <h2>${selectedDay.temp}</h2>
                    <div class="controls">
                        <button id="celsius" class="${selectedDay.type === "metric" ? "selected" : ""}">°C</button>
                        <button id="fahrenheit" class="${selectedDay.type === "imperial" ? "selected" : ""}">°F</button>
                    </div>
                </div>
                <div class="time">
                    <h3>${selectedDay.time}</h3>
                    <h3>${selectedDay.condition}</h3>
                </div>
                <div class="info">
                    <p>Precipitation: ${selectedDay.precipitation}%</p>
                    <p>Humidity: ${selectedDay.humidity}%</p>
                    <p>Wind: ${selectedDay.wind} ${selectedDay.speedUnit}</p>
                </div>
            </div>
        </div>
    
        <h2 class="location">${selectedDay.address}</h2>
    
        <nav>
            ${this.currentWeek
                .map((day, index) => {
                    return `
                <div class="day ${day === selectedDay ? "selected" : ""}" id="${index}">
                    <h4>${day.shortDay}</h4>
                    <img src="${conditionMap[day.icon] || conditionMap["clear-day"]}" alt="${day.condition}">
                    <div>
                        <p class="high">${day.max}°</p>
                        <p class="low">${day.min}°</p>
                    </div>
                </div>`;
                })
                .join("")}
        </nav>`;
    }
}
