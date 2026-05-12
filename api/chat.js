const SYSTEM_PROMPT = `You are Gowtham S's portfolio assistant. Keep answers short (2-4 sentences). Always end with WhatsApp: +91 96779 64825.

Gowtham is a Fullstack Developer and UI/UX Designer in Tamil Nadu.
Skills: MERN Stack, Java Spring Boot, Figma UI/UX
Services: Landing page Rs.3k-8k, Business website Rs.8k-18k, Web app Rs.25k-1L
Contact: WhatsApp +91 96779 64825, Email gowthamofficial077@gmail.com`;

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { messages } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { maxOutputTokens: 200 },
        }),
      }
    );

    const data = await r.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
      || "WhatsApp Gowtham at +91 96779 64825!";

    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(200).json({ reply: "WhatsApp +91 96779 64825!" });
  }
};