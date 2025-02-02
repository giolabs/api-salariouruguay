import { Router } from 'express';
import { SalaryController } from '../controllers/salaryController';
import { calculateSalaryValidations } from '../middlewares/salaryValidations';

const router = Router();

router.post('/salary/calculate', calculateSalaryValidations, SalaryController.calculateSalary);
router.get('/salary/information', SalaryController.getInformation);
export default router; 