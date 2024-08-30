import multer from 'multer';
import slugify from 'slugify';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subFolderName = req.url?.slice(1).split(/[/?]/)[1] || 'default';
    cb(null, `uploads/${subFolderName}`);
  },
  filename: (req, file, cb) => {
    const { for: fileFor, id } = req.query;
    const idWithFileCount = `${id}_${req.query.count}`;
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

    let uploadingFileName = '';
    if (originalName === 'no-image') {
      uploadingFileName = originalName;
    } else {
      uploadingFileName = `${fileFor}-${idWithFileCount}-${sanitizeFilename(baseName, ext)}`;
    }
    const fileCount = parseInt(req.query.count as string);
    req.query.count = (fileCount + 1).toString();

    cb(null, uploadingFileName);
  },
});

// const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
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
