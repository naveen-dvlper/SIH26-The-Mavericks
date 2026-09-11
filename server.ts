import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- MongoDB Setup ---
async function connectDB() {
  let MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI || MONGODB_URI.includes("127.0.0.1")) {
    console.log("No remote MONGODB_URI found. Starting In-Memory MongoDB for preview...");
    const mongoServer = await MongoMemoryServer.create();
    MONGODB_URI = mongoServer.getUri();
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
}
connectDB();

// Schemas based on the SETU Flow
const complaintSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  photoUrl: String,
  location: String,
  description: String,
  status: { type: String, default: "submitted" },
  submittedAt: { type: Date, default: Date.now },
  aiAnalysis: Object,
  clusterId: String
});
const Complaint = mongoose.model("Complaint", complaintSchema);

const departmentSchema = new mongoose.Schema({
  name: String,
  institution: String,
  domainTags: [String],
  workload: { type: Number, default: 0 }
});
const Department = mongoose.model("Department", departmentSchema);

// --- AI Initialization ---
let ai = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log("✅ Gemini AI initialized");
} else {
  console.warn("⚠️ GEMINI_API_KEY is not set in .env");
}

// --- API Routes ---

// 1. Submit a complaint (Surface Stage)
app.post("/api/complaints", async (req, res) => {
  try {
    const { location, description, photoUrl } = req.body;
    
    // Generate a unique trackable Complaint ID
    const complaintId = `JH-${new Date().getFullYear().toString().slice(-2)}-${Math.random().toString(16).slice(2, 7).toUpperCase()}`;
    
    let status = "submitted";
    let aiAnalysis = null;

    if (ai) {
      // Stage 1: AI Validity Check
      const prompt = `
        Review this civic issue report. 
        Description: "${description}"
        Location: "${location}"
        
        Task:
        1. Determine if this is a valid civic issue with enough detail.
        2. Categorize it (e.g. Infrastructure, Sanitation, Traffic, Water, Electricity).
        3. Determine if it sounds like a routine municipal issue or a complex pattern requiring research.
        
        Return JSON exactly matching this format: 
        { 
          "isValid": boolean, 
          "confidence": number, 
          "category": "string",
          "isComplexPattern": boolean,
          "reasoning": "string" 
        }
      `;
      
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });
        
        const responseText = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
        aiAnalysis = JSON.parse(responseText);
        
        if (aiAnalysis.isValid && aiAnalysis.confidence > 0.7) {
          status = "ai_reviewed";
          if (aiAnalysis.isComplexPattern) {
            status = "pending_govt_approval"; // Routed for research
          }
        }
      } catch (aiError) {
        console.error("AI Analysis failed:", aiError);
        aiAnalysis = { error: aiError.message };
      }
    }

    const complaint = new Complaint({
      id: complaintId,
      location,
      description,
      photoUrl,
      status,
      aiAnalysis
    });

    await complaint.save();

    res.json({ 
      success: true, 
      complaintId, 
      status, 
      category: aiAnalysis?.category || "Uncategorized",
      debugAi: aiAnalysis
    });

  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ error: "Failed to submit complaint" });
  }
});

// 2. Track a complaint
app.get("/api/complaints/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ id: req.params.id });
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// 3. Get all complaints for Explore page
app.get("/api/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ submittedAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// --- Vite Middleware for Development / Static for Production ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
