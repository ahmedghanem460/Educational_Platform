
// import {
//     GoogleGenAI,
//   } from '@google/genai';
// import { prompt } from '../constant/Prompt';

import { Alert } from "react-native";

  
//   async function main() {
//     const ai = new GoogleGenAI({
//       apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
//     });
//     const config = {
//       // responseMimeType: 'text/plain',
//       responseMimeType: 'application/json',
//     };
//     const model = 'gemini-2.5-pro-preview-03-25';
//     const contents = [
//       {
//         role: 'user',
//         parts: [
//           {
//             text: `Learn Python::As you are coaching teacher
//   - User want to learn about the topic
//   - Generate 5-7 Courses for study(Short)
//   - Make sure it's related to description
//   - Output will be ARRAY of JSON FORMAT only
//   - Don't add any plain text in output, `,
//           },
//         ],
//       },
//       {
//         role: 'model',
//         parts: [
//           {
//             text: `The user wants me to act as a Python coaching teacher.
//   The user wants to learn about a specific topic (which they haven't specified yet, but I need to prepare for it).
//   I need to generate 5-7 short course suggestions related to *Python*.
//   The output must be an array of JSON objects.
//   Each JSON object should represent a course.
//   I should not add any introductory or concluding text, just the JSON array.
  
//   Okay, since the user hasn't specified a topic *within* Python, I will create a set of foundational Python courses suitable for a beginner or someone wanting to structure their learning.
  
//   Each JSON object should probably have keys like:
//   - \`course_title\`: A short, descriptive title.
//   - \`description\`: A brief explanation of what the course covers.
//   - \`level\`: Suggested level (e.g., Beginner, Intermediate).
//   - \`estimated_duration\`: A rough idea of how long it might take (e.g., "1-2 hours", "3-4 hours").
  
//   Let's structure the courses:
//   1.  **Python Basics**: Covers the absolute fundamentals.
//   2.  **Data Structures in Python**: Lists, tuples, dictionaries, sets.
//   3.  **Control Flow**: If/else, loops (for, while).
//   4.  **Functions**: Defining and using functions, scope.
//   5.  **Object-Oriented Programming (OOP) Basics**: Classes, objects, inheritance (intro).
//   6.  **File Handling**: Reading from and writing to files.
//   7.  **Modules and Packages**: Importing and using standard/third-party libraries.
  
//   Now, I'll format these into the required JSON array.
  
//   \`\`\`json
//   [
//     {
//       "course_title": "Python Foundations: Getting Started",
//       "description": "Learn the absolute basics: variables, data types (integers, floats, strings, booleans), operators, and your first 'Hello, World!' program.",
//       "level": "Beginner",
//       "estimated_duration": "1-2 hours"
//     },
//     {
//       "course_title": "Python Data Structures: Organizing Information",
//       "description": "Understand how to store collections of data using lists, tuples, dictionaries, and sets. Learn common operations for each.",
//       "level": "Beginner",
//       "estimated_duration": "2-3 hours"
//     },
//     {
//       "course_title": "Controlling the Flow: Decisions and Loops",
//       "description": "Master conditional statements (if, elif, else) to make decisions and loops (for, while) to repeat actions efficiently.",
//       "level": "Beginner",
//       "estimated_duration": "2-3 hours"
//     },
//     {
//       "course_title": "Building Blocks: Functions in Python",
//       "description": "Learn how to define and call your own functions to write reusable and organized code. Understand arguments, return values, and scope.",
//       "level": "Beginner/Intermediate",
//       "estimated_duration": "2-4 hours"
//     },
//     {
//       "course_title": "Introduction to Object-Oriented Python (OOP)",
//       "description": "Grasp the core concepts of OOP: creating classes (blueprints) and objects (instances), and understanding basic inheritance.",
//       "level": "Intermediate",
//       "estimated_duration": "3-5 hours"
//     },
//     {
//       "course_title": "Working with Files in Python",
//       "description": "Learn how to read data from text files and write data back to them, essential for data processing and persistence.",
//       "level": "Beginner/Intermediate",
//       "estimated_duration": "1-2 hours"
//     },
//     {
//       "course_title": "Using Python's Power: Modules and Packages",
//       "description": "Explore how to import and use Python's built-in modules (like 'math' or 'random') and install/use external packages using pip.",
//       "level": "Intermediate",
//       "estimated_duration": "2-3 hours"
//     }
//   ]
//   \`\`\`
  
