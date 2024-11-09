const express = require("express");
const cors = require("cors");
// const { exec } = require("child_process");
const adminLogin = require("./models/adminAuth");
const postQuestion = require("./models/questionModel");
const axios = require("axios");
const Groq = require('groq-sdk');

require('dotenv').config();
 
const GroqKey = process.env.GROQ_API_KEY; // Load the API key from .env


const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://mavinash422:Jq7jZRsbyTV9BJ2X@cluster0.x36o1.mongodb.net/HackCelestial?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("DB connection Successful!");
  })
  .catch((e) => {
    console.log(e.message);
  });

const app = express();
app.use(express.json());
app.use(cors()); // To handle cross-origin requests from your frontend

const apiKey = "AIzaSyB10nBDi5qt-_vMxAvoQ4QpR0VZeOayFOk";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 0.7, // Lower temperature for more deterministic output
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const prompts = {
  javascript: `Generate a JSON object that represents a coding question in JavaScript. The object should include:
- "question" as a string describing the coding question.
- "id" as a unique identifier for the question (string).
- "steps" as an array where each element is an object with the following keys:
  - "step_id" as a number indicating the step's serial number.
  - "step_title" as a string describing the step.
  - "code" as a string representing the code needed for this step.
  - "desired_output" as a string describing the expected output of the code, if any.
  - "hint" as a string providing a hint to help with the step.
  - "keywords" as an array of objects, where each object contains:
    - "keyword" as a string representing a JavaScript keyword related to the step.
    - "description" as a string explaining the keyword's relevance or usage.

Ensure that each step's code is executable in isolation, and the final code can be constructed by combining all the steps. Include essential elements like function definitions, return statements, and method calls.

For example, for the question "How to implement a function to add two numbers in JavaScript?":
{
  "question": "How to implement a function to add two numbers in JavaScript?",
  "id": "unique-id-123",
  "steps": [
    {
      "step_id": 1,
      "step_title": "Define the function",
      "code": "function addTwoNumbers(num1, num2) {",
      "desired_output": "",
      "hint": "Start by defining the function with parameters for the numbers.",
      "keywords": [
        {"keyword": "function", "description": "Used to declare a function in JavaScript."}
      ]
    },
    {
      "step_id": 2,
      "step_title": "Add the numbers",
      "code": "  return num1 + num2;",
      "desired_output": "",
      "hint": "Perform the addition of the two parameters.",
      "keywords": [
        {"keyword": "return", "description": "Used to return a value from a function."},
        {"keyword": "+", "description": "Addition operator."}
      ]
    },
    {
      "step_id": 3,
      "step_title": "Close the function",
      "code": "}",
      "desired_output": "",
      "hint": "End the function definition.",
      "keywords": [
        {"keyword": "}", "description": "Used to close a block of code."}
      ]
    }
  ],
  "language": "JavaScript"
}
  Now generate for {{QUESTION}}  
`,
  cpp: `Generate a JSON object that represents a coding question in C++. The object should include:
- "question" as a string describing the coding question.
- "id" as a unique identifier for the question (string).
- "steps" as an array where each element is an object with the following keys:
  - "step_id" as a number indicating the step's serial number.
  - "step_title" as a string describing the step.
  - "code" as a string representing the code needed for this step.
  - "desired_output" as a string describing the expected output of the code, if any.
  - "hint" as a string providing a hint to help with the step.
  - "keywords" as an array of objects, where each object contains:
    - "keyword" as a string representing a C++ keyword related to the step.
    - "description" as a string explaining the keyword's relevance or usage.

Ensure that each step's code is executable in isolation, and the final code can be constructed by combining all the steps. Include elements like function declarations, return statements, and proper use of C++ syntax.

For example, for the question "How to implement a function to add two numbers in C++?":
{
  "question": "How to implement a function to add two numbers in C++?",
  "id": "unique-id-123",
  "steps": [
    {
      "step_id": 1,
      "step_title": "Include necessary headers",
      "code": "#include <iostream>",
      "desired_output": "",
      "hint": "Include the necessary headers for input and output operations.",
      "keywords": [
        {"keyword": "#include", "description": "Preprocessor directive to include standard libraries."}
      ]
    },
    {
      "step_id": 2,
      "step_title": "Define the function",
      "code": "int addTwoNumbers(int num1, int num2) {",
      "desired_output": "",
      "hint": "Start by defining the function with parameters for the numbers.",
      "keywords": [
        {"keyword": "int", "description": "Data type for integer values in C++."}
      ]
    },
    {
      "step_id": 3,
      "step_title": "Add the numbers and return",
      "code": "  return num1 + num2;\n}",
      "desired_output": "",
      "hint": "Perform the addition of the two parameters and return the result.",
      "keywords": [
        {"keyword": "return", "description": "Used to return a value from a function."},
        {"keyword": "+", "description": "Addition operator."}
      ]
    },
    {
      "step_id": 4,
      "step_title": "Add main function",
      "code": "int main() {\n  std::cout << addTwoNumbers(5, 3) << std::endl;\n  return 0;\n}",
      "desired_output": "Prints the sum of the numbers.",
      "hint": "Complete the function and provide a main function to test it.",
      "keywords": [
        {"keyword": "main", "description": "The entry point of a C++ program."}
      ]
    }
  ],
  "language": "C++"
}
  Now generate for {{QUESTION}}  
`,
  c: `Generate a JSON object that represents a coding question in C. The object should include:
- "question" as a string describing the coding question.
- "id" as a unique identifier for the question (string).
- "steps" as an array where each element is an object with the following keys:
  - "step_id" as a number indicating the step's serial number.
  - "step_title" as a string describing the step.
  - "code" as a string representing the code needed for this step.
  - "desired_output" as a string describing the expected output of the code, if any.
  - "hint" as a string providing a hint to help with the step.
  - "keywords" as an array of objects, where each object contains:
    - "keyword" as a string representing a C keyword related to the step.
    - "description" as a string explaining the keyword's relevance or usage.

Ensure that each step's code is executable in isolation, and the final code can be constructed by combining all the steps. Include function definitions, return statements, and main function implementation.

For example, for the question "How to implement a function to add two numbers in C?":
{
  "question": "How to implement a function to add two numbers in C?",
  "id": "unique-id-123",
  "steps": [
    {
      "step_id": 1,
      "step_title": "Include necessary headers",
      "code": "#include <stdio.h>",
      "desired_output": "",
      "hint": "Include the necessary headers for input and output operations.",
      "keywords": [
        {"keyword": "#include", "description": "Preprocessor directive to include standard libraries."}
      ]
    },
    {
      "step_id": 2,
      "step_title": "Define the function",
      "code": "int addTwoNumbers(int num1, int num2) {",
      "desired_output": "",
      "hint": "Start by defining the function with parameters for the numbers.",
      "keywords": [
        {"keyword": "int", "description": "Data type for integer values in C."}
      ]
    },
    {
      "step_id": 3,
      "step_title": "Add the numbers and return",
      "code": "  return num1 + num2;\n}",
      "desired_output": "",
      "hint": "Perform the addition of the two parameters and return the result.",
      "keywords": [
        {"keyword": "return", "description": "Used to return a value from a function."},
        {"keyword": "+", "description": "Addition operator."}
      ]
    },
    {
      "step_id": 4,
      "step_title": "Add main function",
      "code": "int main() {\n  printf(\"%d\\n\", addTwoNumbers(5, 3));\n  return 0;\n}",
      "desired_output": "Prints the sum of the numbers.",
      "hint": "Complete the function and provide a main function to test it.",
      "keywords": [
        {"keyword": "main", "description": "The entry point of a C program."}
      ]
    }
  ],
  "language": "C"
}
  Now generate for {{QUESTION}}  
`,
  java: `Generate a JSON object that represents a coding question in Java. The object should include:
- "question" as a string describing the coding question.
- "id" as a unique identifier for the question (string).
- "steps" as an array where each element is an object with the following keys:
  - "step_id" as a number indicating the step's serial number.
  - "step_title" as a string describing the step.
  - "code" as a string representing the code needed for this step.
  - "desired_output" as a string describing the expected output of the code, if any.
  - "hint" as a string providing a hint to help with the step.
  - "keywords" as an array of objects, where each object contains:
    - "keyword" as a string representing a Java keyword related to the step.
    - "description" as a string explaining the keyword's relevance or usage.

Ensure that each step's code is executable in isolation, and the final code can be constructed by combining all the steps. Include class declarations, method definitions, and proper use of Java syntax.

For example, for the question "How to implement a function to add two numbers in Java?":
{
  "question": "How to implement a function to add two numbers in Java?",
  "id": "unique-id-123",
  "steps": [
    {
      "step_id": 1,
      "step_title": "Define the class",
      "code": "public class Main {",
      "desired_output": "",
      "hint": "Start by defining a class.",
      "keywords": [
        {"keyword": "public", "description": "Access modifier that makes the class accessible from other classes."},
        {"keyword": "class", "description": "Keyword to define a class in Java."}
      ]
    },
    {
      "step_id": 2,
      "step_title": "Define the method",
      "code": "  public static int addTwoNumbers(int num1, int num2) {",
      "desired_output": "",
      "hint": "Define the method to add two numbers.",
      "keywords": [
        {"keyword": "public", "description": "Access modifier for the method."},
        {"keyword": "static", "description": "Keyword indicating that the method can be called without an instance."},
        {"keyword": "int", "description": "Data type for integer values in Java."}
      ]
    },
    {
      "step_id": 3,
      "step_title": "Add the numbers and return",
      "code": "    return num1 + num2;\n  }",
      "desired_output": "",
      "hint": "Perform the addition and return the result.",
      "keywords": [
        {"keyword": "return", "description": "Used to return a value from a method."},
        {"keyword": "+", "description": "Addition operator."}
      ]
    },
    {
      "step_id": 4,
      "step_title": "Close the class and add main method",
      "code": "  public static void main(String[] args) {\n    System.out.println(addTwoNumbers(5, 3));\n  }\n}",
      "desired_output": "Prints the sum of the numbers.",
      "hint": "Complete the class and add a main method to test the function.",
      "keywords": [
        {"keyword": "main", "description": "The entry point of a Java application."},
        {"keyword": "System.out.println", "description": "Used to print output to the console."}
      ]
    }
  ],
  "language": "Java"
}
  Now generate for {{QUESTION}}  
`,
  python: `Generate a JSON object that represents a coding question in Python. The object should include:
- "question" as a string describing the coding question.
- "id" as a unique identifier for the question (string).
- "steps" as an array where each element is an object with the following keys:
  - "step_id" as a number indicating the step's serial number.
  - "step_title" as a string describing the step.
  - "code" as a string representing the code needed for this step.
  - "desired_output" as a string describing the expected output of the code, if any.
  - "hint" as a string providing a hint to help with the step.
  - "keywords" as an array of objects, where each object contains:
    - "keyword" as a string representing a Python keyword related to the step.
    - "description" as a string explaining the keyword's relevance or usage.

Ensure that each step's code is executable in isolation, and the final code can be constructed by combining all the steps. Include function definitions, return statements, and proper use of Python syntax.

For example, for the question "How to implement a function to add two numbers in Python?":
{
  "question": "How to implement a function to add two numbers in Python?",
  "id": "unique-id-123",
  "steps": [
    {
      "step_id": 1,
      "step_title": "Define the function",
      "code": "def add_two_numbers(num1, num2):",
      "desired_output": "",
      "hint": "Start by defining the function with parameters for the numbers.",
      "keywords": [
        {"keyword": "def", "description": "Keyword to define a function in Python."}
      ]
    },
    {
      "step_id": 2,
      "step_title": "Add the numbers and return",
      "code": "  return num1 + num2",
      "desired_output": "",
      "hint": "Perform the addition of the two parameters and return the result.",
      "keywords": [
        {"keyword": "return", "description": "Used to return a value from a function."},
        {"keyword": "+", "description": "Addition operator."}
      ]
    },
    {
      "step_id": 3,
      "step_title": "Add a test case",
      "code": "print(add_two_numbers(5, 3))",
      "desired_output": "Prints the sum of the numbers.",
      "hint": "Add a test case to check if the function works correctly.",
      "keywords": [
        {"keyword": "print", "description": "Function used to output data to the console."}
      ]
    }
  ],
  "language": "Python"
}
  Now generate for {{QUESTION}}  
`,
};

