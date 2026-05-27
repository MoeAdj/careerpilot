import express from 'express';
import multer from 'multer';
import * as pdf from 'pdf-parse';
import { pool } from '../db/pool';
import { AuthRequest, requireAuth } from '../middleware/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);
const upload = multer();

const router = express.Router();




router.use(requireAuth);

// This is a simple resume feedback route.
// Later, this could connect to a real AI API, but for now it gives rule-based feedback.
router.post(
  '/upload',
  upload.single('resume'),
  async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: 'No PDF uploaded'
        });
      }

      const parser = new pdf.PDFParse({
  data: req.file.buffer
});

const data = await parser.getText();

return res.json({
  resumeText: data.text
});

      
    } catch (error) {
  console.error(error);

  return res.status(500).json({
    message: 'Could not read PDF',
    error: String(error)
  });
}
  }
);
router.post('/feedback', async (req: AuthRequest, res) => {
  const { resumeText, jobDescription } = req.body;

  if (!resumeText) {
    return res.status(400).json({ message: 'Resume text is required' });
  }

  const text = resumeText.toLowerCase();
  


  let matchScore = 0;
  const missingKeywords: string[] = [];

if (jobDescription) {
  const keywords = [
  'react',
  'typescript',
  'javascript',
  'python',
  'c++',
  'java',
  'node',
  'express',
  'postgresql',
  'sql',
  'rest',
  'api',
  'apis',
  'git',
  'github',
  'html',
  'css',
  'frontend',
  'backend',
  'full-stack',
  'software engineer',
  'data analysis',
  'visualization',
  'ai'
];

  for (const keyword of keywords) {
    if (jobDescription.toLowerCase().includes(keyword)) {
      if (text.includes(keyword)) {
        matchScore += 10;
      } else {
        missingKeywords.push(keyword);
      }
    }
  }

  matchScore = Math.min(matchScore, 100);
}

let score = 0;
const feedback: string[] = [];

if (text.includes('@')) {
  score += 10;
} else {
  feedback.push('Add a professional email address.');
}

if (text.includes('education')) {
  score += 15;
} else {
  feedback.push('Add an Education section.');
}

if (text.includes('skills')) {
  score += 15;
} else {
  feedback.push('Add a Skills section.');
}

if (text.includes('project') || text.includes('projects')) {
  score += 20;
} else {
  feedback.push('Include projects that demonstrate your abilities.');
}

if (text.includes('experience')) {
  score += 20;
} else {
  feedback.push('Add work, internship, or volunteer experience.');
}

if (text.includes('github')) {
  score += 10;
} else {
  feedback.push('Add your GitHub profile.');
}

if (text.includes('linkedin')) {
  score += 10;
} else {
  feedback.push('Add your LinkedIn profile.');
}

score = Math.min(score, 100);

let finalFeedback =
  `Local Analysis\n\n` +
  `Job Match Score: ${matchScore}%.\n\n` +
  feedback.join(' ') +
  (missingKeywords.length
    ? ` Missing keywords: ${missingKeywords.join(', ')}.`
    : '');

try {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash'
  });

  const aiResult = await model.generateContent(`
You are an expert recruiter and career coach.

Analyze this resume and automatically determine the candidate's field.

Provide:

1. Career Field
2. Experience Level
3. Resume Score (0-100)
4. Top Strengths
5. Top Weaknesses
6. Missing Skills or Keywords
7. Specific Improvements
8. Job Match Score (if a job description is provided)

Resume:
${resumeText}

Job Description:
${jobDescription || 'No job description provided'}
`);

  finalFeedback = aiResult.response.text();
} catch (error) {
  console.error('Gemini failed, using local analyzer:', error);
}
  

  const result = await pool.query(
    'INSERT INTO resume_feedback (user_id, resume_text, score, feedback) VALUES ($1, $2, $3, $4) RETURNING *',
    [req.userId, resumeText, score, finalFeedback]
  );

  return res.json(result.rows[0]);
});

export default router;
