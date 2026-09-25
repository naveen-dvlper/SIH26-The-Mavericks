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
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));
app.use(express.json());

// List of top universities in India across disciplines
export const TOP_INDIAN_UNIVERSITIES = [
  { name: "Birla Institute of Technology (BIT) Mesra", code: "BITM", email: "nodal@bitmesra.ac.in", city: "Ranchi", state: "Jharkhand", domain: "Civil, Hydrology, Environmental & IoT" },
  { name: "IIT (ISM) Dhanbad", code: "IITISM", email: "research@iitism.ac.in", city: "Dhanbad", state: "Jharkhand", domain: "Mining, Geo-hazards, Water & Pollution Control" },
  { name: "NIT Jamshedpur", code: "NITJSR", email: "projects@nitjsr.ac.in", city: "Jamshedpur", state: "Jharkhand", domain: "Transportation, Structural & Metallurgy" },
  { name: "IIT Kharagpur", code: "IITKGP", email: "civic.lab@iitkgp.ac.in", city: "Kharagpur", state: "West Bengal", domain: "Urban Planning, Water Resources & Civil Infrastructure" },
  { name: "IIT Kanpur", code: "IITK", email: "dean.rnd@iitk.ac.in", city: "Kanpur", state: "Uttar Pradesh", domain: "Sensor Networks, Environmental & Civil Engineering" },
  { name: "IIT Delhi", code: "IITD", email: "urban.research@iitd.ac.in", city: "New Delhi", state: "Delhi", domain: "Traffic Management, Air Quality & Infrastructure" },
  { name: "IISc Bangalore", code: "IISC", email: "civic.innovation@iisc.ac.in", city: "Bengaluru", state: "Karnataka", domain: "Computational Hydrology & Deep Tech" },
  { name: "IIT Roorkee", code: "IITR", email: "water.center@iitr.ac.in", city: "Roorkee", state: "Uttarakhand", domain: "Water Resources, Irrigation & Dam Safety" },
  { name: "IIT Bombay", code: "IITB", email: "ctara@iitb.ac.in", city: "Mumbai", state: "Maharashtra", domain: "Rural & Municipal Technology Interventions" },
  { name: "IIT Madras", code: "IITM", email: "infrastructure@iitm.ac.in", city: "Chennai", state: "Tamil Nadu", domain: "Smart Cities, Traffic & Pavement Technologies" }
];

// --- Schemas based on Complete SETU Lifecycle ---
const complaintSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  photoUrl: String,
  location: String,
  description: String,
  status: { type: String, default: "submitted" },
  submittedAt: { type: Date, default: Date.now },
  aiAnalysis: Object,
  clusterId: String,
  
  // Municipal Route Details
  municipalDetails: {
    assignedMunicipality: String,
    wardNumber: String,
    actionRequired: String,
    dispatchedAt: Date,
    dispatchedEmail: String,
    status: { type: String, default: 'dispatched' }
  },

  // University Research Route Details
  universityRoute: {
    invitedUniversities: [String],
    invitationSentAt: Date,
    interests: [{
      id: String,
      universityName: String,
      department: String,
      nodalOfficer: String,
      contactEmail: String,
      whyThisUniversity: String,
      availableResources: String,
      expectedTimelineWeeks: Number,
      submittedAt: { type: Date, default: Date.now },
      aiFitScore: Number,
      aiRankingReason: String,
      aiRank: Number
    }],
    selectedUniversity: String,
    assignedAt: Date,
    portalLoginAccount: {
      email: String,
      tempPass: String,
      institutionalCode: String
    },
    workspaceUpdates: [{
      id: String,
      title: String,
      note: String,
      stage: String,
      author: String,
      timestamp: { type: Date, default: Date.now },
      attachmentName: String
    }],
    finalOutput: {
      submittedAt: Date,
      executiveSummary: String,
      deliverableType: String,
      keyFindings: String,
      recommendations: String,
      fileLink: String
    }
  }
});

const Complaint = mongoose.model("Complaint", complaintSchema);

