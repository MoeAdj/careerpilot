import express from 'express';
import multer from 'multer';
import * as pdf from 'pdf-parse';
import { pool } from '../db/pool';
import { AuthRequest, requireAuth } from '../middleware/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import PDFDocument from 'pdfkit';
const router = express.Router();
const upload = multer();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

router.use(requireAuth);

router.post('/upload', upload.single('resume'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF uploaded' });
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
});

router.post('/feedback', async (req: AuthRequest, res) => {
  const { resumeText, jobDescription } = req.body;

  if (!resumeText) {
    return res.status(400).json({
      message: 'Resume text is required'
    });
  }

  let score = 70;
  let finalFeedback = '';

  try {
    const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash'
});

const aiResult = await model.generateContent(`
You are CareerPilot, an expert ATS recruiter, hiring manager, resume reviewer, and software engineering career coach.

Analyze the resume professionally and honestly.

Do not provide generic feedback.

If a job description is provided:
- Compare the resume against the job description.
- Calculate an ATS Match Score.
- Identify missing keywords.
- Identify missing technical skills.
- Explain weaknesses that could prevent an interview.

If no job description is provided:
- Analyze the resume against current software engineering hiring standards.

Return the answer EXACTLY in this format:

ATS SCORE:
[number from 0-100]

JOB MATCH SCORE:
[number from 0-100]

CAREER FIELD:
[field]

EXPERIENCE LEVEL:
[level]

TOP STRENGTHS:
- strength 1
- strength 2
- strength 3
- strength 4

WEAKNESSES:
- weakness 1
- weakness 2
- weakness 3
- weakness 4

MISSING KEYWORDS:
- keyword 1
- keyword 2
- keyword 3
- keyword 4
- keyword 5

SPECIFIC IMPROVEMENTS:
- improvement 1
- improvement 2
- improvement 3
- improvement 4

IMPROVED RESUME BULLETS:
- improved bullet 1
- improved bullet 2
- improved bullet 3
- improved bullet 4
- improved bullet 5

RECOMMENDED NEXT SKILLS:
- skill 1
- skill 2
- skill 3
- skill 4

FINAL ADVICE:
Provide direct professional advice.
Explain what would most improve the candidate's chances of getting interviews.

Resume:
${resumeText}

Job Description:
${jobDescription || 'No job description provided'}
`);

    finalFeedback = aiResult.response.text();
    console.log('GEMINI RESPONSE:');
console.log(finalFeedback);

    const scoreMatch = finalFeedback.match(/ATS SCORE:\s*(\d+)/i);
    if (scoreMatch) {
      score = Number(scoreMatch[1]);
    }
  } catch (error) {
    console.error('Gemini failed:', error);

    finalFeedback =
      'AI resume analysis failed. Please check your GEMINI_API_KEY and try again.';
  }

  const result = await pool.query(
    `INSERT INTO resume_feedback (user_id, resume_text, score, feedback)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [req.userId, resumeText, score, finalFeedback]
  );

  return res.json(result.rows[0]);
});
router.post('/optimize', async (req: AuthRequest, res) => {
  const { resumeText, jobDescription } = req.body;

  if (!resumeText || !jobDescription) {
    return res.status(400).json({
      message: 'Resume text and job description are required'
    });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash'
    });

    const aiResult = await model.generateContent(`
You are CareerPilot, an expert resume writer for all majors and career fields.

Rewrite this resume for the provided job description.

Rules:
- Keep the resume truthful.
- Do not invent fake jobs, fake degrees, fake companies, or fake experience.
- Improve wording and make bullet points stronger.
- Add relevant keywords from the job description only when they match the user's real experience.
- Make it professional and ATS-friendly.
- Work for any major: computer science, business, nursing, engineering, finance, marketing, biology, education, etc.
- Return ONLY the final optimized resume text.
- Do not include explanations.

Resume:
${resumeText}

Job Description:
${jobDescription}
`);

    const optimizedResume = aiResult.response.text();

    const doc = new PDFDocument({
      margin: 50
    });

    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => {
      chunks.push(chunk);
    });

    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="Optimized_Resume.pdf"'
      );

      res.send(pdfBuffer);
    });

    doc.fontSize(20).text('Optimized Resume', {
      align: 'center'
    });

    doc.moveDown();

    doc.fontSize(11).text(optimizedResume, {
      lineGap: 5
    });

    doc.end();
  } catch (error) {
    console.error('OPTIMIZE RESUME ERROR:', error);

    return res.status(500).json({
      message: 'Could not optimize resume'
    });
  }
});
export default router;
