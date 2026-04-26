import { GoogleGenerativeAI } from "@google/generative-ai";

const symptomChecker = async (req, res) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms) {
            return res.json({ success: false, message: "Please provide symptoms" });
        }

        console.log("Checking Gemini API Key...");
        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing from process.env");
        } else {
            const key = process.env.GEMINI_API_KEY;
            console.log("GEMINI_API_KEY load state: true");
            console.log(`Key verification: ${key.substring(0, 4)}...${key.substring(key.length - 4)}`);
        }
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

        const prompt = `You are an expert medical assistant. Analyze the following symptoms and provide a structured assessment.
        Symptoms: "${symptoms}"

        Return ONLY a JSON object with this exact structure:
        {
          "possibleIssues": ["Issue 1", "Issue 2"],
          "recommendedSpecialist": "One of: General physician, Gynecologist, Dermatologist, Pediatricians, Neurologist, Gastroenterologist",
          "advice": "Clear, concise health advice",
          "severity": "Low/Medium/High"
        }
        
        Rules:
        1. Only recommend specialists from the provided list.
        2. Do not include any markdown, backticks, or extra text.
        3. Be professional and concise.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Clean up text in case Gemini wraps it in code blocks
        const cleanedText = text.replace(/```json|```/g, "").trim();
        const data = JSON.parse(cleanedText);

        res.json({ success: true, data });
    } catch (error) {
        console.log(error);
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

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ success: true, tip: text });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { symptomChecker, healthTip };
