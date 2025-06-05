// pages/api/ask.js
export default async function handler(req, res) {
  const { message, history, systemPrompt } = req.body;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-6).map((m) => ({ role: m.role, content: m.text })),
  ];

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
    }),
  });

  const data = await openaiRes.json();
  const reply =
    data?.choices?.[0]?.message?.content || "उत्तर देने में त्रुटि हुई।";
  res.status(200).json({ reply });
}