//   This looks like a good set of 7 courses, covering fundamental Python topics. They are short, related to learning Python, and formatted as a JSON array. No extra text.`,
//           },
//           {
//             text: `\`\`\`json
//   [
//     {
//       "course_title": "Python Setup & First Steps",
//       "description": "Covers installing Python, setting up your coding environment (like VS Code or PyCharm), and writing/running your very first 'Hello, World!' script.",
//       "level": "Absolute Beginner",
//       "estimated_duration": "1 hour"
//     },
//     {
//       "course_title": "Variables & Basic Data Types",
//       "description": "Learn how to store information using variables and understand fundamental data types: integers, floats, strings, and booleans.",
//       "level": "Beginner",
//       "estimated_duration": "1-2 hours"
//     },
//     {
//       "course_title": "Python Collections: Lists & Dictionaries",
//       "description": "Explore how to manage groups of data using lists (ordered sequences) and dictionaries (key-value pairs). Covers basic operations like adding, removing, and accessing items.",
//       "level": "Beginner",
//       "estimated_duration": "2-3 hours"
//     },
//     {
//       "course_title": "Making Decisions: Conditional Logic",
//       "description": "Understand how to control the flow of your program using \`if\`, \`elif\`, and \`else\` statements based on different conditions.",
//       "level": "Beginner",
//       "estimated_duration": "1-2 hours"
//     },
//     {
//       "course_title": "Repeating Actions: Loops",
//       "description": "Learn to automate repetitive tasks using \`for\` loops (iterating over sequences) and \`while\` loops (repeating as long as a condition is true).",
//       "level": "Beginner",
//       "estimated_duration": "2-3 hours"
//     },
//     {
//       "course_title": "Creating Reusable Code: Functions",
//       "description": "Discover how to define and call your own functions to make your code modular, reusable, and easier to understand. Covers parameters and return values.",
//       "level": "Beginner/Intermediate",
//       "estimated_duration": "2-4 hours"
//     },
//     {
//       "course_title": "Introduction to File Handling",
//       "description": "Learn the basics of reading data from external text files and writing data back into files, a crucial skill for data interaction.",
//       "level": "Beginner/Intermediate",
//       "estimated_duration": "1-2 hours"
//     }
//   ]
//   \`\`\``,
//           },
//         ],
//       },
//       {
//         role: 'user',
//         parts: [
//           {
//             text: `INSERT_INPUT_HERE`,
//           },
//         ],
//       },
//     ];
  
//   //   const response = await ai.models.generateContentStream({
//   //     model,
//   //     config,
//   //     contents,
//   //   });
//   //   for await (const chunk of response) {
//   //     console.log(chunk.text);
//   //   }
//   // }
//   try {
//     const response = await ai.models.generateContent({
//       model,
//       config,
//       contents,
//     });
//     console.log('Generated Response:', response);
//     // Handle the response here, assuming it's a JSON array of course suggestions
//   } catch (error) {
//     console.error('Error generating content:', error);
//   }

  
// }

// export const generateTopic = async (topic: string): Promise<string> => {
//   const prompts = `${prompt.IDEA}\nTopic: ${topic}`;
//   const modelName = 'gemini-2'; // Try a more generic model name, or use one you know works.

//   try {
//     // Using generateContent instead of generateContentStream for simplicity.
//     // Initialize the GenAI client with API key
//     const genAI = new GoogleGenAI({
//       apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY!,
//     });
    
//         const response = await genAI.generateContent({
//       model: modelName,
//       contents: [
//         {
//           role: 'user',
//           parts: [{ text: prompts }],
//         },
//       ],
//       config: {
//         responseMimeType: 'application/json',
//       },
//     });
//     console.log('Full Response:', response);

