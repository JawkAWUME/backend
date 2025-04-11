import axios from 'axios';
import { faker } from '@faker-js/faker';
import cliProgress from 'cli-progress';

const API_BASE_URL = 'http://localhost:4001';
const POSTS_ENDPOINT = '/content/create/post'; // Change this endpoint to match the actual one for creating posts
const USERS_ENDPOINT = '/users';
const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFmaSBBYnJhIEtwYWtwbyIsInN1YiI6IjY3ZTNlYTEzNjZhYThlNDQ5MTNmYjZiZCIsImlhdCI6MTc0NDI4MzgwNywiZXhwIjoxNzQ0MzE2MjA3fQ.BfcnLT68Ev4IwwUzcQlkAOGbdDziLKJSZtanQmak_sE";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Authorization: TOKEN,
        'Content-Type': 'application/json',
    },
});

const generateTestPosts = async () => {
    try {
        const usersResponse = await api.get(USERS_ENDPOINT);
        const users = usersResponse.data;

        if (!Array.isArray(users) || users.length === 0) {
            throw new Error('Liste des utilisateurs vide ou invalide.');
        }

        const posts = [];

        // Generate 100 posts
        for (let i = 0; i < 100; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];

            posts.push({
                title: faker.lorem.sentence(),
                body: faker.lorem.paragraphs(3),
                imageUrl: faker.image.urlPicsumPhotos(),
                status: faker.helpers.arrayElement(['draft', 'published', 'archived']),
                author: randomUser._id,
                userId: randomUser._id,
                createdAt: faker.date.past(),
                likes: faker.helpers.arrayElements(users.map((user) => user._id), faker.number.int({ min: 1, max: 5 })),
                views: faker.helpers.arrayElements(users.map((user) => user._id), faker.number.int({ min: 1, max: 10 })),
                shares: faker.helpers.arrayElements(users.map((user) => user._id), faker.number.int({ min: 1, max: 5 })),
                comments: [], // Leave comments empty for now (could populate with fake comment IDs later)
                hashtags: faker.helpers.arrayElements(faker.lorem.words(5), faker.number.int({ min: 1, max: 5 })),
                location: faker.location.city(), // Use the updated method to generate city names
            });
        }

        const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        progressBar.start(posts.length, 0);

        for (const [index, post] of posts.entries()) {
            try {
                const res = await api.post(POSTS_ENDPOINT, post);
                console.log(`[${index + 1}] Post "${post.title}" created`);
            } catch (error) {
                console.error(`\n Error creating post "${post.title}" (index ${index})`);
                handleError(error);
            }

            progressBar.increment();
        }

        progressBar.stop();
        console.log('\n Posts created.');

    } catch (error) {
        console.error(`\n Global error while generating posts:`);
        handleError(error);
    }
};

const handleError = (error) => {
    if (error.response) {
        console.error('🛑 Server response error:');
        console.error('Status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
        console.error('📡 No response received from server.');
        console.error(error.request);
    } else {
        console.error('💥 Unexpected error:', error.message);
    }

    console.error('🔍 Stack trace:');
    console.error(error.stack);
};

generateTestPosts();
