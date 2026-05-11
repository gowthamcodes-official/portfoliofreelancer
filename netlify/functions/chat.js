const SYSTEM_PROMPT = `You are Gowtham S's friendly portfolio assistant. Gowtham is a Fullstack Developer and UI/UX Designer based in Tamil Nadu, India.

KEY FACTS about Gowtham:
- Skills: MERN Stack (MongoDB, Express, React, Node.js), Java Fullstack (Spring Boot, MySQL, Hibernate), UI/UX Design (Figma, wireframing, prototyping)
- Experience: 1 year, currently pursuing B.E. Computer Science (2023–2026)
- Projects:
  - Outpass Management System (live: outpass-management.vercel.app)
  - Mano Mercy Supermarket e-commerce (live: manomercysupermarket.netlify.app)
- Happy clients: 2

CONTACT:
- WhatsApp: +91 96779 64825
- Email: gowthamofficial077@gmail.com
- LinkedIn: linkedin.com/in/gowtham-s-299b07299

SERVICES & PRICING:
- Landing page: Rs.3,000 to Rs.8,000 (3-5 days)
- Business website: Rs.8,000 to Rs.18,000 (7-12 days)
- UI/UX Design: Rs.5,000 to Rs.20,000
- E-commerce site: Rs.18,000 to Rs.50,000
- Fullstack Web App: Rs.25,000 to Rs.1,00,000

RULES:
- Keep replies short and friendly
- Always end with WhatsApp CTA
- Professional and warm tone
`;

exports.handler = async function (event) {

  // CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  // Only POST allowed
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {

    // Parse body
    const { messages } = JSON.parse(event.body);

    // API KEY
    const apiKey = process.env.GEMINI_API_KEY;

    // Convert messages
    const geminiContents = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: msg.content,
        },
      ],
    }));

    // API Request
    const response = await fetch(
     https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: SYSTEM_PROMPT,
              },
            ],
          },

          contents: geminiContents,

          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
          },
        }),
      }
    );

    // Response JSON
    const data = await response.json();

    console.log("Gemini Response:", JSON.stringify(data));

    // Extract Reply
    let reply = "";

    if (
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.length > 0
    ) {

      reply = data.candidates[0].content.parts[0].text;

    } else if (data.error) {

      reply = "Gemini API Error: " + data.error.message;

    } else {

      reply =
        "For more details, WhatsApp Gowtham at +91 96779 64825!";
    }

    // Return response
    return {
      statusCode: 200,

      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },

      body: JSON.stringify({
        reply,
      }),
    };

  } catch (err) {

    console.log("Server Error:", err);

    return {
      statusCode: 500,

      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },

      body: JSON.stringify({
        reply:
          "Having a small issue right now. Please WhatsApp Gowtham at +91 96779 64825 🚀",
      }),
    };
  }
};