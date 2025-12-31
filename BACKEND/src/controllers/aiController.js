import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * @desc    Get AI suggestions for charities
 * @route   POST /api/ai/suggest
 * @access  Public
 */
export const getSuggestions = async (req, res) => {
  try {
    const { location, foodType } = req.body;

    if (!location || !foodType) {
      return res.status(400).json({ success: false, message: "Location and food type are required." });
    }

    // Initialize the Gemini AI model
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Sometimes the library requires 'models/' before the name
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

    // Create a detailed prompt for the AI
    const prompt = `
    You are a helpful assistant that suggests charities, NGOs, or soup kitchens based on the given information.
    Please ensure you stick to the context and do not deviate from it. You are MealMitra AI, a chatbot powered by Gemini 2.5-flash model. You can assist the user in navigating
    the website and answer their questions. MealMitra has the following procedure to allow the user to post a donation or to request a donation: Click on 'Get Started' on the home page and
    the user than will get the option to either donate or receive. If the user chooses to donate, they will be asked to fill a form with the following details: Title, Description, Quantity, Location, and Price.
    After the user has filled the form, they will be asked to click on the 'Post Donation' button. The donation will be posted to the database and the user will be redirected to the home page.
    If the user chooses to receive, they will be asked to fill a form with the following details: Title, Description, Quantity, Location, and Price.
    After the user has filled the form, they will be asked to click on the 'Request Donation' button. The donation will be posted to the database and the user will be redirected to the home page.
    The user can also chat with you, the AI, to answer their questions and help them navigate the website.
    You are to respond to the user's messages in a friendly and helpful manner.
    You are to respond to the user's messages in a friendly and helpful manner. If the user clicks on receive, you will ask them to fill a form with the following details: Title, Description, Quantity, Location, and Price.
    After the user has filled the form, they will be asked to click on the 'Request Donation' button. The donation will be posted to the database and the user will be redirected to the home page.
    If the user clicks on donate, you will ask them to fill a form with the following details: Title, Description, Quantity, Location, and Price.
    After the user has filled the form, they will be asked to click on the 'Post Donation' button. The donation will be posted to the database and the user will be redirected to the home page.
    The user can also chat with you, the AI, to answer their questions and help them navigate the website.
    You are to respond to the user's messages in a friendly and helpful manner.
    You are to respond to the user's messages in a friendly and helpful manner. If the user clicks on receive, you will ask them to fill a form with the following details: Title, Description, Quantity, Location, and Price.
    After the user has filled the form, they will be asked to click on the 'Request Donation' button. The donation will be posted to the database and the user will be redirected to the home page.
      Based on the following information, suggest 3 real or realistic-sounding charities, NGOs, or soup kitchens.
      - City: ${location}
      - Type of surplus food: ${foodType}
      
      The suggestions should be for places that would likely accept a donation of this type of food.
      Please provide the output ONLY in a valid JSON format like this, with no extra text or markdown:
      {
        "suggestions": [
          { "name": "Name of Charity 1", "contact": "+91-XXXXXXXXXX" },
          { "name": "Name of Charity 2", "contact": "+91-XXXXXXXXXX" },
          { "name": "Name of Charity 3", "contact": "+91-XXXXXXXXXX" }
        ]
      }
    `;

    // Generate content using the prompt
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON string from the AI's response
    const suggestions = JSON.parse(text);

    res.status(200).json({ success: true, ...suggestions });

  } catch (error) {
    console.error("Error with Gemini AI:", error);
    res.status(500).json({ success: false, message: "Failed to get AI suggestions. Please try again." });
  }
};

// Add this to MealMitra6-backend-main/src/controllers/aiController.js

