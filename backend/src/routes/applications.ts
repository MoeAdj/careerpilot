import express from 'express';
import { pool } from '../db/pool';
import { AuthRequest, requireAuth } from '../middleware/auth';

const router = express.Router();

// Every route in this file is protected because applications belong to a user.
router.use(requireAuth);

// Get all applications for the logged in user.
router.get('/', async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM applications WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    return res.json(result.rows);
  } catch {
    return res.status(500).json({ message: 'Could not load applications' });
  }
});

// Add a new application.
router.post('/', async (req: AuthRequest, res) => {
  const { company, position, status, location, notes, date_applied } = req.body;

  if (!company || !position) {
    return res.status(400).json({ message: 'Company and position are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO applications (user_id, company, position, status, location, notes, date_applied)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.userId, company, position, status || 'Applied', location || '', notes || '', date_applied || new Date()]
    );

    return res.status(201).json(result.rows[0]);
   } catch (error) {
    console.error('ADD APPLICATION ERROR:', error);
    return res.status(500).json({ message: 'Could not add application' });
  }
});

// Update an application status or notes.
router.put('/:id', async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  try {
    const result = await pool.query(
      `UPDATE applications
       SET status = COALESCE($1, status), notes = COALESCE($2, notes)
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [status, notes, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    return res.json(result.rows[0]);
  } catch {
    return res.status(500).json({ message: 'Could not update application' });
  }
});

// Delete an application.
router.delete('/:id', async (req: AuthRequest, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM applications WHERE id = $1 AND user_id = $2', [id, req.userId]);
    return res.json({ message: 'Application deleted' });
  } catch {
    return res.status(500).json({ message: 'Could not delete application' });
  }
});

export default router;
