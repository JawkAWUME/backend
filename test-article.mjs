import axios from 'axios';
import { faker } from '@faker-js/faker';
import fs from 'fs';

const API_BASE_URL = 'http://localhost:4001/content';
const USERS_API = 'http://localhost:4001/users';

const articles = [];

const generateTestArticles = async () => {
    try {
        const usersResponse = await axios.get(USERS_API,{
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFmaSBBYnJhIEtwYWtwbyIsInN1YiI6IjY3ZTNlYTEzNjZhYThlNDQ5MTNmYjZiZCIsImlhdCI6MTc0NDI4MzgwNywiZXhwIjoxNzQ0MzE2MjA3fQ.BfcnLT68Ev4IwwUzcQlkAOGbdDziLKJSZtanQmak_sE",
            }
        });
        const users = usersResponse.data;

        if (!Array.isArray(users) || users.length === 0) {
            throw new Error('Liste des utilisateurs vide ou invalide.');
        }

        for (let i = 0; i < 30; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];

            const article = {
                title: faker.lorem.sentence(),
                topic: faker.lorem.word(),
                body: faker.lorem.paragraphs(5),
                imageUrl: faker.image.url(),
                status: faker.helpers.arrayElement(['draft', 'published', 'archived']),
                author: randomUser._id,
                createdAt: new Date(),
                userId: randomUser._id,
                likes: [],
                views: [],
            };

            articles.push(article);
        }

        console.log(`✅ 30 articles générés avec succès.`);
        console.log(articles);
        await postArticles(articles);

    } catch (error) {
        console.error('\n❌ Erreur lors de la génération des articles :');
        handleError(error);
    }
};

const postArticles = async (articles) => {
    for (const [index, article] of articles.entries()) {
        try {
            const response = await axios.post(`${API_BASE_URL}/create/article`, article, {
                headers: {
                    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFmaSBBYnJhIEtwYWtwbyIsInN1YiI6IjY3ZTNlYTEzNjZhYThlNDQ5MTNmYjZiZCIsImlhdCI6MTc0NDI3NjM5NCwiZXhwIjoxNzQ0Mjc5OTk0fQ.ZkO0zsbY-8Ma0yRJbzjYqW8P3v2fyYOl0TPSH5AafDU', // pense à sécuriser ce token
                }
            });

            console.log(`✅ [${index + 1}] Article "${article.title}" créé avec succès.`);

        } catch (error) {
            console.error(`\n❌ Erreur lors de la création de l'article "${article.title}" (index ${index}):`);
            handleError(error);
        }
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

generateTestArticles();
