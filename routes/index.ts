import { Router } from 'express';
import AdminRoutes from './admin.routes';
import AuthRoutes from './auth.routes';
import CustomerRoutes from './customer.routes';

const router = Router();

router.get('/', (req, res) => {
  res.send('Welcome to "Shopping Bazaar" e-commerce web application api server');
});

router.use('/auth', AuthRoutes);
router.use('/customer', CustomerRoutes);
router.use('/admin', AdminRoutes);

export default router;
