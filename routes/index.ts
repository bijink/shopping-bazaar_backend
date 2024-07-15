import { Router } from 'express';
import UserRoutes from './user.routes';
import AdminRoutes from './admin.routes';

const router = Router();

router.get('/', (req, res) => {
  res.send('Welcome to "Shopping Bazaar" e-commerce web application api server');
});

router.use('/user', UserRoutes);
// router.use('/admin', AdminRoutes);

export default router;