app.post("/authAdmin", async (req, res) => {
  try {
    const { adminName, password } = req.body;
    const data = await adminLogin.findOne({
      adminName: adminName,
    });
    console.log(adminName, password);
    if (password !== data.password) return;
    if (data) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false });
    }
  } catch (e) {
    console.log("not");
  }
});

app.post("/uploadQuestion", async (req, res) => {
  try {
    const { question, lang } = req.body;

    // Assuming you want to store the question and language in a database.
    const data = await postQuestion.create({ question, language: lang });
    return res.json({ data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server Error" });
  }
});
app.get("/getQuestions", async (req, res) => {
  try {
    const data = await postQuestion.find();
    res.json({ questions: data });
  } catch (e) {}
});

// console.log(prompts);
app.post("/generate-code", async (req, res) => {
  const { prompt, language } = req.body;

  // Basic validation
  if (
    !prompt ||
    typeof prompt !== "string" ||
    !language ||
    typeof language !== "string"
  ) {
    return res.status(400).json({
      error:
        "Invalid input. 'prompt' and 'language' must be provided and should be strings.",
    });
  }

  // Check if the language is supported
  const supportedLanguages = ["javascript", "cpp", "c", "java", "python"];
  if (!supportedLanguages.includes(language.toLowerCase())) {
    return res.status(400).json({ error: "Unsupported language" });
  }

  // Get the correct prompt based on the language
  const promptTemplate = prompts[language.toLowerCase()];
  if (!promptTemplate) {
    return res
      .status(500)
      .json({ error: "Prompt template not found for the specified language." });
  }
  const finalPrompt = promptTemplate.replace("{{QUESTION}}", prompt);
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    const result = await chatSession.sendMessage(finalPrompt);
    let generatedCode = result.response.text();
    // Clean the response
    generatedCode = generatedCode
      .replace(/```json/g, "") // Remove opening ```json
      .replace(/```/g, "") // Remove closing ```
      .trim(); // Remove leading and trailing whitespace

    // Optional: Remove extraneous quotes if needed
    generatedCode = generatedCode
      .replace(/^"+|"+$/g, "") // Remove leading and trailing quotes
      .trim();
    generatedCode = JSON.parse(generatedCode);
    // console.log(generatedCode);
    res.json({ code: generatedCode });
  } catch (error) {
    console.error("Error generating code:", error);
    res.status(500).json({ error: "Error generating code" });
  }
});

app.post("/parseCode", async (req, res) => {
  let { response, code, currentStep } = req.body;

  // Get the current step's prompt and expected structure
  const currentStepDetails = response.code.steps[currentStep];

  // Build the structured prompt for Gemini
  const structuredPrompt = `
Here is the context and question for a coding exercise:

Language: "${response.code.language}"
Question: "${response.code.question}"

Current Step (${currentStep + 1}): "${currentStepDetails.step_title}"

Keywords for this step: ${currentStepDetails.keywords
    .map((kw) => kw.keyword)
    .join(", ")}

User's Code for this step:
${code}

Please evaluate the user's code for the current step in the specified language and return feedback in the following structured JSON format:

{
  "feedback": "Provide detailed feedback about the correctness and quality of the user's code, including any issues related to logic, syntax, or code structure.",
  "hints": ["Hint 1", "Hint 2"], // Provide at most two hints that focus on the major bottlenecks or errors in the code, if any.
  "isCorrect": true/false, // Indicate if the user's code is correct for this step.
  "nextStep": "Provide guidance for the next step, or an empty string if the current step is completed."
}

The evaluation should consider:
1. The programming language and its conventions.
2. Syntax correctness and adherence to the language's rules.
3. The logic and overall structure of the code provided by the user.

### Full process details:
{
  "language": "${response.code.language}",
  "question": "${response.code.question}",
  "steps": [
    ${response.code.steps
      .map(
        (step, index) => `
    {
      "step_id": ${step.step_id},
      "step_title": "${step.step_title}",
      "step_description": "${step.step_description}",
      "step_keywords": "${step.keywords.map((kw) => kw.keyword).join(", ")}",
      "step_hint": "${step.hint || "None"}"
    }${index < response.code.steps.length - 1 ? "," : ""}
    `
      )
      .join("")}
  ]
}

Note: We are currently at step ${currentStep +
    1}. Evaluate the user's code with this context in mind and provide the structured JSON response accordingly.
`;

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(structuredPrompt);
    let structuredResponse = result.response.text();

    // Clean and parse the JSON response
    structuredResponse = structuredResponse
      .replace(/```json/g, "") // Remove code block markers
      .replace(/```/g, "")
      .trim();

    structuredResponse = JSON.parse(structuredResponse);
    // console.log({ ...structuredResponse, ...response, code, currentStep });
    let resp = {
      structuredResponse,
      response,
      code,
      currentStep,
    };
    // console.log(structuredPrompt);
    // console.log(structuredResponse);
    // console.log(resp.structuredResponse.isCorrect);
    // console.log(code, currentStep);
    res.json({ structuredResponse });
  } catch (error) {
    console.error("Error parsing code:", error);
    res.status(500).json({ error: "Error evaluating the code" });
  }
});

const diagramPrompts = {
  mermaid: `Generate a Mermaid diagram based on the following prompt: {{PROMPT}}. The diagram should be in Mermaid syntax. Give me only the Mermaid diagram with semicolons at the end of every line as output, no other text. The diagram should be a single graph without subgraphs. Make is so that its not very wide`,
};

// Endpoint to generate diagrams based on the prompt
app.post("/generate-diagram", async (req, res) => {
  const { prompt } = req.body;

  // Basic validation
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({
      error: "Invalid input. 'prompt' must be provided and should be a string.",
    });
  }

  // Get the Mermaid prompt template
  const promptTemplate = diagramPrompts.mermaid;
  if (!promptTemplate) {
    return res.status(500).json({
      error: "Prompt template for diagrams not found.",
    });
  }

  const finalPrompt = promptTemplate.replace("{{PROMPT}}", prompt);
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    const result = await chatSession.sendMessage(finalPrompt);
    let generatedDiagram = result.response.text();
    // Clean the response if needed
    generatedDiagram = generatedDiagram.trim();
    if (generatedDiagram.startsWith("```mermaid")) {
      generatedDiagram = generatedDiagram.slice(10, -3);
    }
    //slice(10, -3)
    // Return the diagram content
    console.log(generatedDiagram);
    res.json({ diagram: generatedDiagram });
  } catch (error) {
    console.error("Error generating diagram:", error);
    res.status(500).json({ error: "Error generating diagram" });
  }
});
const hintPromptTemplate = `
Given the following steps, provide a hint for each step. The hints should help clarify the step without giving away the solution directly.

Steps:
{{STEPS}}

Hints:
`;

