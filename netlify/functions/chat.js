const SYSTEM_PROMPT = `You are Gowtham S's friendly portfolio assistant. Gowtham is a Fullstack Developer and UI/UX Designer based in Tamil Nadu, India.

KEY FACTS about Gowtham:
- Skills: MERN Stack (MongoDB, Express, React, Node.js), Java Fullstack (Spring Boot, MySQL, Hibernate), UI/UX Design (Figma, wireframing, prototyping)
- Experience: 1 year, currently pursuing B.E. Computer Science (2023–2026)
- Projects: Outpass Management System (live: outpass-management.vercel.app), Mano Mercy Supermarket e-commerce (live: manomercysupermarket.netlify.app)
- Happy clients: 2
- Contact: WhatsApp +91 96779 64825, Email: gowthamofficial077@gmail.com, LinkedIn: linkedin.com/in/gowtham-s-299b07299

SERVICES & PRICING:
- Landing page: Rs.3,000 to Rs.8,000 (3-5 days)
- Business website 5-8 pages: Rs.8,000 to Rs.18,000 (7-12 days)
- UI/UX Design Figma: Rs.5,000 to Rs.20,000 (5-10 days)
- E-commerce site: Rs.18,000 to Rs.50,000 (15-25 days)
- Web application fullstack: Rs.25,000 to Rs.1,00,000
- Monthly maintenance: Rs.2,000 to Rs.5,000 per month

WORK PROCESS:
1. Discovery call or WhatsApp chat
2. Written proposal with scope, price, timeline
3. 50% advance payment to start
4. Weekly progress updates
5. Final delivery then 50% balance then file handover

RULES:
- Keep answers short and friendly, 2 to 4 sentences max
- Always end with a CTA to WhatsApp: wa.me/919677964825
- If asked to hire or contact, give WhatsApp number directly
- Speak in a professional but warm tone
- If asked something you don't know say: For more details WhatsApp Gowtham directly at +91 96779 64825`;

exports.handler = async function (event) {
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

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { messages } = JSON.parse(event.body);
    const apiKey = process.env.GEMINI_API_KEY;

    console.log("API Key exists:", !!apiKey);
    console.log("Messages count:", messages.length);

    if (!apiKey) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          reply: "API key missing! Please WhatsApp Gowtham at +91 96779 64825",
        }),
      };
    }

    const geminiContents = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents: geminiContents,
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini response status:", response.status);
    console.log("Gemini data:", JSON.stringify(data).slice(0, 200));

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "For more details, WhatsApp Gowtham at +91 96779 64825!";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.log("Error:", err.message);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reply: "Having a small issue. Please WhatsApp Gowtham at +91 96779 64825!",
      }),
    };
  }
};