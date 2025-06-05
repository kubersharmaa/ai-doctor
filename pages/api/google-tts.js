import textToSpeech from "@google-cloud/text-to-speech";

const client = new textToSpeech.TextToSpeechClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { text } = req.body;

  const request = {
    input: { text },
    voice: {
      languageCode: "hi-IN",
      name: "hi-IN-Chirp3-HD-Enceladus", // Male voice
    },
    audioConfig: {
      audioEncoding: "MP3",
    },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);

    res.status(200).json({
      audioContent: response.audioContent.toString("base64"),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "TTS generation failed." });
  }
}
