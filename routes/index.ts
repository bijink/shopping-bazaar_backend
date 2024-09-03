import { Router } from 'express';
import { checkSchema } from 'express-validator';
import fs from 'fs';
import path from 'path';
import { Base64Image } from '../types/global.type';
import { authenticateJwtToken, authenticateUserRole, validateRequest } from '../utils/middlewares';
import { uploadFile } from '../utils/multer';
import { fileUploadSchema } from '../utils/validationSchemas';
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
  validateRequest(checkSchema(fileUploadSchema[0])),
  (request, response, next) => {
    request.query.count = (0).toString();
    next();
  },
  uploadFile.array('files', 4),
  (request, response) => {
    if (!request.files) return response.status(400).send({ message: 'no file found on request' });
    const fileNames: (string | null)[] = [];
    const reqFiles = request?.files as Express.Multer.File[];
    const reqFilesLength = reqFiles?.length as number;
    if (reqFiles?.length) {
      for (let i = 0; i < reqFilesLength; i++) {
        if (reqFiles[i].filename !== 'no-image') fileNames.push(reqFiles[i].filename);
        else fileNames.push(null);
      }
    }
    response
      .status(201)
      .send({ message: 'file uploaded successfully', files: request.files, filenames: fileNames });
  },
);
// #get-image route
router.get('/get-image/:imageName', (request, response) => {
  const { imageName } = request.params;
  const image = path.join(process.cwd(), 'uploads/image', imageName);
  response.status(200).sendFile(image);
});
// #get-multi-images route
router.post('/get-multi-images', (request, response) => {
  const reqImgs = request.body.images;
  const images: (Base64Image | null | undefined)[] = reqImgs.map((imageName: string | null) => {
    if (imageName) {
      const imagePath = path.join(process.cwd(), 'uploads/image', imageName);
      if (fs.existsSync(imagePath)) {
        const fileData = fs.readFileSync(imagePath);
        return {
          name: imageName,
          data: fileData.toString('base64'),
          mimeType: imageName.split('.')[1],
        };
      }
    } else return null;
  });
  response.status(200).json({ images });
});
// #delete-image route
router.delete('/delete-image', authenticateJwtToken, (request, response) => {
  const reqFileNames = request.body as string[];
  async function deleteFiles(files: string[]) {
    try {
      await Promise.all(files.map((file) => fs.promises.unlink(`uploads/image/${file}`)));
      response.status(200).send({ message: 'all files deleted successfully' });
    } catch (err) {
      response.status(404).send(err);
    }
  }
  deleteFiles(reqFileNames);
});
// #other routes
router.use('/auth', AuthRoutes);
router.use('/user', authenticateJwtToken, UserRoutes);
router.use('/admin', authenticateJwtToken, authenticateUserRole('admin'), AdminRoutes);
router.use('/customer', authenticateJwtToken, authenticateUserRole('customer'), CustomerRoutes);

export default router;