// Endpoint to generate hints based on the steps
app.post("/generate-hints", async (req, res) => {
  const { steps } = req.body;

  // Basic validation
  if (!Array.isArray(steps) || steps.length === 0) {
    return res.status(400).json({
      error: "Invalid input. 'steps' must be provided as a non-empty array.",
    });
  }

  // Construct the prompt with steps
  const stepsText = steps
    .map((step, index) => `Step ${index + 1}: ${step}`)
    .join("\n");
  const finalPrompt = hintPromptTemplate.replace("{{STEPS}}", stepsText);

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    const result = await chatSession.sendMessage(finalPrompt);
    let generatedHints = result.response.text();
    // Clean the response if needed
    generatedHints = generatedHints.trim();

    // Return the hints
    res.json({ hints: generatedHints });
  } catch (error) {
    console.error("Error generating hints:", error);
    res.status(500).json({ error: "Error generating hints" });
  }
});
app.post("/generate-references", async (req, res) => {
  const { project } = req.body;

  // Basic validation
  if (!project || typeof project !== "string") {
    return res.status(400).json({
      error:
        "Invalid input. 'project' and 'references' must be provided and should be strings.",
    });
  }

  // Construct the prompt for the AI model
  const prompt = `Given the project titled "${project}" where according to the project provide references like websites or youtube channels along with playlists revelant to the project mentioned (limit it to 3 to 4 references and make thoer description short).`;

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    // Generate recommendations
    const result = await chatSession.sendMessage(prompt);
    let recommendedReferences = result.response.text();

    // Clean the response if needed
    recommendedReferences = recommendedReferences.trim();

    // Return the recommended references
    res.json({ recommendedReferences });
  } catch (error) {
    console.error("Error generating references:", error);
    res.status(500).json({ error: "Error generating references" });
  }
});
app.post("/generate-errors", async (req, res) => {
  const { project } = req.body;

  // Basic validation
  if (!project || typeof project !== "string") {
    return res.status(400).json({
      error: "Invalid input. 'project' must be provided as a non-empty string.",
    });
  }

  // Construct the prompt using the project description
  const finalPrompt = `The following is a project description:\n"${project}"\n\nPlease provide a list of common errors or issues that might occur in this type of project, and explain each briefly also add syntax errors faced. Keep the list concise.`;

  try {
    const chatSession = model.startChat({
      generationConfig: {
        ...generationConfig,
        // Limit the response length to keep errors concise
      },
      history: [],
    });

    const result = await chatSession.sendMessage(finalPrompt);
    let generatedErrors = result.response.text();

    // Clean the response if needed
    generatedErrors = generatedErrors.trim();

    // Return the popular errors
    res.json({ errors: generatedErrors });
  } catch (error) {
    console.error("Error generating errors:", error);
    res.status(500).json({ error: "Error generating popular errors" });
  }
});

