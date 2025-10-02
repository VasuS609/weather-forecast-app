import { useEffect, useState } from "react";

function App() {
  const API_KEY = import.meta.env.VITE_API_KEY; // 👈 if using Vite
  // const API_KEY = process.env.REACT_APP_API_KEY; // 👈 if using CRA

  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("India");
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchWeatherData = async (cityName) => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=imperial`;
        const response = await fetch(url);
        const data = await response.json();
        setWeatherData(data);

        const foreCastresponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=imperial`
        );
        const forecastdata = await foreCastresponse.json();

        // Take one entry per day (every 8th index = 24 hrs)
        const dailyForecast = forecastdata.list.filter(
          (item, index) => index % 8 === 0
        );
        setForecast(dailyForecast);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchWeatherData(city);
  }, [city]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      setCity(input);
      setInput("");
    }
  };

  return (
    <div className="h-screen w-screen bg-blue-300 flex justify-center items-center p-6">
      <section className="bg-blue-200 rounded-2xl shadow-lg p-6 w-full max-w-md">
        
        {/* Search */}
        <form onSubmit={handleSearch} className="flex mb-4">
          <input
            type="text"
            placeholder="Enter city..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 rounded-l-lg border"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 rounded-r-lg"
          >
            Search
          </button>
        </form>

        {/* Current Weather */}
        {weatherData && weatherData.main ? (
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-bold text-2xl">{weatherData.name}</h1>
            <p className="text-lg">{Math.round(weatherData.main.temp)}°F</p>
            <p className="text-gray-700">{weatherData.weather[0].description}</p>
            <div className="flex gap-8 mt-2 text-sm">
              <p>💧 Humidity: {weatherData.main.humidity}%</p>
              <p>🌬 Wind: {weatherData.wind.speed} mph</p>
            </div>
          </div>
        ) : (
          <p className="text-center">Loading weather...</p>
        )}

        {/* Forecast */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <h2 className="font-bold text-xl">5-Day Forecast</h2>
          <div className="flex flex-col gap-2">
            {forecast.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between w-56 bg-blue-100 px-3 py-1 rounded-lg"
              >
                <p>
                  {new Date(item.dt_txt).toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </p>
                <p>
                  {Math.round(item.main.temp)}°F{" "}
                  {item.weather[0].main === "Clouds"
                    ? "☁️"
                    : item.weather[0].main === "Rain"
                    ? "🌧"
                    : "☀️"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
