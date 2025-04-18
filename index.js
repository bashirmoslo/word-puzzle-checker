// Use ES Module imports
import express from 'express';
import nspell from 'nspell';
import dictionaryEn from 'dictionary-en';

const app = express();
const port = 3000;

// Initialize the spell checker with the English dictionary
// We need to wrap this in an async function since dictionary loading is asynchronous
(async () => {
  try {
    // Load the English dictionary - the import is the dictionary itself, not a function
    const dictionary = dictionaryEn;
    
    // Create the spell checker with the loaded dictionary
    const spell = nspell(dictionary);
    
    // Parse JSON request bodies
    app.use(express.json());
    
    // Original home route
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });
    
    // New route to check if a word is valid
    // This accepts a word parameter in the URL
    app.get('/check/:word', (req, res) => {
      const word = req.params.word;
      
      // Make sure we have a word to check
      if (!word || typeof word !== 'string') {
        return res.status(400).json({ error: 'Please provide a valid word' });
      }
      
      // Check if the word is correct according to the dictionary
      const isValid = spell.correct(word);
      
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