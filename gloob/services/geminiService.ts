
import { GoogleGenAI, Type } from "@google/genai";
import { AutocorrectResult } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

export const getAutocorrect = async (text: string): Promise<AutocorrectResult> => {
  if (!text.trim()) {
    return { original: text, corrected: text, isChanged: false };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Autocorrect and improve the grammar of this text while keeping the same tone. Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            corrected: { type: Type.STRING },
            isChanged: { type: Type.BOOLEAN },
            explanation: { type: Type.STRING }
          },
          required: ["corrected", "isChanged"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return {
      original: text,
      corrected: result.corrected,
      isChanged: result.isChanged,
      explanation: result.explanation
    };
  } catch (error) {
    console.error("Gemini Autocorrect Error:", error);
    return { original: text, corrected: text, isChanged: false };
  }
};
