import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/recipe', (req, res) => res.sendFile(path.join(__dirname, 'public/recipe.html')));
app.get('/submitRecipe', (req, res) => res.sendFile(path.join(__dirname, 'public/submitRecipe.html')));

// Mock API route for recipes
app.use('/api/recipes', (req, res) => {
    import('./pages/api/recipes.js').then(module => module.default(req, res));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
