document.addEventListener('DOMContentLoaded', () => {
    const weatherForm = document.getElementById('weatherForm');
    const locationInput = document.getElementById('location');
    const loadingDiv = document.getElementById('loading');
    const weatherDisplay = document.getElementById('weatherDisplay');
    const locationName = document.getElementById('locationName');
    const weatherIcon = document.getElementById('weatherIcon');
    const weatherCondition = document.getElementById('weatherCondition');
    const temperature = document.getElementById('temperature');
    const toggleTempBtn = document.getElementById('toggleTemp');
    const errorDiv = document.getElementById('error');
  
    const weatherAPIKey = '99efd950117947b1ba7234038240906';
    const giphyAPIKey = '7u8nAamj2YCl6WX2VpWx8orwSuDaBu67';
  
    let currentTempCelsius = true;
    let currentTemperature = 0;
  
    async function fetchWeather(location) {
      try {
        loadingDiv.style.display = 'block';
        weatherDisplay.style.display = 'none';
        errorDiv.textContent = '';
  
        const weatherResponse = await fetch(`https://api.weatherapi.com/v1/current.json?key=${weatherAPIKey}&q=${location}`);
        const weatherData = await weatherResponse.json();
  
        if (weatherData.error) {
          throw new Error(weatherData.error.message);
        }
  
        const { name, region, country } = weatherData.location;
        const { temp_c, temp_f, condition } = weatherData.current;
  
        currentTemperature = temp_c;
        currentTempCelsius = true;
  
        locationName.textContent = `${name}, ${region}, ${country}`;
        weatherIcon.src = `https:${condition.icon}`;
        weatherCondition.textContent = condition.text;
        temperature.textContent = `${temp_c} °C`;
  
        weatherDisplay.style.display = 'block';
        loadingDiv.style.display = 'none';
  
        fetchGif(condition.text);
      } catch (error) {
        errorDiv.textContent = error.message;
        loadingDiv.style.display = 'none';
      }
    }
  
    async function fetchGif(query) {
      try {
        const gifResponse = await fetch(`https://api.giphy.com/v1/gifs/translate?api_key=${giphyAPIKey}&s=${query}`, { mode: 'cors' });
        const gifData = await gifResponse.json();
  
        if (gifData.data && gifData.data.images) {
          document.body.style.backgroundImage = `url(${gifData.data.images.original.url})`;
        } else {
          document.body.style.backgroundImage = '';
        }
      } catch (error) {
        console.log('Error fetching gif:', error);
        document.body.style.backgroundImage = '';
      }
    }
  
    weatherForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const location = locationInput.value.trim();
      if (location) {
        fetchWeather(location);
      }
    });
  
    toggleTempBtn.addEventListener('click', () => {
      if (currentTempCelsius) {
        temperature.textContent = `${(currentTemperature * 9/5) + 32} °F`;
      } else {
        temperature.textContent = `${currentTemperature} °C`;
      }
      currentTempCelsius = !currentTempCelsius;
    });
  });
  