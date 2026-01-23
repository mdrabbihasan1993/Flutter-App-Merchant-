
import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const analyzeBusinessPerformance = async (context: string): Promise<string> => {
  const ai = getAIClient();
  const systemInstruction = "You are a Senior Business Consultant for 7ton Express. Analyze the provided logistics dashboard analytics. IMPORTANT RULES: 1. Provide only 3 short, actionable, bulleted insights based on the data. 2. NEVER suggest using other courier services or competitors. 3. ALWAYS recommend the user to contact their KAM (Key Account Manager) or the Support Team for further optimization. 4. Keep it professional, motivating, and concise.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: ${context}. Prompt: Analyze my performance stats and give me 3 specific tips to grow my business with 7ton Express.`,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });
    return response.text || "No insights available at the moment. Please contact your KAM.";
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "I'm currently recalibrating my analytical engine. Please try again in a moment or reach out to our Support team for immediate help.";
  }
};

export const checkFraudRisk = async (phoneNumber: string): Promise<string> => {
  const ai = getAIClient();
  const systemInstruction = "You are a Security Specialist checking for fake customers in the Bangladesh logistics market. Analyze historical delivery risk for the given phone number.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this phone number for potential delivery risk in Bangladesh: ${phoneNumber}. Provide a risk score from 1-10 (1 is safe) and a very short reasoning.`,
      config: {
        systemInstruction,
        temperature: 0.1,
      }
    });
    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("AI Fraud Check Error:", error);
    return "Error connecting to the security database. Please verify manually.";
  }
};
