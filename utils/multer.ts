import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH as string);
  },
  filename: (req, file, cb) => {
    const { for: fileFor, id } = req.query;
    const idWithFileCount = `${id}_${req.query.count}`;
    const fileExt = file.mimetype.split('/')[1];

    const originalName = file.originalname;
    let uploadingFileName = '';
    if (originalName === 'no-image') uploadingFileName = originalName;
    else uploadingFileName = `${fileFor}-${idWithFileCount}.${fileExt}`;

    const fileCount = parseInt(req.query.count as string);
    req.query.count = (fileCount + 1).toString();

    cb(null, uploadingFileName);
  },
});

export const uploadFile = multer({
  storage,
});
