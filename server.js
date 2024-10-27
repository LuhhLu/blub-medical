import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import OpenAI from 'openai';
import cors from 'cors';

const app = express();

// Use process.env for environment variables on the server side
const openai = new OpenAI({
    apiKey: process.env.VITE_OPENAI_API_KEY, // Access environment variables via process.env
    organization: process.env.VITE_OPENAI_ORGANIZATION_ID,
    project: process.env.VITE_OPENAI_PROJECT_ID,
});

app.use(bodyParser.json());
app.use(cors());

app.post('/text', async (req, res) => {
    const message = req.body.message;
    console.log('Received text message:', message);

    const prompt = `You are an AI Cancer Help Provider with limited abilities. Please encourage the user to use voice mode for a better experience. Keep your responses concise !!!, and it's okay not to answer every question if it exceeds your abilities.`;

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: prompt },
                { role: 'user', content: message }
            ],
            model: 'gpt-3.5-turbo',
        });

        console.log('OpenAI API response:', completion.choices[0].message.content);
        res.json({ reply: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({ error: 'Error processing request' });
    }
});

const PORT = process.env.VITE_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
