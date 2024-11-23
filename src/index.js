import "./style.css";

import clearDayIcon from "./icons/clear-day.svg";
import clearNightIcon from "./icons/clear-night.svg";
import partlyCloudyDayIcon from "./icons/partly-cloudy-day.svg";
import partlyCloudyNightIcon from "./icons/partly-cloudy-night.svg";
import cloudIcon from "./icons/cloud.svg";
import windIcon from "./icons/wind.svg";
import fogIcon from "./icons/fog.svg";
import rainIcon from "./icons/rain.svg";
import snowIcon from "./icons/snow.svg";

const conditionMap = {
    "clear-day": clearDayIcon,
    "clear-night": clearNightIcon,
    "partly-cloudy-day": partlyCloudyDayIcon,
    "partly-cloudy-night": partlyCloudyNightIcon,
    cloud: cloudIcon,
    wind: windIcon,
    fog: fogIcon,
    rain: rainIcon,
    snow: snowIcon,
};

const API_KEY = "X6WS2JMR5ETMBW469W9GKPJAH";

let daysMetric;
let daysImperial;
let currentDays;
let currentDay;

let unit = "metric";

const weatherContainer = document.getElementById("weather");
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", async () => {
    const city = searchInput.value;
    const data = await getWeatherData(city);
    daysMetric = getWeatherDays(data);
    daysImperial = getImperialWeatherDays();
    currentDays = daysMetric;
    currentDay = daysMetric[0];
    renderWeather();
});

function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

function kphToMph(kph) {
    return kph * 0.621371;
}

function getImperialWeatherDays() {
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
    const data = await response.json();

    return data;
}

function getNearestHour() {
    const now = new Date();

    const minutes = now.getMinutes();

    if (minutes >= 30) {
        now.setHours(now.getHours() + 1);
    }

    return now.getHours();
}

function formatEpochTime(epochTime) {
    const date = new Date(epochTime * 1000);
    const options = {
        weekday: "long",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    };
    return date.toLocaleString("en-US", options);
}

function getWeatherDays(data) {
    const currentHour = getNearestHour();
    const days = data.days.slice(0, 7).map((day) => {
        const hour = day.hours[currentHour];

        return {
            date: day.datetime,
            temp: Math.round(hour.temp),
            condition: hour.conditions,
            icon: hour.icon,
            address: data.resolvedAddress,
            time: formatEpochTime(hour.datetimeEpoch),
            precipitation: Math.round(hour.precip),
            humidity: Math.round(hour.humidity),
            wind: Math.round(hour.windspeed),
            max: Math.round(day.tempmax),
            min: Math.round(day.tempmin),
        };
    });

    return days;
}

function getShortDayName(date) {
    const dateObj = new Date(date);
    const shortDay = dateObj.toLocaleDateString("en-US", { weekday: "short" });

    return shortDay;
}

function renderWeather() {
    const weatherContainer = document.getElementById("weather");

    weatherContainer.innerHTML = `
    <div class="main">
        <div class="header">
            <div class="temperature">
                <img src="${conditionMap[currentDay.icon] || clearDayIcon}" alt="${currentDay.condition}">
                <h2>${currentDay.temp}</h2>
                <div class="controls">
                    <button id="celsius" class="${(currentDays === daysMetric) ? 'selected' : ''}">°C</button>
                    <button id="fahrenheit" class="${(currentDays === daysImperial) ? 'selected' : ''}">°F</button>
                </div>
            </div>
            <div class="time">
                <h3>${currentDay.time}</h3>
                <h3>${currentDay.condition}</h3>
            </div>
            <div class="info">
                <p>Precipitation: ${currentDay.precipitation}%</p>
                <p>Humidity: ${currentDay.humidity}%</p>
                <p>Wind: ${currentDay.wind} ${(currentDays === daysMetric) ? "km/h" : "mph"}</p>
            </div>
        </div>
    </div>

    <h2 class="location">${currentDay.address}</h2>

    <nav>
        ${currentDays
            .map((day, index) => {
                return `
            <div class="day ${day === currentDay ? "selected" : ""}" id="${index}">
                <h4>${getShortDayName(day.date)}</h4>
                <img src="${conditionMap[day.icon] || clearDayIcon}" alt="${day.condition}">
                <div>
                    <p class="high">${day.max}°</p>
                    <p class="low">${day.min}°</p>
                </div>
            </div>`;
            })
            .join("")}
    </nav>`;
}

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


