import express from "express";
import cors from "cors";
import fs from "fs";
import { findBestMatch } from "string-similarity";

const app = express();
app.use(cors());
app.use(express.json());

// Load Bodo dataset
const datasetRaw = fs.readFileSync("./data/bodo.json", "utf-8");
const dataset = JSON.parse(datasetRaw);

// Function to search dataset with fuzzy matching
function findResponse(userInput) {
  const userText = userInput.toLowerCase().trim();

  // Flatten all phrases from dataset
  let allPhrases = [];

  // Add greetings
  dataset.greetings.forEach((item) => {
    item.keywords.forEach((keyword) => {
      allPhrases.push({
        keyword: keyword.toLowerCase(),
        bodo: item.bodo,
        english: item.english,
        romanized: item.romanized,
        type: "greeting"
      });
    });
  });

  // Add questions
  dataset.questions.forEach((item) => {
    item.keywords.forEach((keyword) => {
      allPhrases.push({
        keyword: keyword.toLowerCase(),
        bodo: item.bodo,
        english: item.english,
        romanized: item.romanized,
        response: item.response,
        type: "question"
      });
    });
  });

  // Add responses
  dataset.responses.forEach((item) => {
    item.keywords.forEach((keyword) => {
      allPhrases.push({
        keyword: keyword.toLowerCase(),
        bodo: item.bodo,
        english: item.english,
        romanized: item.romanized,
        type: "response"
      });
    });
  });

  // Add numbers
  dataset.numbers.forEach((item) => {
    item.keywords.forEach((keyword) => {
      allPhrases.push({
        keyword: keyword.toLowerCase(),
        bodo: item.bodo,
        english: item.english,
        romanized: item.romanized,
        type: "number"
      });
    });
  });

  // Add culture
  dataset.culture.forEach((item) => {
    item.keywords.forEach((keyword) => {
      allPhrases.push({
        keyword: keyword.toLowerCase(),
        bodo: item.bodo,
        english: item.english,
        romanized: item.romanized,
        type: "culture"
      });
    });
  });

  // Find best match using fuzzy matching
  const keywords = allPhrases.map((p) => p.keyword);
  const matches = findBestMatch(userText, keywords);
  const bestMatch = matches.bestMatch;

  // Determine the index of the best match reliably
  let bestIndex = -1;
  if (matches.ratings && Array.isArray(matches.ratings)) {
    bestIndex = matches.ratings.findIndex(r => r.target === bestMatch.target);
  }
  if (bestIndex === -1) {
    bestIndex = keywords.indexOf(bestMatch.target);
  }

  // If match score is good (above 0.3) and index valid, return the response
  if (bestMatch.rating > 0.3 && bestIndex >= 0) {
    const foundPhrase = allPhrases[bestIndex];
    return {
      success: true,
      bodo: foundPhrase.bodo,
      english: foundPhrase.english,
      romanized: foundPhrase.romanized,
      matchScore: (bestMatch.rating * 100).toFixed(1)
    };
  }

  // No good match found
  return {
    success: false,
    bodo: "माफ कीजिए, मुझे समझ नहीं आया।",
    english: "Sorry, I didn't understand that.",
    romanized: "Sorry, I didn't understand that.",
    suggestion: "Try asking about: hello, how are you, thank you, numbers, or Bodo culture"
  };
}

// API endpoint
app.post("/api/chat", (req, res) => {
  console.log("Message received:", req.body);

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const result = findResponse(message);
  res.json(result);
});

// Test endpoint (optional)
app.get("/api/test", (req, res) => {
  res.json({
    message: "Bathou AI backend is running!",
    status: "✅ Server OK",
    dataset: {
      greetings: dataset.greetings.length,
      questions: dataset.questions.length,
      responses: dataset.responses.length,
      numbers: dataset.numbers.length,
      culture: dataset.culture.length
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Bathou AI backend running on http://localhost:${PORT}`);
  console.log(`📂 Dataset loaded: ${dataset.greetings.length + dataset.questions.length + dataset.responses.length + dataset.numbers.length + dataset.culture.length} phrases`);
});