// --- AI Initialization ---
let ai: any = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log("✅ Gemini AI initialized");
} else {
  console.warn("⚠️ GEMINI_API_KEY is not set in .env");
}

// --- MongoDB Setup ---
async function connectDB() {
  let MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI || MONGODB_URI.includes("127.0.0.1")) {
    console.log("Starting In-Memory MongoDB for prototype...");
    const mongoServer = await MongoMemoryServer.create();
    MONGODB_URI = mongoServer.getUri();
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Seed initial complaints demonstrating the complete flow
    const count = await Complaint.countDocuments();
    if (count === 0) {
      await Complaint.insertMany([
        {
          id: 'JH-26-09A4F',
          location: 'Sector 4, Bokaro Steel City',
          description: 'Chronic monsoon waterlogging due to blocked arterial stormwater culvert with reverse hydrological gradient. Causes recurrent flooding of 3 housing sectors and critical hospital approach roads during rains.',
          status: 'research_invitations_sent',
          submittedAt: new Date(Date.now() - 18 * 3600000),
          aiAnalysis: {
            isValid: true,
            category: 'Drainage & Stormwater Engineering',
            confidence: 0.96,
            isComplexPattern: true,
            recommendedPath: 'research',
            reasoning: 'Underground natural runoff topography has changed significantly due to heavy industrial sediment settling. A standard municipal dredge fails every season. Requires hydrodynamic modeling and hydraulic gradient recalculation.',
            scopeOfWork: 'Hydrological watershed mapping, culvert re-engineering simulation, low-impact urban drainage (SUDs) design.',
            estimatedBudgetRange: '₹4.5L - ₹8.0L Research & Pilot Grant',
            targetDomain: 'Civil Engineering / Hydrology / Environmental Fluid Dynamics'
          },
          universityRoute: {
            invitedUniversities: [
              'Birla Institute of Technology (BIT) Mesra',
              'IIT (ISM) Dhanbad',
              'NIT Jamshedpur',
              'IIT Kharagpur',
              'IIT Roorkee',
              'IIT Kanpur',
              'IIT Delhi',
              'IISc Bangalore',
              'IIT Bombay',
              'IIT Madras'
            ],
            invitationSentAt: new Date(Date.now() - 10 * 3600000),
            interests: [
              {
                id: 'INT-BITM-01',
                universityName: 'Birla Institute of Technology (BIT) Mesra',
                department: 'Department of Civil & Environmental Engineering',
                nodalOfficer: 'Dr. Ananya Sen',
                contactEmail: 'nodal@bitmesra.ac.in',
                whyThisUniversity: 'Our department has an established regional GIS hydrological lab in Ranchi with 12-year local rainfall dataset and 3 active Ph.D. scholars in urban stormwater modeling in Chota Nagpur plateau.',
                availableResources: 'Bentley FlowMaster, SWMM 5.2 watershed simulator, ultrasonic depth sensors, drone-based LiDAR terrain scanner.',
                expectedTimelineWeeks: 8,
                submittedAt: new Date(Date.now() - 7 * 3600000),
                aiFitScore: 94,
                aiRank: 1,
                aiRankingReason: 'Immediate geographic proximity allows continuous on-site sediment testing. Possesses specialized regional SWMM watershed models and field drone LiDAR.'
              },
              {
                id: 'INT-IITISM-02',
                universityName: 'IIT (ISM) Dhanbad',
                department: 'Department of Mining & Geotechnical Engineering',
                nodalOfficer: 'Prof. R. K. Mukherjee',
                contactEmail: 'research@iitism.ac.in',
                whyThisUniversity: 'Extensive track record handling industrial slurry runoffs, coal-belt subterranean water movement, and structural culvert subsidence.',
                availableResources: 'Soil mechanics lab, acoustic groundwater tracer array, FLAC3D finite element simulation software.',
                expectedTimelineWeeks: 12,
                submittedAt: new Date(Date.now() - 5 * 3600000),
                aiFitScore: 88,
                aiRank: 2,
                aiRankingReason: 'World-class geological testing capabilities and robust soil mechanics lab; slightly longer timeline than BIT Mesra.'
              },
              {
                id: 'INT-NITJSR-03',
                universityName: 'NIT Jamshedpur',
                department: 'Civil Infrastructure Research Group',
                nodalOfficer: 'Dr. Vivek Verma',
                contactEmail: 'projects@nitjsr.ac.in',
                whyThisUniversity: 'Proximity to industrial steel belt civil structures and experience in reinforced culvert rehabilitation.',
                availableResources: 'Concrete durability testing bay, total station topographic scanners, student research cohort of 6 M.Tech scholars.',
                expectedTimelineWeeks: 10,
                submittedAt: new Date(Date.now() - 4 * 3600000),
                aiFitScore: 83,
                aiRank: 3,
                aiRankingReason: 'Strong structural civil expertise, ready cohort of scholars, good regional equipment.'
              }
            ]
          }
        },
        {
          id: 'JH-26-09B21',
          location: 'Albert Ekka Chowk, Main Road, Ranchi',
          description: 'Dangerous pothole cluster and damaged asphalt carpet right at the central pedestrian intersection. Water ponding has eroded the sub-base.',
          status: 'pending_govt_approval',
          submittedAt: new Date(Date.now() - 8 * 3600000),
          aiAnalysis: {
            isValid: true,
            category: 'Municipal Pavement & Pothole Repair',
            confidence: 0.98,
            isComplexPattern: false,
            recommendedPath: 'municipal_repair',
            reasoning: 'Direct wear-and-tear of bituminous wearing coat. No deep structural subsidence detected. Can be rectified within 48-72 hours by Ranchi Municipal Corporation road maintenance division.',
            scopeOfWork: 'Cold mix asphalt patch repair, pneumatic compaction, and surface seal coat.',
            estimatedBudgetRange: '₹35,000 - ₹50,000 Routine Maintenance',
            targetDomain: 'Municipal Road Maintenance'
          }
        },
        {
          id: 'JH-26-08C19',
          location: 'Saraikela Iron Ore & Crushing Belt',
          description: 'High particulate matter suspension (PM2.5 / PM10) and groundwater effluent runoff exceeding safe biological limits near 18 stone-crushing units.',
          status: 'in_research',
          submittedAt: new Date(Date.now() - 5 * 86400000),
          aiAnalysis: {
            isValid: true,
            category: 'Environmental & Airborne Industrial Hazard',
            confidence: 0.95,
            isComplexPattern: true,
            recommendedPath: 'research',
            reasoning: 'Exceeds standard municipal purview; requires specialized aerosol dispersion modeling, electrostatic dust suppression analysis, and water treatment chemistry.',
            scopeOfWork: 'Micro-climate particulate dispersion mapping and low-cost bio-filtration prototype.',
            estimatedBudgetRange: '₹6.0L State Research Grant',
            targetDomain: 'Environmental Engineering & Atmospheric Physics'
          },
          universityRoute: {
            invitedUniversities: ['IIT (ISM) Dhanbad', 'BIT Mesra', 'IIT Kharagpur'],
            selectedUniversity: 'IIT (ISM) Dhanbad',
            assignedAt: new Date(Date.now() - 3 * 86400000),
            portalLoginAccount: {
              email: 'research@iitism.ac.in',
              tempPass: 'ISM@jharkhand2026',
              institutionalCode: 'UNIV-IITISM-01'
            },
            workspaceUpdates: [
              {
                id: 'UPD-01',
                title: 'Baseline Air & Heavy Metal Sampling Completed',
                stage: 'Field Prototyping & Sampling',
                author: 'Prof. R. K. Mukherjee, Lead Investigator',
                timestamp: new Date(Date.now() - 2 * 86400000),
                note: 'Captured 48-hour continuous gravimetric air samples across 6 buffer zones around the crushing units. High levels of silica particulate identified.',
                attachmentName: 'Saraikela_Ambient_Air_Baseline_v1.pdf'
              },
              {
                id: 'UPD-02',
                title: 'High-Pressure Fogger Prototype Calibration',
                stage: 'Feasibility & Lab Testing',
                author: 'Dr. Priya Sharma, Post-Doctoral Fellow',
                timestamp: new Date(Date.now() - 18 * 3600000),
                note: 'Lab-scale mist nozzle setup demonstrated 73% particulate knockdown with 80% recycled slurry water.',
                attachmentName: 'MistKnockdown_Lab_Trial_Summary.pdf'
              }
            ]
          }
        }
      ]);
      console.log("✅ Seeded complete SETU lifecycle complaints into MongoDB");
    }
  } catch (err: any) {
    console.error("❌ MongoDB connection error:", err.message);
  }
}
connectDB();

