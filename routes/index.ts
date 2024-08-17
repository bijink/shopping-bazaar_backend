import { Router } from 'express';
import { authenticateJwtToken } from '../utils/middlewares';
import AdminRoutes from './admin.routes';
import AuthRoutes from './auth.routes';
import CustomerRoutes from './customer.routes';

const router = Router();

router.get('/', (req, res) => {
  res.send('Welcome to "Shopping Bazaar" e-commerce web application api server');
});

router.use('/auth', AuthRoutes);
router.use('/admin', authenticateJwtToken, AdminRoutes);
router.use('/customer', authenticateJwtToken, CustomerRoutes);

export default router;
