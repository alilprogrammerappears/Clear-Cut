import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {

            await client.connect();
            const database = client.db('recipes_database');
            const collection = database.collection('recipes');
            const recipes = await collection.find({}).toArray();
            res.status(200).json(recipes);
        }
        catch(err) {
            res.status(500).json({error: 'Failed to fetch recipes' });
        }
        finally {
            await client.close();
        }
    }
    else {
        res.status(405).json({ error: 'Method Not Allowed!' });
    }
}