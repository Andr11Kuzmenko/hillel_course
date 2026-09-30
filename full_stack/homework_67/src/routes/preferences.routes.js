import { Router } from 'express';
import {
  getPreferences,
  setThemeByParam,
  setThemeByBody,
  resetPreferences,
} from '../controllers/preferences.controller.js';

const router = Router();

router.get('/', getPreferences);
router.delete('/', resetPreferences);
router.get('/theme/:theme', setThemeByParam);
router.post('/theme', setThemeByBody);

export default router;
