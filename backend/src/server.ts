import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import applicationRoutes from './routes/applications';
import resumeRoutes from './routes/resume';

dotenv.config();

const app = express();
const PORT =  5001;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'CareerPilot API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/resume', resumeRoutes);

app.listen(PORT, () => {
  console.log(`CareerPilot backend running on port ${PORT}`);
});
