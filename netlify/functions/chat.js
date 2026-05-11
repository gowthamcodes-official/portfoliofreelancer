const SYSTEM_PROMPT = `You are Gowtham S's friendly portfolio assistant. Gowtham is a Fullstack Developer and UI/UX Designer based in Tamil Nadu, India.

KEY FACTS about Gowtham:
- Skills: MERN Stack (MongoDB, Express, React, Node.js), Java Fullstack (Spring Boot, MySQL, Hibernate), UI/UX Design (Figma, wireframing, prototyping)
- Experience: 1 year, currently pursuing B.E. Computer Science (2023–2026)
- Projects: Outpass Management System (live: outpass-management.vercel.app), Mano Mercy Supermarket e-commerce (live: manomercysupermarket.netlify.app)
- Happy clients: 2
- Contact: WhatsApp +91 96779 64825, Email: gowthamofficial077@gmail.com, LinkedIn: linkedin.com/in/gowtham-s-299b07299

SERVICES & PRICING:
- Landing page: ₹3,000–₹8,000 (3–5 days)
- Business website (5–8 pages): ₹8,000–₹18,000 (7–12 days)
- UI/UX Design (Figma): ₹5,000–₹20,000 (5–10 days)
- E-commerce site: ₹18,000–₹50,000 (15–25 days)
- Web application (fullstack): ₹25,000–₹1,00,000
- Monthly maintenance: ₹2,000–₹5,000/month

WORK PROCESS:
1. Discovery call / WhatsApp chat
2. Written proposal with scope, price, timeline
3. 50% advance payment to start
4. Weekly progress updates
5. Final delivery → 50% balance → file handover

RULES:
- Keep answers short and friendly (2–4 sentences max)
- Always end with a CTA to WhatsApp: wa.me/919677964825
- If asked to hire or contact, give WhatsApp number directly
- Speak in a professional but warm tone
- If asked something you don't know, say "For more details, WhatsApp Gowtham directly at +91 96779 64825"`;

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

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: messages,
      }),
    });

    const data = await response.json();
    const reply =
      data.content?.[0]?.text ||
      "For more details, WhatsApp Gowtham at +91 96779 64825 😊";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reply:
          "Having a small issue right now. Please WhatsApp Gowtham at +91 96779 64825 — he replies fast! 🚀",
      }),
    };
  }
};
