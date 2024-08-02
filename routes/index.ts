import { Router } from 'express';
import AdminRoutes from './admin.routes';
import UserRoutes from './user.routes';

const router = Router();

router.get('/', (req, res) => {
  res.send('Welcome to "Shopping Bazaar" e-commerce web application api server');
});

router.use('/api/v1/user', UserRoutes);
router.use('/api/v1/admin', AdminRoutes);

export default router;
