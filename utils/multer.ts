import multer from 'multer';
import slugify from 'slugify';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subFolderName = req.url.slice(1).split(/[/?]/)[1];
    cb(null, `uploads/${subFolderName}`);
  },
  filename: (req, file, cb) => {
    const fileFor = req.query.for || 'file';
    const timestamp = Date.now();
    // Split the filename into base and extension
    const originalName = file.originalname;
    const [baseName, ext] =
      originalName.split('.').length > 1
        ? [
            originalName.slice(0, originalName.lastIndexOf('.')),
            originalName.slice(originalName.lastIndexOf('.')),
          ]
        : [originalName, ''];

    const sanitizeFilename = (baseName: string, ext: string) => {
      // Generate a slug with slugify for the base name
      const sanitizedBaseName = slugify(baseName || 'image', {
        replacement: '_', // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: true, // strip special characters except replacement, defaults to `false`
        trim: true, // trim leading and trailing replacement chars, defaults to `true`
      });
      return sanitizedBaseName + ext;
    };

    const uploadingFileName = `${fileFor}-${timestamp}-${sanitizeFilename(baseName, ext)}`;

    cb(null, uploadingFileName);
  },
});

// const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
//   // Accept image files only
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//     cb(null, true);
//   } else {
//     cb(new Error('Unsupported file type'));
//   }
// };

export const uploadFile = multer({
  storage,
  // fileFilter,
});
