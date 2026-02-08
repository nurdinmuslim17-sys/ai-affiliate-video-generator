import path from 'path';
import { spawn } from 'child_process';
import { generateImageWithAI, generateVoiceover, getTemplateAudio } from './aiUtils.js';

export async function createAffiliateVideo(productImg, modelImg, backgroundImg, script, outputDir, template='default') {
    const combinedImg = await generateImageWithAI(productImg, modelImg, backgroundImg);
    const voicePath = await generateVoiceover(script, outputDir);

    const templateAudio = getTemplateAudio(template);
    const audioInputs = [voicePath];
    if (templateAudio) audioInputs.push(templateAudio);

    const audioFilter = audioInputs.length > 1 ? ['-filter_complex', `[0:a][1:a]amix=inputs=${audioInputs.length}:duration=longest`] : [];
    const videoPath = path.join(outputDir, `affiliate_${Date.now()}.mp4`);

    await new Promise((resolve, reject) => {
        const ffmpegArgs = [
            '-loop', '1', '-i', combinedImg,
            ...audioInputs.flatMap(a => ['-i', a]),
            ...audioFilter,
            '-c:v', 'libx264', '-t', '12', '-pix_fmt', 'yuv420p',
            '-vf', 'zoompan=z=\'min(zoom+0.0025,1.2)\':d=125',
            '-c:a', 'aac', videoPath
        ];
        const ffmpeg = spawn('ffmpeg', ffmpegArgs);
        ffmpeg.on('close', resolve);
        ffmpeg.on('error', reject);
    });
    return videoPath;
}
