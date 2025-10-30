import express from 'express';
import auth from '../middleware/auth.js';
const router = express.Router();
router.use(auth);
router.get('/', (req,res) => res.json(req.user));
router.put('/', async (req,res) => {
  try{
    const { name } = req.body;
    req.user.name = name ?? req.user.name;
    await req.user.save();
    res.json(req.user);
  }catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }) }
});
export default router;
