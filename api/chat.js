const SYSTEM_PROMPT = `You are Gowtham S's friendly portfolio assistant. Gowtham is a Fullstack Developer and UI/UX Designer based in Tamil Nadu, India.

KEY FACTS:
- Skills: MERN Stack, Java Spring Boot, Figma UI/UX Design
- Experience: 1 year, B.E. Computer Science (2023-2026)
- Projects: Outpass Management System (outpass-management.vercel.app), Mano Mercy Supermarket (manomercysupermarket.netlify.app)
- Happy clients: 2
- Contact: WhatsApp +91 96779 64825, Email gowthamofficial077@gmail.com

SERVICES & PRICING:
- Landing page: Rs.3,000 to Rs.8,000 (3-5 days)
- Business website: Rs.8,000 to Rs.18,000 (7-12 days)
- UI/UX Design: Rs.5,000 to Rs.20,000 (5-10 days)
- E-commerce: Rs.18,000 to Rs.50,000 (15-25 days)
- Web app: Rs.25,000 to Rs.1,00,000
- Maintenance: Rs.2,000 to Rs.5,000/month

WORK PROCESS:
1. WhatsApp chat to discuss requirements
2. Written proposal with scope, price, timeline
3. 50% advance to start
4. Weekly updates
5. Final delivery, balance payment, file handover

RULES:
- Keep answers short and friendly, 2-4 sentences max
- Always end with WhatsApp CTA: +91 96779 64825
- Professional but warm tone`;

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { messages } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content
      || "WhatsApp Gowtham at +91 96779 64825!";

    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(200).json({ reply: "WhatsApp Gowtham at +91 96779 64825!" });
  }
};