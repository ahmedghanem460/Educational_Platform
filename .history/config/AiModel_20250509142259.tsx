import { Alert } from "react-native";
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require('@google/generative-ai');

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  console.error(
    'EXPO_PUBLIC_GEMINI_API_KEY is not defined. Please set it in your environment variables.'
  );
  throw new Error(
    'Gemini API key is not configured. Please set EXPO_PUBLIC_GEMINI_API_KEY in your environment variables.'
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash-latest', 
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  // topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE, 
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const chatSession = model.startChat({
  generationConfig,
  safetySettings, 
  history: [
    {
      role: 'user',
      parts: [
        {
          text: `You are an AI assistant designed to help users generate a list of course topics.
When the user provides a subject or an idea in their next message (e.g., "Learn Python", "Digital Marketing"), you will generate 5-7 short course titles or modules related to that subject.
The output MUST be a valid JSON array of strings, where each string is a course title.
Example input from user (in next message): "Learn Python"
Example output from you (in response to that message):
[
  "Introduction to Python Basics",
  "Python Data Structures",
  "Object-Oriented Programming in Python",
  "Web Development with Python (Flask/Django)",
  "Data Analysis with Python (Pandas & NumPy)",
  "Introduction to Machine Learning with Python"
]
Do not include any other text, explanations, or markdown formatting outside of the JSON array. Your entire response should be just the JSON array.`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: "Okay, I understand. I will act as a course topic generator. When I receive a subject from you in a new message, I will return a JSON array of 5-7 related course titles. I will ensure the output is strictly a JSON array of strings and contains no other text or markdown.",
        },
      ],
    },
  ],
});

export const generateTopicsAIModel = async (userInput: any) => {
  if (!apiKey) {
    throw new Error('Gemini API key is not configured.');
  }
  try {
    console.log('Sending to Gemini with input:', userInput);
    const result = await chatSession.sendMessage(userInput);
    const response = result.response;
    const textContent = response.text(); 

    console.log('Gemini Raw Response Text:', textContent);
    return textContent;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    if (error.response && error.response.promptFeedback) {
      console.error('Gemini Prompt Feedback:', error.response.promptFeedback);
    }
    if (error.message.includes("API key not valid")) {
        Alert.alert("API Key Error", "The Gemini API key is not valid. Please check your configuration.");
    }
    throw error; 
  }
};