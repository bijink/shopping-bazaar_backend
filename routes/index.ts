import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { authenticateJwtToken, authenticateUserRole } from '../utils/middlewares';
import { uploadFile } from '../utils/multer';
import AdminRoutes from './admin.routes';
import AuthRoutes from './auth.routes';
import CustomerRoutes from './customer.routes';
import UserRoutes from './user.routes';

const router = Router();

// #welcome route
router.get('/', (request, response) => {
  response.send('Welcome to "Shopping Bazaar" e-commerce web application api server');
});
// #upload-file route
router.post(
  '/upload-file/image',
  authenticateJwtToken,
  uploadFile.single('file'),
  (request, response) => {
    if (!request.file) return response.status(400).send({ message: 'no file found on request' });
    response.status(201).send({ message: 'file uploaded successfully', file: request.file });
  },
);
// #get-image route
router.get('/get-image/:imageName', (request, response) => {
  const { imageName } = request.params;
  const image = path.join(process.cwd(), 'uploads/image', imageName);
  response.status(200).sendFile(image);
});
// #delete-image route
router.delete('/delete-image/:imageName', authenticateJwtToken, (request, response) => {
  const { imageName } = request.params;
  fs.unlink(`uploads/image/${imageName}`, (err) => {
    if (!err) response.status(200).send({ message: 'file deleted successfully' });
    else response.status(404).send(err);
  });
});
// #other routes
router.use('/auth', AuthRoutes);
router.use('/user', authenticateJwtToken, UserRoutes);
router.use('/admin', authenticateJwtToken, authenticateUserRole('admin'), AdminRoutes);
router.use('/customer', authenticateJwtToken, authenticateUserRole('customer'), CustomerRoutes);

export default router;
