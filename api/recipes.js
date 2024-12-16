import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

const client = new MongoClient(process.env.MONGO_URI);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Connect to the database
            await client.connect();
            const database = client.db('recipes_database');
            const collection = database.collection('recipes');
            const { id, name, category } = req.query;

            if (id) {
                // Fetch a single recipe by its ID
                console.log('Received id:', id);
                try {
                    const recipe = await collection.findOne({ _id: new ObjectId(id) });
                    if (recipe) {
                        res.status(200).json(recipe);
                        console.log('The fetched recipe:', recipe);
                    } else {
                        res.status(404).json({ error: 'Recipe not found' });
                    }
                } catch (conversionError) {
                    console.error('Invalid ObjectId:', conversionError);
                    res.status(400).json({ error: 'Invalid Recipe ID' });
                }
            } else {
                // Build the query
                const query = {};
                
                if (name) {
                    query.name = { $regex: new RegExp(name, 'i') };
                }

                if (category) {
                    query.category = { $regex: new RegExp(category, 'i') };
                }

                // Fetch filtered or all recipes
                console.log('Query:', query);
                const recipes = await collection.find(query).toArray();
                
                if (recipes.length === 0) {
                    res.status(404).json({ error: 'No recipes found matching the criteria' });
                    return;
                } else {
                    res.status(200).json(recipes);
                    return;
                }
            }
        } catch (err) {
            console.error('Error fetching recipes:', err);
            res.status(500).json({ error: 'Failed to fetch recipes' });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed!' });
    }
}