//     // Check for content and process it
//     const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
//     if (!text || !text.trim()) {
//       throw new Error('Response body is empty');
//     }

//     // Clean the response before returning
//     const cleaned = cleanJSONResponse(text);
//     return cleaned;
//   } catch (error) {
//     console.error('Error generating topic:', error);
//     throw error;
//   }
// }
  
//   main();
  
// // import { GoogleGenAI } from '@google/genai';
// // import prompts from '../constant/Prompt';

// // // Initialize the GenAI client with API key
// // const genAI = new GoogleGenAI({
// //   apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY!,
// // });

// // // Function to clean the JSON response
// // function cleanJSONResponse(text: string): string {
// //   return text
// //     .replace(/```json/g, '')
// //     .replace(/```/g, '')
// //     .trim();
// // }

// // // Function to generate the topic
// // export const generateTopic = async (topic: string): Promise<string> => {
// //   const prompt = `${prompts.IDEA}\nTopic: ${topic}`;
// //   const modelName = 'gemini-2'; // Try a more generic model name, or use one you know works.

// //   try {
// //     // Using generateContent instead of generateContentStream for simplicity.
// //     const response = await genAI.generateContentStream({
// //       model: modelName,
// //       contents: [
// //         {
// //           role: 'user',
// //           parts: [{ text: prompt }],
// //         },
// //       ],
// //       config: {
// //         responseMimeType: 'application/json',
// //       },
// //     });
// //     console.log('Full Response:', response);

// //     // Check for content and process it
// //     const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
// //     if (!text || !text.trim()) {
// //       throw new Error('Response body is empty');
// //     }

// //     // Clean the response before returning
// //     const cleaned = cleanJSONResponse(text);
// //     return cleaned;
// //   } catch (error) {
// //     console.error('Error generating topic:', error);
// //     throw error;
// //   }
// // };

// AiModel.js (or your equivalent file, e.g., ../../config/AiModel.js)

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require('@google/generative-ai');

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

// It's a good practice to ensure the API key is available
if (!apiKey) {
  console.error(
    'EXPO_PUBLIC_GEMINI_API_KEY is not defined. Please set it in your environment variables.'
  );
  // You might want to throw an error here or handle it gracefully
  // For now, the GoogleGenerativeAI constructor will throw if apiKey is invalid.
}

const genAI = new GoogleGenerativeAI(apiKey);

// Consider using a stable model version unless you have specific access to the experimental one
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash-latest', // Using a common, robust model. Change if needed.
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  // topK: 40, // topK might not be supported or work the same way for all models/versions.
  // Check Gemini documentation for gemini-1.5-pro-latest if you need to tune with topK.
  maxOutputTokens: 8192,
  responseMimeType: 'application/json', // This is good!
};

// Define safety settings correctly
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE, // Choose an appropriate threshold
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

// Initialize the chat session once
const chatSession = model.startChat({
  generationConfig,
  safetySettings, // Corrected: use safetySettings
  history: [
    {
      role: 'user',
      parts: [
        {
          // Revised prompt for clarity and to guide the AI for subsequent inputs
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

// Export a FUNCTION that uses the chatSession
export const generateTopicsAIModel = async (userInput) => {
  if (!apiKey) {
    // This check is a bit redundant if genAI constructor already threw, but good for clarity
    throw new Error('Gemini API key is not configured.');
  }
  try {
    console.log('Sending to Gemini with input:', userInput);
    const result = await chatSession.sendMessage(userInput);
    const response = result.response;
    const textContent = response.text(); // This should be the JSON string

    console.log('Gemini Raw Response Text:', textContent);
    return textContent;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Log more details if available, e.g., from error.response for some SDKs
    if (error.response && error.response.promptFeedback) {
      console.error('Gemini Prompt Feedback:', error.response.promptFeedback);
    }
    if (error.message.includes("API key not valid")) {
        Alert.alert("API Key Error", "The Gemini API key is not valid. Please check your configuration.");
    }
    throw error; // Re-throw to be caught by the calling component
  }
};