
import { GoogleGenAI } from "@google/genai";
import { Expense } from "../types";

export const getFinancialInsights = async (expenses: Expense[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const expenseDataString = expenses.map(e => `${e.date}: $${e.amount} on ${e.category} (${e.note})`).join('\n');
  
  const prompt = `
    Based on the following student expenses:
    ${expenseDataString}
    
    Provide 3 concise, actionable financial tips for a student. 
    Format the response as a JSON array of strings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || "[]") as string[];
  } catch (error) {
    console.error("Gemini Error:", error);
    return ["Limit non-essential spending.", "Look for student discounts.", "Set a weekly budget target."];
  }
};
