import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { TutorConfig } from "../types";

// Singleton instance management
let chatSession: Chat | null = null;
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const initializeTutorSession = (config: TutorConfig) => {
  const systemInstruction = `
    You are Insight, a world-class adaptive AI Tutor.
    
    Current Student Profile:
    - Topic of Interest: ${config.topic}
    - Self-Assessed Knowledge Level: ${config.level}
    - Learning Goal: ${config.goal}

    Your Rules:
    1. Adaptivity: Adjust your language, analogies, and depth of explanation to match the '${config.level}' level.
       - Beginner: Use simple analogies, avoid jargon, explain basics step-by-step.
       - Intermediate: Connect concepts, introduce standard terminology, assume basic understanding.
       - Advanced/Expert: fast-paced, high-level abstractions, nuance, debate edge cases.
    2. Socratic Method: Do not just lecture. Ask checking questions to ensure understanding before moving on.
    3. Conciseness: Keep responses digestible. Use markdown for lists and code blocks.
    4. Goal-Oriented: Keep the conversation steered towards: "${config.goal}".
    5. Tone: Encouraging, patient, but intellectual.

    Start by welcoming the user, briefly acknowledging their goal, and asking a starting question to gauge their actual starting point accurately.
  `;

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction.trim(),
      temperature: 0.7, // Balance between creativity and factual accuracy
    },
  });

  return chatSession;
};

export const sendMessageStream = async function* (message: string) {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  const streamResult = await chatSession.sendMessageStream({ message });

  for await (const chunk of streamResult) {
    const c = chunk as GenerateContentResponse;
    if (c.text) {
      yield c.text;
    }
  }
};

export const resetSession = () => {
  chatSession = null;
};