//gets the temperature from openweathermap
export async function getTemperature() {
    const url = 'https://api.openweathermap.org/data/2.5/weather?lat=30.601389&lon=-96.314445&appid=a332dd0da0997509543daee544df1643&units=imperial';//api key: a332dd0da0997509543daee544df1643

    try {
        const everything = await fetch(url);
        const everythingJson = await everything.json(); 
        const temperature = parseFloat(everythingJson.main.temp);
        return temperature;
    }
    catch (error) {
        consol.error('Error while getting temperature: ', error);
        return -1;
    }

}