import { getWeatherData } from './weather.js';

const formulaire = document.getElementById('form-ville');
const champVille = document.getElementById('ville');
const zoneMeteo = document.getElementById('meteo');
const zonePrevisions = document.getElementById('forecast');
const zoneConseils = document.getElementById('conseils');

formulaire.addEventListener('submit', async (event) => {
    event.preventDefault();
    const ville = champVille.value.trim();
    if (!ville) return;

    try {
        const donnees = await getWeatherData(ville);
        console.log("Données météo récupérées :", donnees);

        afficherMeteo(donnees.current);
        afficherPrevisions(donnees.forecast);
        afficherConseils(donnees.current);
    } catch (error) {
        zoneMeteo.textContent = "Impossible de récupérer la météo.";
        zonePrevisions.innerHTML = "";
        zoneConseils.textContent = "";
    }
});

function afficherMeteo(current) {
    zoneMeteo.innerHTML = `
    <p>Température actuelle : ${current.temp}°C</p>
    <p>Conditions : ${current.condition} <img src="https://openweathermap.org/img/wn/${current.icon}@2x.png" alt="${current.condition}"></p>
  `;
}

function afficherPrevisions(forecast) {
    zonePrevisions.innerHTML = "";
    forecast.slice(0, 5).forEach(pr => {
        const item = document.createElement('div');
        item.className = 'mini-forecast';
        item.innerHTML = `
      <p>${pr.date.split(' ')[1]}</p>
      <p>${pr.temp}°C</p>
      <img src="https://openweathermap.org/img/wn/${pr.icon}.png" alt="${pr.condition}">
    `;
        zonePrevisions.appendChild(item);
    });
}

function afficherConseils(current) {
    const temp = current.temp;
    let conseil = "";

    if (temp < 5) conseil = "Brr, c'est frisqué... Porter un manteau chaud, un bonnet et des gants.";
    else if (temp < 12) conseil = "Une veste légère ou un pull suffira pour éviter d'attraper froid.";
    else if (temp < 20) conseil = "Un t-shirt avec une petite veste.";
    else conseil = "T-shirt léger, lunettes de soleil (surtout pour le style), casquette ! Penser aussi à la crême solaire, on ne sait jamais.";

    zoneConseils.textContent = `Conseil tenue : ${conseil}`;
}