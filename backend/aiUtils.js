import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateImageWithAI(productImg, modelImg, backgroundImg) {
    const combinedPath = path.join('uploads', `combined_${Date.now()}.png`);
    fs.copyFileSync(productImg, combinedPath);
    return combinedPath;
}

export async function generateVoiceover(text, outputDir) {
    const audioPath = path.join(outputDir, `voice_${Date.now()}.mp3`);
    const response = await openai.audio.speech.create({ model: "gpt-4o-mini-tts", voice: "alloy", input: text });
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(audioPath, buffer);
    return audioPath;
}

export function getTemplateAudio(templateName) {
    const templates = { default: path.join('assets','default_music.mp3'), promo: path.join('assets','promo_music.mp3') };
    return templates[templateName] && fs.existsSync(templates[templateName]) ? templates[templateName] : null;
}
