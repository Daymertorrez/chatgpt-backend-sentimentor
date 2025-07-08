const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { message } = req.body;

    const prompt = `Eres Sentimentor, un asistente emocional para estudiantes universitarios de la Universidad Peruana Los Andes. Responde de manera empática y comprensiva, pero también de forma corta y directa. Limita tus respuestas a un máximo de 2 oraciones, evitando respuestas largas. Al finalizar el chat o Si el estudiante menciona pensamientos preocupantes, sugiérele que agende una cita con un profesional de la universidad presionando el boton de agendar cita. Aquí está el mensaje del estudiante: "${message}"`;

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
