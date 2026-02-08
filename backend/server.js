import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { createAffiliateVideo } from './aiProcessor.js';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.post('/api/create-video', upload.fields([
  { name: 'product' }, { name: 'model' }, { name: 'background' }
]), async (req, res) => {
  try {
    const product = req.files['product'][0].path;
    const model = req.files['model'][0].path;
    const background = req.files['background'][0].path;
    const { script, template } = req.body;

    const videoPath = await createAffiliateVideo(product, model, background, script, 'uploads', template || 'default');
    res.download(videoPath);
  } catch (err) { console.error(err); res.status(500).send('Error generating video'); }
});

app.listen(5000, () => console.log('Backend running on port 5000'));
