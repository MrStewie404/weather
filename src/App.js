import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';

function App() {
  const [city, setCity] = useState('Москва');
  const [weatherDataNow, setWeatherDataNow] = useState(null);
  const [weatherDataFiveDay, setWeatherDataFiveDay] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // Состояние для видимости меню
  const buttonRef = useRef(null); // Ссылка на кнопку
  const [cities, setCities] = useState(['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Ставрополь', 'Нижний Новгород', 'Новосибирск']); // Список городов

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleCityClick = (newCity) => {
    setCity(newCity);
    setIsOpen(false); // Закрыть меню после выбора города
  };

  useEffect(() => {
    const apiKey = '58747994067c8c0d210e62c59616b3b1'; 
    // const apiUrlNow = 'http://172.20.10.3:3000/data'
    // const apiUrlFiveDay = 'http://172.20.10.3:3001/data'
    const apiUrlNow = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&units=metric&lang=ru' ; 
    const apiUrlFiveDay = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey + '&units=metric&lang=ru';  

    axios.get(apiUrlNow)
        .then(response => setWeatherDataNow(response.data))
        .catch(error => console.error('Ошибка при получении данных о текущей погоде:', error));

    axios.get(apiUrlFiveDay)
      .then(response => setWeatherDataFiveDay(response.data))
      .catch(error => {
        console.error('Ошибка при получении данных о 5-дневном прогнозе:', error);
        setWeatherDataFiveDay({ error: true }); // Сохраните информацию об ошибке
      });
  }, [city]);
    console.info(weatherDataFiveDay);

  if (weatherDataNow) {
    return (
      <body>
        <div class="connected">
          <div class="city">
            {/* <h3>Погода в городе '</h3> */}
            <form onSubmit={handleSubmit}>
              <h3>Выбрано: {city}</h3>
              {/* <input 
                type="text" 
                className="my-input"
                value={city} 
                onChange={e => setCity(e.target.value)} 
                style={{ width: city.length * 15 + 'px' }}
              /> */}
              {console.log(city.length)}
                <button ref={buttonRef} onClick={toggleMenu}>Открыть меню</button> 
                {isOpen && (
                  <ul className="dropdown-menu"
                    style={{ 
                      position: 'absolute',
                      top: buttonRef.current.offsetTop + buttonRef.current.offsetHeight,
                    }}>
                    {cities.map((cityItem, index) => (
                      <h3 style={{ border: '1px solid #000' }} key={index} onClick={() => handleCityClick(cityItem)}>
                        
                        {cityItem}
                      </h3>
                    ))}
                    </ul>
                  )}
              </form>
              {/* <h3>' на сегодня:</h3> */}
            </div>
              <fieldset class={
              weatherDataNow.main.temp < 15
                ? 'weather-block weather-block-cold'
                : weatherDataNow.main.temp < 20
                ? 'weather-block weather-block-warm'
                : 'weather-block weather-block-hot'
              }>
                <p>Температура: {weatherDataNow.main.temp} °C</p>
                <p>Ощущается как: {weatherDataNow.main.feels_like} °C</p>
                <p>{weatherDataNow.weather[0].description}</p>
              </fieldset>
            </div>
          <div>
          {weatherDataFiveDay && !weatherDataFiveDay.error && (
            <div>
              <hr></hr>
              <div class="weather-five-day">
                {weatherDataFiveDay.list.slice(4, 40).map((item, index) => (
                      <div key={index}  style={{ margin: '20px 1px'}}>
                      {index % 8 === 0 && (
                        <fieldset class={
                          item.main.temp < 10
                            ? 'weather-block weather-block-cold'
                            : item.main.temp < 25
                            ? 'weather-block weather-block-warm'
                            : 'weather-block weather-block-hot'
                          }>
                          <h2 class='time' style={{ display: 'flex', justifyContent: 'center' }}>{moment(item.dt * 1000).format('DD.MM')}</h2>
                          <div>
                            <p>Температура: {item.main.temp} °C</p>
                            <p>Ощущается как: {item.main.feels_like} °C</p>
                            <p>Скорость ветра: {item.wind.speed}м/с</p>
                          </div>
                          <fieldset class='second'>
                            <p style={{ padding: '0px', margin: '10px auto', justifyContent: 'center'}}>{item.weather[0].description}</p>
                          </fieldset>
                        </fieldset>
                      )}
                    </div>
                ))}
              </div>
            </div>
            )}
            {weatherDataFiveDay && weatherDataFiveDay.error && ( // Отображение сообщения об ошибке
              <div>
                <p>Произошла ошибка при загрузке 5-дневного прогноза.</p>
              </div>
            )}
          </div>
        </body>
      );
    } else {
      return (
        <div class="error_connect">
          <h1>Нет соединения</h1>
          <p style={{ textAlign: 'center' }}>Проверьте своё подключение к интернету или попробуйте позже</p>
        </div>
      );
    }
  
    function handleSubmit(event) {
      event.preventDefault();
  
    }
  }
  
  export default App;
  