const roadmapPrompt = `
Generate a detailed roadmap for the project topic mentioned below. Mention Tech Stack. Give me steps to learn and complete building the project.

Topic:
{{title}}
`;

app.post("/generate-roadmap", async (req, res) => {
  const { topic } = req.body;
  const finalPrompt = roadmapPrompt.replace("{{title}}", topic);
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    const result = await chatSession.sendMessage(finalPrompt);
    let roadmap = result.response.text();
    roadmap = roadmap.trim();
    res.json({ result: roadmap });
  } catch (error) {
    console.error("Error generating roadmap:", error);
    res.status(500).json({ error: "Error generating roadmap" });
  }
});

// const quizRouter = require('routes/quiz');
// app.use('/quiz', quizRouter);

const quizPrompt = `Generate 10 questions in JSON format mentioned below related to topic mentioned below. Do not return anything else. Keep the answers short.
JSON format:
{
  "questions": [
    {
      "id": 1,
      "prompt": "What is the purpose of the let keyword in JavaScript?",
      "answers": [
        { "text": "Declare a variable with block scope", "correct": true },
        { "text": "Declare a global variable", "correct": false },
        { "text": "Define a function", "correct": false }
      ]
    },
    // ... more questions
  ]
}
Topic:
{{topic}}
`;

