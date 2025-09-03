import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import pg from "pg";



const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_CONNECTION_STRING,
}); 

//This GET route

app.get("/focus_responsive", async function(req, res){
  const focus = await db.query('SELECT * FROM focus_responsive')
});

console.log(focus.rows);

const PORT = process.env.PORT || 8833;

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

app.get("/", function (req, res) {
  res.json("Endpoint to the Google GenAI API!");
});

app.post("/chat", async function (req, res) {
  const prompt = req.body.prompt;

  if (!prompt) {
    res.json("No prompt given.");
  } else {
    const geminiResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a very helpful assistant",
      },
    });

    res.json(geminiResponse.text);

    console.log("Geminis response is", geminiResponse.text);
  }
});

app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}.`);
});
