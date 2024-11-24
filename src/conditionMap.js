import clearDayIcon from "./icons/clear-day.svg";
import clearNightIcon from "./icons/clear-night.svg";
import partlyCloudyDayIcon from "./icons/partly-cloudy-day.svg";
import partlyCloudyNightIcon from "./icons/partly-cloudy-night.svg";
import cloudIcon from "./icons/cloudy.svg";
import windIcon from "./icons/wind.svg";
import fogIcon from "./icons/fog.svg";
import rainIcon from "./icons/rain.svg";
import snowIcon from "./icons/snow.svg";

const conditionMap = {
    "clear-day": clearDayIcon,
    "clear-night": clearNightIcon,
    "partly-cloudy-day": partlyCloudyDayIcon,
    "partly-cloudy-night": partlyCloudyNightIcon,
    cloudy: cloudIcon,
    wind: windIcon,
    fog: fogIcon,
    rain: rainIcon,
    snow: snowIcon,
};

export default conditionMap;