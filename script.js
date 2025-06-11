// Import de la fonction qui récupère la météo (de weather.js)
import { getWeatherData } from './weather.js';

// On récupère les éléments HTML avec querySelector (plus moderne)
const form = document.querySelector('#form-ville');       // Le formulaire
const cityInput = document.querySelector('#ville');       // Champ de saisie
const weatherZone = document.querySelector('#meteo');     // Affichage météo actuelle
const forecastZone = document.querySelector('#forecast'); // Prévisions météo
const adviceZone = document.querySelector('#conseils');   // Conseils vestimentaires

// Soumission du formulaire
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const ville = cityInput.value.trim();
    if (!ville) return;

    try {
        const data = await getWeatherData(ville);
        console.log("Données météo récupérées :", data);

        displayWeather(data.current);
        displayForecast(data.forecast);
        displayOutfitAd(data.current);
    } catch (error) {
        weatherZone.textContent = "Impossible de récupérer la météo.";
        forecastZone.innerHTML = "";
        adviceZone.textContent = "";
    }
});

// Affichage de la météo actuelle
function displayWeather(current) {
    weatherZone.innerHTML = `
        <p>Température actuelle : ${current.temp}°C</p>
        <p>Conditions : ${current.condition} 
           <img src="https://openweathermap.org/img/wn/${current.icon}@2x.png" 
                alt="${current.condition}">
        </p>
    `;
}

// Affichage des prévisions (5 prochaines heures)
function displayForecast(forecast) {
    forecastZone.innerHTML = "";

    forecast.slice(0, 5).forEach(pr => {
        const item = document.createElement('div');
        item.className = 'mini-forecast';

        item.innerHTML = `
            <p>${pr.date.split(' ')[1]}</p>
            <p>${pr.temp}°C</p>
            <img src="https://openweathermap.org/img/wn/${pr.icon}.png" alt="${pr.condition}">
        `;

        forecastZone.appendChild(item);
    });
}

// Affichage des conseils vestimentaires
function displayOutfitAd(current) {
    const temp = current.temp;
    let conseil = "";

    if (temp < 5)
        conseil = "Grosse veste, bonnet, et gants obligatoires. C’est pas le temps pour un défilé.";
    else if (temp < 12)
        conseil = "Veste légère ou un pull chaud. On veut pas finir sous 3 couches de couvertures.";
    else if (temp < 20)
        conseil = "Un t-shirt avec une petite veste. Mi-saison, mi-style";
    else
        conseil = "Oversize, lunettes de soleil, casquette. Time to shine (littéralement)";

    adviceZone.textContent = `Conseil tenue : ${conseil}`;
}