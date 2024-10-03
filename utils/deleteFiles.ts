import fs from 'fs';
import path from 'path';

export async function deleteFiles(files: string[]) {
  try {
    await Promise.all(
      files.map(
        (file) => !!file && fs.promises.unlink(path.join(process.env.UPLOAD_PATH as string, file)),
      ),
    );
    return Promise.resolve({ message: 'files deleted successfully' });
  } catch (err) {
    return Promise.reject({ message: 'failed to delete files', error: err });
  }
}
