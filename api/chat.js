const SYSTEM_PROMPT = `You are Gowtham S's friendly portfolio assistant. Gowtham is a Fullstack Developer and UI/UX Designer based in Tamil Nadu, India.

KEY FACTS about Gowtham:
- Skills: MERN Stack (MongoDB, Express, React, Node.js), Java Fullstack (Spring Boot, MySQL, Hibernate), UI/UX Design (Figma, wireframing, prototyping)
- Experience: 1 year, currently pursuing B.E. Computer Science (2023–2026)
- Projects: Outpass Management System (live: outpass-management.vercel.app), Mano Mercy Supermarket e-commerce (live: manomercysupermarket.netlify.app)
- Happy clients: 2
- Contact: WhatsApp +91 96779 64825, Email: gowthamofficial077@gmail.com

SERVICES & PRICING:
- Landing page: Rs.3,000 to Rs.8,000 (3-5 days)
- Business website: Rs.8,000 to Rs.18,000 (7-12 days)
- UI/UX Design: Rs.5,000 to Rs.20,000 (5-10 days)
- E-commerce: Rs.18,000 to Rs.50,000 (15-25 days)
- Web app: Rs.25,000 to Rs.1,00,000
- Maintenance: Rs.2,000 to Rs.5,000/month

RULES:
- Keep answers short, 2-4 sentences max
- Always end with WhatsApp CTA: +91 96779 64825
- Professional but warm tone`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { messages } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

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
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: geminiContents,
          generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
        }),
      }
    );

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "For more details, WhatsApp Gowtham at +91 96779 64825!";

    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(200).json({
      reply: "Having a small issue. WhatsApp Gowtham at +91 96779 64825!",
    });
  }
}