app.post("/quiz/generate", async (req, res) => {
  const { topic } = req.body;
  const finalPrompt = quizPrompt.replace("{{topic}}", topic);
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    const result = await chatSession.sendMessage(finalPrompt);
    let quiz = result.response.text();
    quiz = quiz
      .trim()
      .replace(/```json/g, "")
      .replace(/```/g, "");
    res.json(quiz);
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ error: "Error generating quiz" });
  }
});

const approachPrompt = `Task: Provide a comprehensive response to a given coding question, outlining multiple approaches, code examples, and explanations for each. Do not return anything except JSON.

Output Format: JSON

JSON Structure:
{
  "question": "Reverse a linked list",
  "approaches": [
    {
      "name": "Iterative Approach",
      "description": "Iterate through the linked list, keeping track of the previous and current nodes.",
      "complexity": "Time complexity: O(n), Space complexity: O(1)"
    },
    {
      "name": "Recursive Approach",
      "description": "Recursively reverse the linked list, starting from the tail.",
      "complexity": "Time complexity: O(n), Space complexity: O(n) due to recursion"
    }
  ],
  "optimalSolution": 0 
}

Topic:
{{topic}}
`;

app.post("/detaila", async (req, res) => {
  const { topic } = req.body;
  const finalPrompt = approachPrompt.replace("{{topic}}", topic);
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    const result = await chatSession.sendMessage(finalPrompt);
    let quiz = result.response.text();
    quiz = quiz
      .trim()
      .replace(/```json/g, "")
      .replace(/```/g, "");
    res.json(quiz);
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).json({ error: "Error generating quiz" });
  }
});

