require('dotenv').config();
const express = require('express');
const multer  = require('multer');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app  = express();
const port = process.env.PORT || 3000;

// Store image in memory (not disk)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Serve static files from this directory
app.use(express.static(__dirname));

// ── POST /generate ──────────────────────────────────────────────
app.post('/generate', upload.single('screenshot'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded.' });
  }

  const imageBase64   = req.file.buffer.toString('base64');
  const imageMediaType = req.file.mimetype || 'image/jpeg';

  const prompt = `You are a helpful reply assistant. Look at the screenshot of a message (email, text, DM, etc.) and write THREE different reply options.

Return ONLY a JSON object — no markdown, no code blocks, no extra text:
{
  "friendly": "A warm, casual, friendly reply — natural language, emojis if appropriate, feels personal and kind",
  "professional": "A polished, clear, respectful professional reply — appropriate for work or formal situations",
  "mirror": "A reply that matches the sender's own tone, style, energy, and vocabulary exactly — brief if they were brief, emoji if they used emoji, formal if they were formal"
}`;

  try {
    const response = await anthropic.messages.create({
      model:      'claude-opus-4-6',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: [
          {
            type:   'image',
            source: { type: 'base64', media_type: imageMediaType, data: imageBase64 }
          },
          { type: 'text', text: prompt }
        ]
      }]
    });

    const raw = response.content?.[0]?.text || '';

    // Try to parse JSON robustly
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const m = raw.match(/\{[\s\S]*\}/);
      if (m) parsed = JSON.parse(m[0]);
      else throw new Error('AI returned unexpected format. Please try again.');
    }

    res.json({
      friendly:     parsed.friendly     || '',
      professional: parsed.professional || '',
      mirror:       parsed.mirror       || ''
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Something went wrong. Please try again.' });
  }
});

app.listen(port, () => {
  console.log(`\n✨ Reply Smart running at http://localhost:${port}/reply-smart.html\n`);
});
