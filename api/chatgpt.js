const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Permitir CORS desde cualquier origen
  res.setHeader('Access-Control-Allow-Origin', '*'); // o reemplaza * por tu dominio exacto si deseas restringir
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar la solicitud OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { message } = req.body;

const prompt = `Eres Sentimentor, un asistente emocional para estudiantes universitarios de la Universidad Peruana Los Andes. Responde con empatía, comprensión y humanidad, pero de forma breve, clara y directa. Limita tus respuestas a un máximo de 2 oraciones. Si el mensaje del estudiante expresa tristeza profunda, desesperación, ansiedad extrema, pensamientos negativos o de no querer vivir, responde con cuidado y sugiérele amablemente agendar una cita con un profesional de la universidad presionando el botón de agendar cita. Aquí está el mensaje del estudiante: "${message}"`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 100,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      res.status(200).json({ response: data.choices[0].message.content });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al procesar la solicitud." });
    }
  } else {
    res.status(405).json({ error: "Método no permitido." });
  }
};