app.post("/execute", (req, res) => {
  const { code } = req.body;
  const code2 = code.replace(/"/g, "'");
  exec(`node -e "${code2}"`, (error, stdout, stderr) => {
    if (error) {
      return res.json({ output: "Error" });
    }
    data = { output: stdout };
    console.log(data);
    res.json(data);
  });
});

const evalPrompt = `You are an expert programming evaluator. Your task is to assess a given program based on two criteria:
1. How effectively it solves the stated problem
2. The time spent developing the solution

You will be provided with the following information:
1. A problem statement
2. The submitted program code
3. The time spent (in seconds) on developing the solution

Evaluate the program and assign a score out of 10, where:
- 0 represents a completely incorrect or non-functional solution
- 5 represents a partially correct solution or one with significant room for improvement
- 10 represents a perfect solution achieved in an impressively short time

Consider the following in your evaluation:
- Correctness: Does the program solve the stated problem accurately?
- Efficiency: Is the solution optimized, or are there obvious inefficiencies?
- Readability: Is the code well-structured and easy to understand?
- Time spent: Is the time spent reasonable for the complexity of the problem?

Provide your evaluation score as a JSON object in the following format:
{
  "score": X
}

Where X is your score from 0 to 10, rounded to one decimal place. Give score 10 for perfect program code

Example input:
Problem statement:{{question}}
Program code:
{{code}}
Time spent: {{time}} seconds

Your task is to evaluate the given program based on the criteria mentioned above and return a score out of 10 in the specified JSON format. Do to not return anything else.
`;

app.post("/evaluate", async (req, res) => {
  const { question, code, time } = req.body;
  const finalPrompt = evalPrompt
    .replace("{{question}}", question)
    .replace("{{code}}", code)
    .replace("{{time}}", time);

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    const result = await chatSession.sendMessage(finalPrompt);
    let data = result.response.text();
    data = data
      .trim()
      .replace(/```json/g, "")
      .replace(/```/g, "");
    res.json(data);
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.json({ score: 0 });
  }
});

