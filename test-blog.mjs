import axios from 'axios';
import { faker } from "@faker-js/faker";
import cliProgress from 'cli-progress';

const API_BASE_URL = "http://localhost:4001";
const BLOGS_ENDPOINT = "/content/create/blog";
const USERS_ENDPOINT = "/users";

const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFmaSBBYnJhIEtwYWtwbyIsInN1YiI6IjY3ZTNlYTEzNjZhYThlNDQ5MTNmYjZiZCIsImlhdCI6MTc0NDI4MzgwNywiZXhwIjoxNzQ0MzE2MjA3fQ.BfcnLT68Ev4IwwUzcQlkAOGbdDziLKJSZtanQmak_sE";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Authorization: TOKEN,
        'Content-Type': 'application/json'
    }
});

const generateTestBlogs = async () => {
    try {
        const usersResponse = await api.get(USERS_ENDPOINT);
        const users = usersResponse.data;

        if (!Array.isArray(users) || users.length === 0) {
            throw new Error('Liste des utilisateurs vide ou invalide.');
        }

        const fakeBlogs = [];

        for (let i = 0; i < 30; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];

            fakeBlogs.push({
                _tempId: faker.string.uuid(),
                title: faker.lorem.sentence(),
                topic: faker.lorem.word(),
                body: faker.lorem.paragraphs(4),
                imageUrl: faker.image.urlPicsumPhotos(),
                status: 'published',
                tags: faker.helpers.arrayElements(
                    ['innovation', 'santé', 'agriculture', 'économie', 'formation', 'startups'],
                    faker.number.int({ min: 1, max: 4 })
                ),
                featuredImage: faker.image.urlPicsumPhotos(),
                relatedBlogs: [],
                userId: randomUser._id,
            });
        }

        // Génération des relatedBlogs (tempId pour l'instant)
        for (const blog of fakeBlogs) {
            const otherBlogs = fakeBlogs.filter(b => b._tempId !== blog._tempId);
            const related = faker.helpers.arrayElements(otherBlogs, faker.number.int({ min: 2, max: 5 }));
            blog.relatedBlogs = related.map(b => b._tempId);
        }

        const tempIdToMongoIdMap = new Map();
        const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        progressBar.start(fakeBlogs.length, 0);

        for (const [index, blog] of fakeBlogs.entries()) {
            try {
                const { _tempId, relatedBlogs, ...blogData } = blog;
                blogData.relatedBlogs = []; // vide temporairement

                const res = await api.post(BLOGS_ENDPOINT, blogData);
                const mongoId = res.data._id;

                tempIdToMongoIdMap.set(_tempId, mongoId);
                blog._realId = mongoId;

                console.log(`✅ [${index + 1}] Blog "${blog.title}" créé avec ID: ${mongoId}`);
            } catch (error) {
                console.error(`\n❌ Erreur lors de la création du blog "${blog.title}" (index ${index}):`);
                handleError(error);
            }

            progressBar.increment();
        }

        progressBar.stop();
        console.log('\n🔁 Blogs créés. Envoi final avec relatedBlogs...');

        const finalBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        finalBar.start(fakeBlogs.length, 0);

        for (const [index, blog] of fakeBlogs.entries()) {
            const { title, topic, body, imageUrl, status, tags, featuredImage, userId } = blog;
            const resolvedRelated = blog.relatedBlogs.map(tempId => tempIdToMongoIdMap.get(tempId)).filter(Boolean);

            try {
                await api.post(BLOGS_ENDPOINT, {
                    title,
                    topic,
                    body,
                    imageUrl,
                    status,
                    tags,
                    featuredImage,
                    userId,
                    relatedBlogs: resolvedRelated
                });

                console.log(`✅ [${index + 1}] Blog "${title}" avec relatedBlogs envoyé.`);
            } catch (error) {
                console.error(`\n❌ Échec pour le blog "${title}" (index ${index}):`);
                handleError(error);
            }

            finalBar.increment();
        }

        finalBar.stop();
        console.log('\n🎉 Tous les blogs ont été créés avec leurs relatedBlogs.');

    } catch (err) {
        console.error('\n❌ Erreur globale lors de la génération des blogs :');
        handleError(err);
    }
};

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
};

generateTestBlogs();
