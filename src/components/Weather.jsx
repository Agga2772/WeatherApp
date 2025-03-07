import React, { useEffect, useState, useRef } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import snow_icon from '../assets/snow.png';
import rain_icon from '../assets/rain.png';
import humidity_icon from '../assets/humidity.png';
import wind_icon from '../assets/wind.png';

const Weather = () => {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);

    const allIcons = {
        '01d': clear_icon,
        '01n': clear_icon,
        '02d': cloud_icon,
        '02n': cloud_icon,
        '03d': cloud_icon,
        '03n': cloud_icon,
        '04d': drizzle_icon,
        '04n': drizzle_icon,
        '09d': rain_icon,
        '09n': rain_icon,
        '10d': rain_icon,
        '10n': rain_icon,
        '13d': snow_icon,
        '13n': snow_icon,
    };

    const search = async (city) => {
        if (city.trim() === '') {
            setErrorMessage('Enter a city name.');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || 'Failed to fetch weather data.');
                setTimeout(() => setErrorMessage(''), 3000);
                return;
            }

            const icon = allIcons[data.weather[0]?.icon] || clear_icon;
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon,
            });

            setSearchHistory((prev) => [...new Set([city, ...prev])].slice(0, 5));
        } catch (error) {
            setErrorMessage('Error fetching weather data.');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            search(inputRef.current.value);
        }
    };

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
                    const response = await fetch(url);
                    const data = await response.json();

                    if (!response.ok) {
                        setErrorMessage(data.message || 'Failed to fetch location weather.');
                        setTimeout(() => setErrorMessage(''), 3000);
                        return;
                    }

                    const icon = allIcons[data.weather[0]?.icon] || clear_icon;
                    setWeatherData({
                        humidity: data.main.humidity,
                        windSpeed: data.wind.speed,
                        temperature: Math.floor(data.main.temp),
                        location: data.name,
                        icon: icon,
                    });
                } catch (error) {
                    setErrorMessage('Error fetching location weather.');
                    setTimeout(() => setErrorMessage(''), 3000);
                }
            });
        } else {
            setErrorMessage('Geolocation not supported by your browser.');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };

    useEffect(() => {
        search('Leeds');
    }, []);

    return (
        <div className="weather">
            <div className="search-bar">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search"
                    onKeyDown={handleKeyPress}
                />
                <img
                    src={search_icon}
                    alt="Search"
                    onClick={() => search(inputRef.current.value)}
                />
            </div>
            <button onClick={getUserLocation} className="location-btn">
                Use My Location
            </button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {weatherData && (
                <>
                    <img src={weatherData.icon} alt="Weather Icon" className="weather-icon" />
                    <p className="temperature">{weatherData.temperature}°C</p>
                    <p className="location">{weatherData.location}</p>
                    <div className="weather-data">
                        <div className="col">
                            <img src={humidity_icon} alt="Humidity Icon" />
                            <div>
                                <p>{weatherData.humidity}</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className="col">
                            <img src={wind_icon} alt="Wind Icon" />
                            <div>
                                <p>{weatherData.windSpeed} km/h</p>
                                <span>Wind</span>
                            </div>
                        </div>
                    </div>
                    <div className="search-history">
                        <h4>Recently Searched:</h4>
                        {searchHistory.map((city, index) => (
                            <p key={index} onClick={() => search(city)}>
                                {city}
                            </p>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Weather;