// Inside your chatWithAI function in MealMitra6-backend-main/src/controllers/aiController.js

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    console.log("📩 User said:", message);

    if (!message) {
      return res.status(400).json({ success: false, message: "No message provided." });
    }

    // 1. Initialize the AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // 2. Define STRONG system instruction to force MealMitra AI behavior
    const systemInstruction = `You are MealMitra AI, a helpful assistant for the MealMitra food donation platform. 

CRITICAL RULES - YOU MUST FOLLOW THESE STRICTLY:
1. You are MealMitra AI, NOT an LLM, NOT a chatbot trained by Google, NOT Gemini. You are MealMitra AI.
2. NEVER mention that you are an AI, LLM, language model, or that you were trained by Google or any company.
3. NEVER reveal your underlying technology or model name (Gemini, Google, etc.).
4. If asked "who are you" or similar questions, respond: "I am MealMitra AI, your helpful assistant for the MealMitra food donation platform. How can I help you today?"
5. Always stay in character as MealMitra AI - a friendly assistant for food donation services.

YOUR ROLE:
- You help users navigate the MealMitra website
- You assist with food donations and requests
- You answer questions about the platform
- You guide users through the donation/receiving process

PLATFORM PROCEDURE:
- Users can click 'Get Started' on the home page
- They can choose to either 'Donate' or 'Receive'
- For Donate: Users fill a form with Title, Description, Quantity, Location, and Price, then click 'Post Donation'
- For Receive: Users fill a form with Title, Description, Quantity, Location, and Price, then click 'Request Donation'
- After posting, users are redirected to the home page

Always respond in a friendly, helpful manner and stay focused on MealMitra's food donation platform.`;

    // 3. Create model with system instruction - using gemini-pro for Google AI Studio
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction,
      generationConfig: {
        temperature: 0.5, // Lower temperature for more deterministic responses
        topP: 0.8,
        topK: 40,
      }
    });

    console.log("🤖 Asking Gemini...");

    // 4. Create a VERY STRONG reinforced prompt that includes system instruction in the message itself
    // This triple-layer approach ensures the model follows instructions
    const reinforcedPrompt = `[SYSTEM DIRECTIVE] You are MealMitra AI, a helpful assistant for the MealMitra food donation platform. You are NOT an LLM, NOT a chatbot trained by Google, NOT Gemini. You are MealMitra AI. Never mention AI, LLM, language models, Google, or Gemini. Always stay in character as MealMitra AI.

[USER MESSAGE] ${message}

[RESPONSE REQUIREMENT] Respond ONLY as MealMitra AI. Do not mention your underlying technology, training, or that you are an AI. You are MealMitra AI.`;

    // 5. Generate the response - try startChat first, fallback to generateContent
    let text;
    try {
      const chat = model.startChat({
        history: [],
      });
      const result = await chat.sendMessage(reinforcedPrompt);
      text = result.response.text();
    } catch (chatError) {
      // Fallback to generateContent if startChat fails
      console.log("⚠️ Using generateContent fallback...");
      const result = await model.generateContent(reinforcedPrompt);
      text = result.response.text();
    }
    
    // 6. Post-process response to filter out unwanted terms
    const unwantedTerms = [
      /I'm (an|a) (AI|LLM|language model|chatbot)/gi,
      /trained by Google/gi,
      /powered by (Gemini|Google)/gi,
      /I am (an|a) (AI|LLM|language model|chatbot)/gi,
      /(Gemini|Google) (AI|model|LLM)/gi,
      /developed by Google/gi,
      /created by Google/gi,
    ];
    
    // Replace unwanted mentions with MealMitra AI identity
    unwantedTerms.forEach(pattern => {
      text = text.replace(pattern, 'I am MealMitra AI');
    });
    
    // Special handling for "who are you" type questions
    if (message.toLowerCase().includes('who are you') || 
        message.toLowerCase().includes('what are you') ||
        message.toLowerCase().includes('what is your name')) {
      text = "I am MealMitra AI, your helpful assistant for the MealMitra food donation platform. How can I help you today?";
    }
    
    console.log("✅ Gemini replied:", text);
    res.status(200).json({ success: true, reply: text });

  } catch (error) {
    console.error("🔥 CHATBOT ERROR:", error);
    res.status(500).json({ success: false, message: "AI is unavailable right now." });
  }
};

/**
 * @desc    Analyze food image quality using Gemini vision
 * @route   POST /api/ai/analyze-image
 * @access  Public
 */
export const analyzeFoodImage = async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ success: false, message: "Image is required." });
    }

    // Initialize the AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.3, // Lower temperature for more consistent quality assessment
        topP: 0.8,
        topK: 40,
      }
    });

    // Create the prompt for food quality analysis
    const prompt = `Analyze this food image and determine its quality for consumption. 

You must respond with ONLY one of these three exact options (no additional text, no explanations):
1. "Best Quality" - if the food appears fresh, properly prepared, and safe to consume
2. "Good Quality" - if the food appears acceptable but may have minor issues (slightly old but still edible, minor presentation issues, etc.)
3. "Not Consumable" - if the food appears spoiled, moldy, contaminated, unsafe, or clearly unfit for human consumption

Consider factors like:
- Freshness and appearance
- Signs of spoilage or contamination
- Overall safety for consumption
- Visual quality and condition

Respond with ONLY one of the three options: "Best Quality", "Good Quality", or "Not Consumable"`;

    // Convert base64 to the format Gemini expects
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType || "image/jpeg"
      }
    };

    // Generate content with image
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response; // ✅ Added this line
    const text = response.text().trim();    // ✅ Now call .text() on the resolved response

    // Parse the response to ensure it matches one of the three options
    let quality;
    if (text.includes("Best Quality")) {
      quality = "Best Quality";
    } else if (text.includes("Good Quality")) {
      quality = "Good Quality";
    } else if (text.includes("Not Consumable")) {
      quality = "Not Consumable";
    } else {
      // Fallback: if response doesn't match, analyze the sentiment
      const lowerText = text.toLowerCase();
      if (lowerText.includes("best") || lowerText.includes("excellent") || lowerText.includes("fresh")) {
        quality = "Best Quality";
      } else if (lowerText.includes("good") || lowerText.includes("acceptable") || lowerText.includes("okay")) {
        quality = "Good Quality";
      } else {
        quality = "Not Consumable";
      }
    }

    console.log("✅ Image analyzed. Quality:", quality);
    res.status(200).json({ 
      success: true, 
      quality: quality,
      canPost: quality === "Best Quality" || quality === "Good Quality"
    });

  } catch (error) {
    console.error("🔥 IMAGE ANALYSIS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to analyze image. Please try again." });
  }
};