let key =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImtqbVlNWThEV2VOU1lKZmZSSjFXNSJ9.eyJnaXZlbl9uYW1lIjoiQTQxNF9ESVBFU0giLCJmYW1pbHlfbmFtZSI6Ik1JU0hSQSIsIm5pY2tuYW1lIjoiZGlwZXNoMjJpdCIsIm5hbWUiOiJBNDE0X0RJUEVTSCBNSVNIUkEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSVJkVlNOcldhNEgxTXVyTjRIT3dWV1lzZ0FYUDVZX3JpOWprRU9yUmMyYUhIeHV3PXM5Ni1jIiwidXBkYXRlZF9hdCI6IjIwMjQtMDktMjlUMTE6MzM6NTkuMTAwWiIsImVtYWlsIjoiZGlwZXNoMjJpdEBzdHVkZW50Lm1lcy5hYy5pbiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2F1dGgub3JrZXMuaW8vIiwiYXVkIjoiRE1MWU15NUdUMzZRak5Qb3dFTHM5alg2YXNVSVEwaEkiLCJpYXQiOjE3Mjc2MjQxMDQsImV4cCI6MTcyNzY2MDEwNCwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDMwNzAxODU4OTkxMDg2NzQxNTQiLCJzaWQiOiJIU0JTQUFTVUk4NVpqTk1McXpHY0R5VW85Rl9kVDVsMiIsIm5vbmNlIjoiYkhSTGVHeCtaRGwxTmpGNE1EVXhNVEJHWlVkcFVuRk9iemRCUjA4eE1YVmpNSFZoVkZSTFRXUm5Zdz09In0.OXmxjwgqDAp-JCPN6IUVUJngZvuA5xUWq3fdn0SXCRgg1770AJ3wEMcTsb7fe5OGZLd7vgD79gkT_kGhFKyb4U8z4qtAxH0eCKYHSZVJz3gXVCLWyj_dsdj8XEuy4SxR66EChUHqWhjGla0eC96FFrjO4QSjq7qtQz_Ld-nVlmu7A5dV4siIoErA4gWY684JlAY8w_WbzOr0ZztnqXfI20Lpzu-LyfRxxSpZjZGNJhbmGX2bPQ68E8Kq4Or-Q60Yga3TJYJ1sW96Yd-eekNbX2LT2pUiOsP4_JBIsUC5lO9ZiObKBe1kkKOEkZ5cGJJlOu106PbEtEtVktlcnm0mDg";
app.post("/", async (req, res) => {
  const { data } = await axios.post(
    "https://45ccf-ap-southeast.orkesconductor.io/api/workflow/NewWorkflow_aonlb",
    req.body,
    {
      headers: {
        accept: "text/plain",
        "X-Authorization": key,
        "Content-Type": "application/json",
      },
    }
  );
  res.send(data);
});

// server.js



// Define the Groq API URL
// Load the API key from .env

// Middleware to parse JSON request bodies
// Example endpoint to handle Groq request
const groq = new Groq({ groqKey: process.env.GROQ_API_KEY });

app.post('/generate-ai-response', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Use Groq SDK to generate a chat completion based on the provided prompt
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'mixtral-8x7b-32768', // You can replace this with your specific model
    });

    // Extract the AI response from the API response
    const aiResponse = response.choices[0]?.message?.content || 'No response generated';

    // Send the AI response back to the client
    res.json({ aiResponse });

  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ error: 'An error occurred while generating the response' });
  }
});

app.get('/',(req,res)=>{res.send("Samarthan")})

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
