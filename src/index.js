import "./style.css";
import conditionMap from "./conditionMap";

const API_KEY = "X6WS2JMR5ETMBW469W9GKPJAH";

let daysMetric;
let daysImperial;
let currentDays;
let currentDay;

const weatherContainer = document.getElementById("weather");
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");

function celsiusToFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
}

function kphToMph(kph) {
    return kph * 0.621371;
}

function createMetricWeatherDays(data) {
    const timezone = data.timezone;
    const now = new Date().toLocaleString("en-US", { timeZone: timezone });
    const cityHour = new Date(now).getHours();

    const days = data.days.slice(0, 7).map((day) => {
        const currentHourData = day.hours[cityHour];

        return {
            shortDay: getShortDayName(Number(currentHourData.datetimeEpoch) * 1000, timezone),
            temp: Math.round(currentHourData.temp),
            condition: currentHourData.conditions,
            icon: currentHourData.icon,
            address: data.resolvedAddress,
            time: formatEpochTime(Number(currentHourData.datetimeEpoch) * 1000, timezone),
            precipitation: Math.round(currentHourData.precip),
            humidity: Math.round(currentHourData.humidity),
            wind: Math.round(currentHourData.windspeed),
            max: Math.round(day.tempmax),
            min: Math.round(day.tempmin),
        };
    });

    return days;
}

function createImperialWeatherDays() {
    return daysMetric.map((day) => {
        return {
            ...day,
            temp: Math.round(celsiusToFahrenheit(Number(day.temp))),
            wind: Math.round(kphToMph(Number(day.wind))),
            max: Math.round(celsiusToFahrenheit(Number(day.max))),
            min: Math.round(celsiusToFahrenheit(Number(day.min))),
        };
    });
}

async function getWeatherData(city) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${API_KEY}&unitGroup=metric`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Error fetching weather data: ${response.statusText}`);
    }

    const data = await response.json();

    return data;
}

function formatEpochTime(epochTime, timeZone) {
    const date = new Date(epochTime);
    const options = {
        weekday: "long",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone
    };
    return date.toLocaleString("en-US", options);
}

function getShortDayName(date, timeZone) {
    const dateObj = new Date(date);
    const shortDay = dateObj.toLocaleDateString("en-US", { weekday: "short", timeZone });

    return shortDay;
}

function renderWeather() {
    const weatherContainer = document.getElementById("weather");

    weatherContainer.innerHTML = `
    <div class="main">
        <div class="header">
            <div class="temperature">
                <img src="${conditionMap[currentDay.icon] || conditionMap["clear-day"]}" alt="${currentDay.condition}">
                <h2>${currentDay.temp}</h2>
                <div class="controls">
                    <button id="celsius" class="${currentDays === daysMetric ? "selected" : ""}">°C</button>
                    <button id="fahrenheit" class="${currentDays === daysImperial ? "selected" : ""}">°F</button>
                </div>
            </div>
            <div class="time">
                <h3>${currentDay.time}</h3>
                <h3>${currentDay.condition}</h3>
            </div>
            <div class="info">
                <p>Precipitation: ${currentDay.precipitation}%</p>
                <p>Humidity: ${currentDay.humidity}%</p>
                <p>Wind: ${currentDay.wind} ${currentDays === daysMetric ? "km/h" : "mph"}</p>
            </div>
        </div>
    </div>

    <h2 class="location">${currentDay.address}</h2>

    <nav>
        ${currentDays
            .map((day, index) => {
                return `
            <div class="day ${day === currentDay ? "selected" : ""}" id="${index}">
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

searchBtn.addEventListener("click", async () => {
    try {
        const city = searchInput.value;
        const data = await getWeatherData(city);
        daysMetric = createMetricWeatherDays(data);
        daysImperial = createImperialWeatherDays();
        currentDays = daysMetric;
        currentDay = daysMetric[0];
        renderWeather();
    } catch (error) {
        console.log(error);
        alert("Error, check internet connection and try again");
    }
});

weatherContainer.addEventListener("click", (e) => {
    const dayElement = e.target.closest(".day");
    if (dayElement) {
        currentDay = currentDays[dayElement.id];
        renderWeather();
        return;
    }

    if (e.target.id === "celsius") {
        currentDays = daysMetric;
        currentDay = daysMetric[0];

        renderWeather();
        return;
    }

    if (e.target.id === "fahrenheit") {
        currentDays = daysImperial;
        currentDay = daysImperial[0];

        renderWeather();
        return;
    }
});

document.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});