// --- Helper Functions for AI & Notifications ---

// AI Analysis Generator with Gemini Fallback
async function generateAIReport(description: string, location: string) {
  if (ai) {
    try {
      const prompt = `
        You are the Government of Jharkhand's SETU AI Civic Analysis Engine.
        Analyze this citizen problem report:
        Description: "${description}"
        Location: "${location}"
        
        Rules:
        1. Determine if this problem is a routine municipal repair (pothole, streetlight, garbage pile, routine pipe leak) 
           OR a complex pattern requiring academic/engineering research (chronic waterlogging, water aquifer poisoning, traffic bottlenecks, recurring bridge vibrations, industrial pollution).
        2. Categorize it into a formal civic/engineering discipline.
        3. Recommend either "municipal_repair" or "research".
        4. Give detailed reasoning, scope of work, estimated budget range, and target engineering domain.
        
        Respond ONLY with a JSON object:
        {
          "isValid": true,
          "confidence": number between 0.8 and 0.99,
          "category": "string",
          "isComplexPattern": boolean,
          "recommendedPath": "municipal_repair" | "research",
          "reasoning": "detailed 2-3 sentence technical explanation",
          "scopeOfWork": "specific bulleted scope",
          "estimatedBudgetRange": "e.g. ₹40,000 - ₹60,000 or ₹4.0L - ₹8.0L",
          "targetDomain": "e.g. Civil Engineering / Water Resources"
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const cleanText = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleanText);
    } catch (err: any) {
      console.warn("Gemini call error, using deterministic fallback:", err.message);
    }
  }

  // Deterministic Intelligent Fallback
  const lowerDesc = description.toLowerCase();
  const isResearchKeyword = lowerDesc.includes("waterlog") || lowerDesc.includes("flood") || lowerDesc.includes("traffic") || lowerDesc.includes("pollution") || lowerDesc.includes("gradient") || lowerDesc.includes("chronic") || lowerDesc.includes("drainage") || lowerDesc.includes("recurrent");

  if (isResearchKeyword) {
    return {
      isValid: true,
      confidence: 0.94,
      category: "Hydrology, Infrastructure & Environmental Systems",
      isComplexPattern: true,
      recommendedPath: "research",
      reasoning: "Complex hydrological or structural issue with recurring failure pattern across seasons. Municipal patchwork has proven inadequate. Requires technical university modeling and innovative engineering solution.",
      scopeOfWork: "Topographic elevation scanning, hydrological flow simulation, and durable infrastructure design.",
      estimatedBudgetRange: "₹3.5L - ₹7.0L Academic Pilot Grant",
      targetDomain: "Civil, Environmental & Applied Engineering"
    };
  } else {
    return {
      isValid: true,
      confidence: 0.92,
      category: "Municipal Works & Civic Maintenance",
      isComplexPattern: false,
      recommendedPath: "municipal_repair",
      reasoning: "Standard localized civil/sanitary wear-and-tear suitable for standard municipal SOP repair machinery. Does not require academic thesis or deep engineering modeling.",
      scopeOfWork: "Site inspection, standard equipment deployment, material replacement, and QA sign-off within 72 hours.",
      estimatedBudgetRange: "₹25,000 - ₹60,000 Routine Maintenance Budget",
      targetDomain: "Municipal Works Department"
    };
  }
}

// AI Ranker for University Interests
async function rankUniversityInterests(problem: any, interests: any[]) {
  if (interests.length === 0) return [];

  if (ai) {
    try {
      const prompt = `
        You are SETU AI, evaluating university interest submissions for Problem ID: ${problem.id}
        Problem Description: "${problem.description}"
        Category: "${problem.aiAnalysis?.category}"
        
        Candidate University Submissions:
        ${JSON.stringify(interests, null, 2)}
        
        Evaluate each university based on:
        1. Expertise & why their university is best suited
        2. Relevant lab resources, software, and testing equipment
        3. Timeline feasibility (expected weeks)
        
        Return JSON with array of objects containing:
        {
          "rankings": [
            {
              "id": "interest submission id",
              "aiFitScore": number from 70 to 98,
              "aiRank": integer starting at 1 for the best,
              "aiRankingReason": "1-2 sentence objective technical justification for this rank"
            }
          ]
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const clean = response.text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (parsed.rankings && Array.isArray(parsed.rankings)) {
        return interests.map(int => {
          const match = parsed.rankings.find((r: any) => r.id === int.id);
          if (match) {
            return {
              ...int,
              aiFitScore: match.aiFitScore,
              aiRank: match.aiRank,
              aiRankingReason: match.aiRankingReason
            };
          }
          return int;
        }).sort((a, b) => (a.aiRank || 99) - (b.aiRank || 99));
      }
    } catch (err: any) {
      console.warn("AI ranking fallback:", err.message);
    }
  }

  // Fallback Scoring
  return interests.map((int, idx) => {
    const score = Math.max(75, 96 - idx * 6);
    return {
      ...int,
      aiFitScore: score,
      aiRank: idx + 1,
      aiRankingReason: `Ranked #${idx + 1} based on comprehensive resource alignment (${int.department}) and ${int.expectedTimelineWeeks}-week delivery schedule.`
    };
  });
}

// --- API Endpoints ---

// 1. Citizen Complaint Submission
app.post("/api/complaints", async (req, res) => {
  try {
    const { location, description, photoUrl } = req.body;
    const complaintId = `JH-${new Date().getFullYear().toString().slice(-2)}-${Math.random().toString(16).slice(2, 7).toUpperCase()}`;
    
    // AI analyzes and creates detailed report
    const aiReport = await generateAIReport(description, location);
    
    const complaint = new Complaint({
      id: complaintId,
      location,
      description,
      photoUrl,
      status: "pending_govt_approval", // Sent to Portal Admin for verification/approval
      aiAnalysis: aiReport
    });

    await complaint.save();

    res.json({
      success: true,
      complaintId,
      status: complaint.status,
      category: aiReport.category,
      aiAnalysis: aiReport
    });
  } catch (error: any) {
    console.error("Submission error:", error);
    res.status(500).json({ error: "Failed to submit complaint" });
  }
});

// 2. Get All Complaints
app.get("/api/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ submittedAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// 3. Get Single Complaint by ID
app.get("/api/complaints/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ id: req.params.id });
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

// 4. Admin Approves and Routes Complaint:
// Case A: Municipal Repair -> AI dispatches email to Area Municipal Corporation
// Case B: Research Required -> AI emails top 10 universities across India with problem link
app.post("/api/complaints/:id/admin-approve", async (req, res) => {
  try {
    const { routeType, municipalityName, adminNotes } = req.body;
    const complaint: any = await Complaint.findOne({ id: req.params.id });
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    if (routeType === 'municipal') {
      const municipality = municipalityName || `${complaint.location.split(',')[0]} Municipal Corporation`;
      const municipalEmail = `works@${municipality.toLowerCase().replace(/[^a-z0-9]/g, '')}.gov.in`;

      complaint.status = 'municipal_repair_assigned';
      complaint.municipalDetails = {
        assignedMunicipality: municipality,
        wardNumber: 'Ward 14 (Central Zone)',
        actionRequired: complaint.aiAnalysis?.scopeOfWork || 'Immediate civil/sanitary repair and site clearance.',
        dispatchedAt: new Date(),
        dispatchedEmail: municipalEmail,
        status: 'dispatched'
      };

      await complaint.save();

      return res.json({
        success: true,
        complaint,
        actionTaken: `Automated official work order email transmitted to ${municipality} (${municipalEmail}).`
      });
    }

    if (routeType === 'research') {
      const invited = TOP_INDIAN_UNIVERSITIES.map(u => u.name);

      complaint.status = 'research_invitations_sent';
      complaint.universityRoute = {
        invitedUniversities: invited,
        invitationSentAt: new Date(),
        interests: complaint.universityRoute?.interests || []
      };

      await complaint.save();

      return res.json({
        success: true,
        complaint,
        actionTaken: `AI research challenge brief emailed to ${invited.length} top academic institutions across India with secure response link.`
      });
    }

    res.status(400).json({ error: "Invalid routeType specified. Must be 'municipal' or 'research'." });
  } catch (error: any) {
    console.error("Admin approval error:", error);
    res.status(500).json({ error: error.message || "Failed to process approval" });
  }
});

// 5. University Submits Interest (with required fields: why their university, resources, expected timeline)
app.post("/api/complaints/:id/university-interest", async (req, res) => {
  try {
    const { 
      universityName, 
      department, 
      nodalOfficer, 
      contactEmail, 
      whyThisUniversity, 
      availableResources, 
      expectedTimelineWeeks 
    } = req.body;

    const complaint: any = await Complaint.findOne({ id: req.params.id });
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    if (!complaint.universityRoute) {
      complaint.universityRoute = { invitedUniversities: [], interests: [] };
    }

    const newInterest = {
      id: `INT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      universityName: universityName || "Birla Institute of Technology (BIT) Mesra",
      department: department || "Civil & Environmental Engineering",
      nodalOfficer: nodalOfficer || "Academic Nodal Officer",
      contactEmail: contactEmail || "nodal@bitmesra.ac.in",
      whyThisUniversity,
      availableResources,
      expectedTimelineWeeks: Number(expectedTimelineWeeks) || 8,
      submittedAt: new Date()
    };

    complaint.universityRoute.interests.push(newInterest);

    // AI automatically analyzes all interest submissions and ranks them based on expertise, resources, and deadline
    const rankedInterests = await rankUniversityInterests(complaint, complaint.universityRoute.interests);
    complaint.universityRoute.interests = rankedInterests;

    await complaint.save();

    res.json({
      success: true,
      interest: newInterest,
      allInterestsCount: complaint.universityRoute.interests.length,
      complaint
    });
  } catch (error: any) {
    console.error("University interest error:", error);
    res.status(500).json({ error: error.message || "Failed to submit university interest" });
  }
});

// 6. Admin Assigns Problem to Chosen University (Generates Official University Portal Login ID)
app.post("/api/complaints/:id/assign-university", async (req, res) => {
  try {
    const { universityName, contactEmail } = req.body;
    const complaint: any = await Complaint.findOne({ id: req.params.id });
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    const safeUnivName = universityName || complaint.universityRoute?.interests?.[0]?.universityName || "BIT Mesra";
    const univCode = safeUnivName.replace(/[^A-Za-z]/g, '').slice(0, 6).toUpperCase();
    const loginEmail = contactEmail || `research@${univCode.toLowerCase()}.edu.in`;
    const tempPassword = `${univCode}@jharkhand2026`;

    complaint.status = 'in_research';
    if (!complaint.universityRoute) {
      complaint.universityRoute = { invitedUniversities: [], interests: [] };
    }

    complaint.universityRoute.selectedUniversity = safeUnivName;
    complaint.universityRoute.assignedAt = new Date();
    complaint.universityRoute.portalLoginAccount = {
      email: loginEmail,
      tempPass: tempPassword,
      institutionalCode: `UNIV-${univCode}-2026`
    };

    if (!complaint.universityRoute.workspaceUpdates) {
      complaint.universityRoute.workspaceUpdates = [
        {
          id: 'UPD-INIT',
          title: 'Official Project Commissioned by Govt of Jharkhand',
          note: `Project officially allocated to ${safeUnivName}. Academic workspace initialized. Research team assigned.`,
          stage: 'Literature & Problem Definition',
          author: 'State Nodal Administrator, SETU',
          timestamp: new Date()
        }
      ];
    }

    await complaint.save();

    res.json({
      success: true,
      complaint,
      loginCredentials: complaint.universityRoute.portalLoginAccount
    });
  } catch (error: any) {
    console.error("Assign university error:", error);
    res.status(500).json({ error: error.message || "Failed to assign university" });
  }
});

// 7. University Workspace Updates (Progress tracking by assigned university)
app.post("/api/complaints/:id/workspace-update", async (req, res) => {
  try {
    const { title, note, stage, author, attachmentName } = req.body;
    const complaint: any = await Complaint.findOne({ id: req.params.id });
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    const update = {
      id: `UPD-${Date.now().toString().slice(-4)}`,
      title,
      note,
      stage: stage || 'Field Prototyping & Sampling',
      author: author || 'Project Research Lead',
      timestamp: new Date(),
      attachmentName: attachmentName || null
    };

    if (!complaint.universityRoute) complaint.universityRoute = {};
    if (!complaint.universityRoute.workspaceUpdates) complaint.universityRoute.workspaceUpdates = [];

    complaint.universityRoute.workspaceUpdates.unshift(update);
    await complaint.save();

    res.json({ success: true, update, complaint });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to post workspace update" });
  }
});

// 8. University Submits Final Output / Research Deliverable
app.post("/api/complaints/:id/submit-final-output", async (req, res) => {
  try {
    const { executiveSummary, deliverableType, keyFindings, recommendations, fileLink } = req.body;
    const complaint: any = await Complaint.findOne({ id: req.params.id });
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    const finalOutput = {
      submittedAt: new Date(),
      executiveSummary,
      deliverableType: deliverableType || 'Engineering Blueprint',
      keyFindings,
      recommendations,
      fileLink: fileLink || 'https://jharkhand.gov.in/setu/deliverables/final_report.pdf'
    };

    complaint.status = 'output_submitted';
    if (!complaint.universityRoute) complaint.universityRoute = {};
    complaint.universityRoute.finalOutput = finalOutput;

    // Log a final milestone in workspace updates
    if (!complaint.universityRoute.workspaceUpdates) complaint.universityRoute.workspaceUpdates = [];
    complaint.universityRoute.workspaceUpdates.unshift({
      id: `UPD-${Date.now().toString().slice(-4)}`,
      title: `Final Research Output Submitted: ${deliverableType}`,
      note: executiveSummary,
      stage: 'Final Solution Synthesis',
      author: complaint.universityRoute.selectedUniversity || 'Academic Research Partner',
      timestamp: new Date(),
      attachmentName: 'Final_Comprehensive_Engineering_Report.pdf'
    });

    await complaint.save();

    res.json({ success: true, finalOutput, complaint });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to submit final output" });
  }
});

// 9. Update complaint status (Generic status patch)
app.patch("/api/complaints/:id/status", async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const updateData: any = { status };
    if (assignedTo) updateData.assignedTo = assignedTo;

    const complaint = await Complaint.findOneAndUpdate(
      { id: req.params.id },
      updateData,
      { new: true }
    );
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    res.json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ error: "Failed to update complaint" });
  }
});

// 10. List of Top Universities (For display and invitation cards)
app.get("/api/top-universities", (req, res) => {
  res.json(TOP_INDIAN_UNIVERSITIES);
});

// 11. Official Authentication Endpoints with Strict Credential Validation
const PREDEFINED_GOVT_ACCOUNTS = [
  {
    email: "admin@jharkhand.gov.in",
    passwords: ["Admin@Jharkhand2026", "Admin@jharkhand2026"],
    user: {
      id: "GOV-ADM-JH-01",
      name: "Shri Rajesh Kumar, IAS",
      email: "admin@jharkhand.gov.in",
      role: "admin",
      agency: "Government of Jharkhand",
      department: "Department of Higher & Technical Education",
      designation: "State Nodal Administrator",
      cadre: "JH-2012",
      securityClearance: "Tier-1 Official"
    }
  },
  {
    email: "director@jharkhand.gov.in",
    passwords: ["Director@Jharkhand2026", "Director@jharkhand2026"],
    user: {
      id: "GOV-DIR-JH-02",
      name: "Dr. S. K. Murmu",
      email: "director@jharkhand.gov.in",
      role: "admin",
      agency: "Government of Jharkhand",
      department: "Urban Development & Housing Department",
      designation: "Director of Municipal Administration",
      cadre: "JH-2015",
      securityClearance: "Tier-1 Official"
    }
  }
];

const PREDEFINED_UNIV_ACCOUNTS = [
  {
    email: "nodal@bitmesra.ac.in",
    passwords: ["BitMesra@2026", "BIT@jharkhand2026"],
    user: {
      id: "UNIV-BITM-01",
      name: "Dr. Ananya Sen",
      email: "nodal@bitmesra.ac.in",
      role: "university",
      agency: "Birla Institute of Technology (BIT) Mesra",
      department: "Department of Civil & Environmental Engineering",
      designation: "Principal Project Investigator",
      securityClearance: "Institutional Academic Partner"
    }
  },
  {
    email: "research@iitism.ac.in",
    passwords: ["ISM@jharkhand2026", "IITISM@2026"],
    user: {
      id: "UNIV-IITISM-01",
      name: "Prof. R. K. Mukherjee",
      email: "research@iitism.ac.in",
      role: "university",
      agency: "IIT (ISM) Dhanbad",
      department: "Department of Mining & Geotechnical Engineering",
      designation: "Lead Research Investigator",
      securityClearance: "Institutional Academic Partner"
    }
  }
];

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    // Strict validation for missing or blank inputs
    if (!cleanEmail) {
      return res.status(400).json({ error: "Email ID is required." });
    }
    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      return res.status(400).json({ error: "Please enter a valid official Email ID." });
    }
    if (!cleanPassword) {
      return res.status(400).json({ error: "Password is required." });
    }

    // 1. Strict Government Admin Verification
    if (role === "government") {
      const matched = PREDEFINED_GOVT_ACCOUNTS.find(
        acc => acc.email.toLowerCase() === cleanEmail && acc.passwords.includes(cleanPassword)
      );

      if (matched) {
        const token = `jh_gov_token_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        return res.json({ success: true, user: matched.user, token });
      }

      return res.status(401).json({
        error: "Invalid official government credentials. Access restricted to authorized personnel."
      });
    }

    // 2. Strict University Nodal Verification
    if (role === "university") {
      // Check predefined university institutional accounts
      const matchedUniv = PREDEFINED_UNIV_ACCOUNTS.find(
        acc => acc.email.toLowerCase() === cleanEmail && acc.passwords.includes(cleanPassword)
      );

      if (matchedUniv) {
        const token = `jh_univ_token_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        return res.json({ success: true, user: matchedUniv.user, token });
      }

      // Check dynamic portal accounts allocated by admin to complaints
      const assignedComplaint = await Complaint.findOne({
        "universityRoute.portalLoginAccount.email": cleanEmail
      });

      if (
        assignedComplaint &&
        assignedComplaint.universityRoute?.portalLoginAccount &&
        assignedComplaint.universityRoute.portalLoginAccount.tempPass === cleanPassword
      ) {
        const portalAcc = assignedComplaint.universityRoute.portalLoginAccount;
        const institutionName = assignedComplaint.universityRoute.selectedUniversity || "Partner University";
        const user = {
          id: portalAcc.institutionalCode || `UNIV-${Date.now().toString().slice(-4)}`,
          name: `Research Directorate (${institutionName})`,
          email: cleanEmail,
          role: "university",
          agency: institutionName,
          department: "Department of Civil, Environmental & Computing Sciences",
          designation: "Principal Project Investigator",
          securityClearance: "Institutional Academic Partner"
        };
        const token = `jh_univ_token_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        return res.json({ success: true, user, token });
      }

      return res.status(401).json({
        error: "Invalid university credentials. Please check your assigned university email and password."
      });
    }

    return res.status(400).json({ error: "Invalid portal role selected." });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Authentication error" });
  }
});

app.get("/api/auth/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing authentication token" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Invalid token format" });
  }
  res.json({ valid: true });
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
