import axios from 'axios';
import { faker } from '@faker-js/faker';
import cliProgress from 'cli-progress';

const API_BASE_URL = 'http://localhost:4001';
const NEWSLETTERS_ENDPOINT = '/content/create/newsletter';
const USERS_ENDPOINT = '/users';

const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFmaSBBYnJhIEtwYWtwbyIsInN1YiI6IjY3ZTNlYTEzNjZhYThlNDQ5MTNmYjZiZCIsImlhdCI6MTc0NDI4MzgwNywiZXhwIjoxNzQ0MzE2MjA3fQ.BfcnLT68Ev4IwwUzcQlkAOGbdDziLKJSZtanQmak_sE";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Authorization: TOKEN,
        'Content-Type': 'application/json'
    }
})

const generateTestNewsletters = async () => {
    try {
        const usersResponse = await api.get(USERS_ENDPOINT);
        const users = usersResponse.data;

        if (!Array.isArray(users) || users.length === 0) {
            throw new Error('Liste des utilisateurs vide ou invalide.');
        }

        const newsletters = [];

        for (let i = 0; i < 30;i++) {
            const randomUser = users[Math.floor(Math.random()* users.length)];

            newsletters.push({
                _tempId: faker.string.uuid(),
                title: faker.lorem.sentence(),
                topic: faker.lorem.word(),
                body: faker.lorem.paragraphs(4),
                imageUrl: faker.image.urlPicsumPhotos(),
                subscriptionList: faker.helpers.arrayElements(
                    users.map((user) => user._id),
                    faker.number.int({ min: 1, max: 5})
                ),
                frequency: faker.helpers.arrayElement(['daily', 'weekly', 'monthly']),
                isSent: faker.datatype.boolean(),
                newsletterType: faker.helpers.arrayElement(['informative', 'promotional', 'transactional']),
                author: randomUser._id,
            });
        }
        
        const tempIdToMongoIdMap = new Map();
        const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        progressBar.start(newsletters.length,0);

        for (const [index, newsletter] of newsletters.entries()) {
            try {
                const {_tempId, subscriptionList,...newsletterData} = newsletter;

                const res = await api.post(NEWSLETTERS_ENDPOINT, newsletterData);
                const mongoId = res.data._id;

                tempIdToMongoIdMap.set(_tempId, mongoId);
                newsletter._realId = mongoId;

                console.log(` [${index + 1}] Newsletter "${newsletter.title}" créée avec ID: ${mongoId}`)
            } catch (error) {
                console.error(`\n Erreur lors de la création de la newsletter "${newsletter.title}" (index ${index})`);
                handleError(error);
            }

            progressBar.increment();
        }

        progressBar.stop();
        console.log('\n Newsletters créées.');

    } catch (error) {
        console.error(`\n Erreur globale lors de la génération de newsletters :`);
        handleError(error);
    }
}

const handleError = (error) => {
    if (error.response) {
        console.error('🛑 Réponse erreur du serveur :');
        console.error('Status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
        console.error('📡 Aucune réponse reçue du serveur.');
        console.error(error.request);
    } else {
        console.error('💥 Erreur inattendue :', error.message);
    }

    console.error('🔍 Stack trace :');
    console.error(error.stack);
}

generateTestNewsletters();