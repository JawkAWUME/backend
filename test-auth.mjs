import axios from 'axios';
import { faker } from "@faker-js/faker"
import fs from 'fs';

const nationalities = {
    "Sénégal": { firstNames: ["Mamadou", "Fatou", "Ibrahima", "Aïssata", "Ousmane"], lastNames: ["Diop", "Sarr", "Ndiaye", "Ba", "Faye"] },
    "Togo": { firstNames: ["Koffi", "Komlan", "Afi", "Yawovi", "Abra"], lastNames: ["Amouzou", "Adjavon", "Kpakpo", "Dosseh", "Gbogbo"] },
    "Ghana": { firstNames: ["Kwame", "Akosua", "Yaw", "Kojo", "Ama"], lastNames: ["Mensah", "Owusu", "Boateng", "Asare", "Addo"] },
    "Nigéria": { firstNames: ["Chinedu", "Ngozi", "Olusegun", "Chukwu", "Adanna"], lastNames: ["Okonkwo", "Adebayo", "Obi", "Ogun", "Eze"] },
    "Côte d'Ivoire": { firstNames: ["Kouadio", "Konan", "Ahoua", "Yao", "Adjoua"], lastNames: ["Ouattara", "Guei", "Kouassi", "Zadi", "Dosso"] },
    "Mali": { firstNames: ["Boubacar", "Awa", "Soumaila", "Djeneba", "Oumar"], lastNames: ["Traoré", "Keita", "Coulibaly", "Konate", "Samake"] },
    "Burkina Faso": { firstNames: ["Salif", "Rokia", "Dramane", "Mariam", "Oumarou"], lastNames: ["Kaboré", "Sawadogo", "Ouédraogo", "Zongo", "Sanou"] },
    "Bénin": { firstNames: ["Abiola", "Adjovi", "Koffi", "Tossou", "Eunice"], lastNames: ["Agbo", "Tossavi", "Djossou", "Adjinou", "Houngbedji"] },
    "Guinée": { firstNames: ["Sekou", "Fatoumata", "Ibrahima", "Moussa", "Mariam"], lastNames: ["Bangoura", "Condé", "Diallo", "Camara", "Sylla"] },
};

const users = Array.from({ length: 1000}, () => {
    const nationality = faker.helpers.arrayElement(Object.keys(nationalities));
    const { firstNames, lastNames} = nationalities[nationality];
    
    const firstName = Array.from(
        {length: faker.number.int({ min: 1, max: 3}) },
        () => faker.helpers.arrayElement(firstNames)
    ).join(' ');

    return {
        username: `${firstName} ${faker.helpers.arrayElement(lastNames)}`,
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password({ length: 10, memorable: true}),
        nationality
    }
})

const API_BASE_URL = 'http://localhost:4001/auth';
const USERS_API = 'http://localhost:4001/users'

const tokens = [];

const testAuthEndpoints = async () => {
    for (const user of users) {
        try {
            const registerResponse = await axios.post(`${API_BASE_URL}/register`,{
                username: user.username,
                email:user.email,
                password:user.password,
            })

            console.log(`✔️ ${user.username} enregistré (${user.nationality})`)

            const loginResponse = await axios.post(`${API_BASE_URL}/login`, {
                email: user.email,
                password: user.password
            })

            const token = loginResponse.data.access_token;
            tokens.push({email:user.email, token:token,password:user.password})

            console.log(`🔑 ${user.username} connecté, Token enregistré`)
        } catch (error) {
            console.error(error);
            console.error(`❌ Erreur avec ${user.username}: ${error.response?.data || error.message}`)
        }
    }
    fs.writeFileSync('tokens.json', JSON.stringify(tokens,null,2))
    console.log("✅ Tokens enregistrés dans tokens.json");

    await testUserProfiles();
} 

const testUserProfiles = async () => {
    const tokensData = JSON.parse(fs.readFileSync('tokens.json', 'utf8'))

    for (const { email, token } of tokensData.slice(0,20)) {
        try {
            const profileResponse = await axios.get(USERS_API, {
                headers: { Authorization: `Bearer ${token}`}
            })

            console.log(`📌 Profil de ${email}:`, profileResponse.data);
        } catch(error) {
            console.error(`⚠️ Impossible d'accéder au profil de ${email}:`, error.response?.data || error.message);
        }
    }
}

testAuthEndpoints();
