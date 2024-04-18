const API_Key = 'a332dd0da0997509543daee544df1643';

//gets the temperature from openweathermap
export async function getTemperature() {
    const url = 'https://api.openweathermap.org/data/2.5/weather?lat=30.601389&lon=-96.314445&appid='+ API_Key +'&units=imperial';

    try {
        const everything = await fetch(url);
        const everythingJson = await everything.json(); 
        const temperature = parseFloat(everythingJson.main.temp);
        return temperature;
    }
    catch (error) {
        return 0;//it doesn't really matter, it will just display the burgers
    }
}

//gets the temperature from openweathermap
export async function getCondition() {
    const url = 'https://api.openweathermap.org/data/2.5/weather?lat=30.601389&lon=-96.314445&appid='+ API_Key;

    try {
        const everything = await fetch(url);
        const everythingJson = await everything.json(); 
        const temperature = String(everythingJson.weather[0].description);
        return temperature;
    }
    catch (error) {
        return 'Error';//it doesn't really matter, it will just display the burgers
    }
}