// Import de la fonction qui récupère la météo (de weather.js)
import { getWeatherData } from './weather.js';

// On récupère les éléments HTML dont on a besoin
const formulaire = document.getElementById('form-ville');      // Le formulaire
const champVille = document.getElementById('ville');           // Champ de saisie de la ville
const zoneMeteo = document.getElementById('meteo');            // Zone où l'on affiche la météo actuelle
const zonePrevisions = document.getElementById('forecast');    // Zone où l'on affiche les prévisions
const zoneConseils = document.getElementById('conseils');      // Zone où l'on affiche les conseils vestimentaires

// Soumission du formulaire
formulaire.addEventListener('submit', async (event) => {
    event.preventDefault(); // empêche le rechargement de la page

    const ville = champVille.value.trim(); // on récupère la ville tapée, sans espaces
    if (!ville) return; // si rien n'est tapé, on arrête là

    try {
        // Demande des données météo pour la ville
        const donnees = await getWeatherData(ville);
        console.log("Données météo récupérées :", donnees); // (pour débug)

    // Affichage : la météo actuelle, les prévisions et les conseils
        afficherMeteo(donnees.current);
        afficherPrevisions(donnees.forecast);
        afficherConseils(donnees.current);
    } catch (error) {
        // En cas d’erreur
        zoneMeteo.textContent = "Impossible de récupérer la météo.";
        zonePrevisions.innerHTML = "";
        zoneConseils.textContent = "";
    }
});

// Fonction pour afficher la météo actuelle
function afficherMeteo(current) {
    zoneMeteo.innerHTML = `
        <p>Température actuelle : ${current.temp}°C</p>
        <p>Conditions : ${current.condition} 
           <img src="https://openweathermap.org/img/wn/${current.icon}@2x.png" 
                alt="${current.condition}">
        </p>
    `;
}

// Fonction pour afficher les 5 prochaines prévisions météo
function afficherPrevisions(forecast) {
    zonePrevisions.innerHTML = ""; // Vider d'abord l'ancien contenu

    forecast.slice(0, 5).forEach(pr => { // Les 5 premières prévisions
        const item = document.createElement('div');
        item.className = 'mini-forecast';

        item.innerHTML = `
            <p>${pr.date.split(' ')[1]}</p>  <!-- Heure (HH:MM) -->
            <p>${pr.temp}°C</p>
            <img src="https://openweathermap.org/img/wn/${pr.icon}.png" alt="${pr.condition}">
        `;

        zonePrevisions.appendChild(item);
    });
}

// Fonction pour afficher les conseils vestimentaires selon la température
function afficherConseils(current) {
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

    // Affichage du conseil dans le HTML
    zoneConseils.textContent = `Conseil tenue : ${conseil}`;
}