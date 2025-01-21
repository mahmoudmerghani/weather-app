export default class Helper {
    static celsiusToFahrenheit(celsius) {
        return (celsius * 9) / 5 + 32;
    }
    
    static kphToMph(kph) {
        return kph * 0.621371;
    }

    static formatEpochTime(epochTime, timeZone) {
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

    static getShortDayName(date, timeZone) {
        const dateObj = new Date(date);
        const shortDay = dateObj.toLocaleDateString("en-US", { weekday: "short", timeZone });
    
        return shortDay;
    }

    static getMetricWeek(data) {
        const timezone = data.timezone;
        const now = new Date().toLocaleString("en-US", { timeZone: timezone });
        const cityHour = new Date(now).getHours();
    
        const days = data.days.slice(0, 7).map((day) => {
            const currentHourData = day.hours[cityHour];
    
            return {
                type: "metric",
                speedUnit: "km/h",
                shortDay: this.getShortDayName(Number(currentHourData.datetimeEpoch) * 1000, timezone),
                temp: Math.round(currentHourData.temp),
                condition: currentHourData.conditions,
                icon: currentHourData.icon,
                address: data.resolvedAddress,
                time: this.formatEpochTime(Number(currentHourData.datetimeEpoch) * 1000, timezone),
                precipitation: Math.round(currentHourData.precip),
                humidity: Math.round(currentHourData.humidity),
                wind: Math.round(currentHourData.windspeed),
                max: Math.round(day.tempmax),
                min: Math.round(day.tempmin),
            };
        });
    
        return days;
    }

    static getImperialWeek(data) {
        return this.getMetricWeek(data).map((day) => {
            return {
                ...day,
                type: "imperial",
                speedUnit: "mph",
                temp: Math.round(this.celsiusToFahrenheit(Number(day.temp))),
                wind: Math.round(this.kphToMph(Number(day.wind))),
                max: Math.round(this.celsiusToFahrenheit(Number(day.max))),
                min: Math.round(this.celsiusToFahrenheit(Number(day.min))),
            };
        });
    }

    static async getWeatherData(city, API_KEY) {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${API_KEY}&unitGroup=metric`;
    
        const response = await fetch(url);
    
        if (!response.ok) {
            throw new Error(`Error fetching weather data: ${response.statusText}`);
        }
    
        const data = await response.json();
    
        return data;
    }
}