import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const symptomChecker = async (req, res) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms) {
            return res.json({ success: false, message: "Please provide symptoms" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

        const prompt = `You are an expert medical assistant. Analyze the following symptoms and provide a structured assessment.
        Symptoms: "${symptoms}"

        Return ONLY a JSON object with this exact structure:
        {
          "possibleIssues": ["Issue 1", "Issue 2"],
          "recommendedSpecialist": "One of: General physician, Gynecologist, Dermatologist, Pediatricians, Neurologist, Gastroenterologist",
          "advice": "Clear, concise health advice",
          "severity": "Low/Medium/High",
          "isEmergency": boolean
        }
        
        Rules:
        1. Only recommend specialists from the provided list.
        2. Do not include any markdown, backticks, or extra text.
        3. Be professional and concise.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Robust JSON extraction to handle any markdown or extra text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI returned an invalid format. Please try again.");
        }
        
        const data = JSON.parse(jsonMatch[0]);

        res.json({ success: true, data });
    } catch (error) {
        console.log("Symptom Checker Error:", error);
        res.json({ success: false, message: error.message });
    }
}

const healthTip = async (req, res) => {
    try {
        const { userData } = req.body;
        
        const prompt = `You are a medical AI assistant for CarePoint.
        Generate a single, short, encouraging health tip (max 2 sentences) for a patient with the following profile:
        - Gender: ${userData?.gender || 'Not specified'}
        - Age/DOB: ${userData?.dob || 'Not specified'}
        
        Focus on wellness, hydration, or sleep. Use a premium, professional tone.`;

        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ success: true, tip: text });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const clinicalAssistant = async (req, res) => {
    try {
        const { notes } = req.body;
        if (!notes) return res.json({ success: false, message: "No notes provided" });

        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
        const prompt = `You are an AI Clinical Assistant. Transform these doctor's rough notes into a professional medical assessment.
        Notes: "${notes}"

        Return ONLY a JSON object:
        {
          "diagnosisSummary": "Professional summary of the condition",
          "consultationSummary": "Detailed advice for the patient, including dietary restrictions, rest, and home care (max 3 sentences)",
          "followUpPlan": "Suggested follow-up timing and purpose",
          "careInstructions": ["Step 1", "Step 2", "Step 3"],
          "redFlags": ["Symptom to watch for 1", "Symptom to watch for 2"],
          "recommendedTests": ["Test 1", "Test 2"],
          "prescriptionDraft": [
            {"medicine": "Name", "dosage": "e.g. 500mg", "duration": "e.g. 5 days", "instruction": "e.g. After food"}
          ],
          "warnings": ["Potential drug interactions or allergy risks"]
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanedText = text.replace(/```json|```/g, "").trim();
        res.json({ success: true, data: JSON.parse(cleanedText) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const summarizeMedicalHistory = async (req, res) => {
    try {
        const { history } = req.body; // Array of previous prescriptions/notes
        if (!history || history.length === 0) return res.json({ success: true, summary: "No previous medical history found." });

        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
        const prompt = `Summarize this patient's medical history into a concise "Patient Summary Card" for a doctor.
        History: ${JSON.stringify(history)}

        Return ONLY a JSON object:
        {
          "chronicConditions": ["Condition 1"],
          "allergies": ["Allergy 1"],
          "recentTrends": "Summary of recent visits/issues",
          "riskLevel": "Low/Medium/High"
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const cleanedText = response.text().replace(/```json|```/g, "").trim();
        res.json({ success: true, summary: JSON.parse(cleanedText) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const analyzeEmergencyRisk = async (req, res) => {
    try {
        const { symptoms } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
        const prompt = `Analyze these symptoms for IMMEDIATE EMERGENCY RISK.
        Symptoms: "${symptoms}"
        
        Return ONLY a JSON object:
        {
          "isEmergency": boolean,
          "riskLevel": "CRITICAL/HIGH/MODERATE/LOW",
          "reason": "Why this is or isn't an emergency",
          "action": "Immediate action required (e.g. Call 911, Visit clinic, Rest)"
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const cleanedText = response.text().replace(/```json|```/g, "").trim();
        res.json({ success: true, evaluation: JSON.parse(cleanedText) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const getRecommendedDoctors = async (req, res) => {
    try {
        const { symptoms, allDoctors } = req.body;
        if (!symptoms || !allDoctors) return res.json({ success: false, message: "Missing data" });

        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
        const prompt = `Based on these symptoms: "${symptoms}", and this list of doctors: ${JSON.stringify(allDoctors.map(d => ({ id: d._id, name: d.name, speciality: d.speciality, fees: d.fees, experience: d.experience })))}
        
        Identify the TOP 3 most suitable doctors.
        
        Return ONLY a JSON array of doctor IDs: ["id1", "id2", "id3"]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const cleanedText = response.text().replace(/```json|```/g, "").trim();
        res.json({ success: true, recommendedIds: JSON.parse(cleanedText) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const validatePrescription = async (req, res) => {
    try {
        const { items, patientHistory } = req.body;
        if (!items) return res.json({ success: false, message: "No medications provided" });

        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
        const prompt = `Act as a clinical pharmacist. Validate this prescription for safety.
        Current Medications: ${JSON.stringify(items)}
        Patient Medical History: ${JSON.stringify(patientHistory)}
        
        Check for:
        1. Drug-Drug interactions.
        2. Dangerous combinations.
        3. Allergic risks based on history.
        4. Duplicate medications.
        
        Return ONLY a JSON object:
        {
          "isSafe": boolean,
          "severity": "Low/Medium/High",
          "conflicts": ["Conflict 1", "Conflict 2"],
          "recommendations": "Suggested safer alternative or caution"
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const cleanedText = response.text().replace(/```json|```/g, "").trim();
        res.json({ success: true, validation: JSON.parse(cleanedText) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const predictNoShow = async (req, res) => {
    try {
        const { appointmentData, patientHistory } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
        const prompt = `Predict the probability of a "No-Show" for this appointment.
        Appointment: ${JSON.stringify(appointmentData)}
        Patient Behavior: ${JSON.stringify(patientHistory)}
        
        Return ONLY a JSON object:
        {
          "probability": number (0-100),
          "riskLevel": "Low/Medium/High",
          "reason": "Top factor for this prediction"
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const cleanedText = response.text().replace(/```json|```/g, "").trim();
        res.json({ success: true, prediction: JSON.parse(cleanedText) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const predictFollowUp = async (req, res) => {
    try {
        const { patients } = req.body; // List of recent patients with their issues
        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
        const prompt = `Identify patients who urgently need a follow-up call/appointment based on their recent records.
        Patients: ${JSON.stringify(patients)}
        
        Return ONLY a JSON array of patient IDs with reasons:
        [{"id": "id1", "reason": "Reason", "urgency": "High"}]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const cleanedText = response.text().replace(/```json|```/g, "").trim();
        res.json({ success: true, followUps: JSON.parse(cleanedText) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const getRevenueIntelligence = async (req, res) => {
    try {
        const { stats } = req.body; // Historical revenue/appointment data
        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
        const prompt = `Analyze these hospital statistics and provide revenue/growth predictions for next month.
        Stats: ${JSON.stringify(stats)}
        
        Return ONLY a JSON object:
        {
          "predictedRevenue": number,
          "growthTrend": "Up/Down/Stable",
          "insights": ["Insight 1", "Insight 2"],
          "demandForecasting": {"General physician": "High", "Dermatologist": "Medium"}
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI returned invalid format");
        }
        res.json({ success: true, intelligence: JSON.parse(jsonMatch[0]) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const getHealthScore = async (req, res) => {
    try {
        const { userData, history } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
        const calculatedAge = userData?.dob && userData.dob !== "Not Selected" 
            ? new Date().getFullYear() - new Date(userData.dob).getFullYear() 
            : 'Unknown';
            
        const prompt = `Calculate a "Health Score" (0-100) for this patient.
        Profile: ${JSON.stringify(userData)}
        Patient Age: ${calculatedAge} years old
        Clinical History: ${JSON.stringify(history)}
        
        Return ONLY a JSON object:
        {
          "score": number,
          "category": "Excellent/Good/Fair/Poor",
          "summary": "Short 1-sentence health summary",
          "recommendations": ["Tip 1", "Tip 2"]
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI returned invalid format");
        }
        res.json({ success: true, healthData: JSON.parse(jsonMatch[0]) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export { symptomChecker, healthTip, clinicalAssistant, summarizeMedicalHistory, analyzeEmergencyRisk, getRecommendedDoctors, validatePrescription, predictNoShow, predictFollowUp, getRevenueIntelligence, getHealthScore };
