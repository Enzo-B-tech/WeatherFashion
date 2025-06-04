const API_KEY = 'c0d19a7229ad8a71273f57057423c1e2';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getWeatherData(ville = 'Paris') {
    // Préparation des deux URL
    const urlCurrent  = `${BASE_URL}/weather?q=${encodeURIComponent(ville)}&units=metric&appid=${API_KEY}`;
    const urlForecast = `${BASE_URL}/forecast?q=${encodeURIComponent(ville)}&units=metric&appid=${API_KEY}`;

    // Lancer les deux fetchs en parallèle grâce à Promise.all()
    const [resCurrent, resForecast] = await Promise.all([
        fetch(urlCurrent),
        fetch(urlForecast),
    ]);

    // Erreur si l’une des deux requêtes échoue
    if (!resCurrent.ok || !resForecast.ok) {
        throw new Error('Impossible de récupérer la météo pour cette ville');
    }

    // Transformer les réponses en JSON
    const [currentData, forecastData] = await Promise.all([
        resCurrent.json(),
        resForecast.json(),
    ]);

    // Réponse de l'API affichées dans la console du nav (debug)
    console.log("Données brutes actuelles :", currentData);
    console.log("Données brutes prévisions :", forecastData);
    //Affichage des données de manière intelligente
    return {
        current: {
            temp: currentData.main.temp,
            condition: currentData.weather[0].main,
            icon: currentData.weather[0].icon,
        },
        forecast: forecastData.list.map((item) => ({
            date: item.dt_txt,
            temp: item.main.temp,
            condition: item.weather[0].main,
            icon: item.weather[0].icon,
        })),
    };
}
