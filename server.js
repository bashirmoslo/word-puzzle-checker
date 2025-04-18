// Use ES Module imports
import express from 'express';
import nspell from 'nspell';
import dictionaryEn from 'dictionary-en';
import cors from 'cors';

const app = express();
const port = 3001;

// Initialize the spell checker with the English dictionary
(async () => {
  try {
    // Load the English dictionary
    const dictionary = dictionaryEn;
    
    // Create the spell checker with the loaded dictionary
    const spell = nspell(dictionary);
    
    // Enable CORS with a more permissive configuration
    app.use(cors());
    
    // Add CORS headers directly to all responses as a backup
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      
      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        return res.status(200).end();
      }
      
      next();
    });
    
    // Parse JSON request bodies
    app.use(express.json());
    
    // Original home route
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });
    
    // New route to check if a word is valid
    app.get('/check/:word', (req, res) => {
      const word = req.params.word;
      console.log('word', word);
      // Make sure we have a word to check
      if (!word || typeof word !== 'string') {
        return res.status(400).json({ error: 'Please provide a valid word' });
      }
      
      // Check if the word is correct according to the dictionary
      const isValid = spell.correct(word);
      
      // Log the request and response for debugging
      console.log(`Checking word: ${word}, isValid: ${isValid}`);
      
      // Return the result as JSON
      res.json({
        word: word,
        isValid: isValid
      });
    });
    
    // Start the server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Error in server setup:', err);
    process.exit(1);
  }
})().catch(err => {
  console.error('Failed to initialize spell checker:', err);
  process.exit(1);
});