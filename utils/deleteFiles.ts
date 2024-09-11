import fs from 'fs';

export async function deleteFiles(files: string[]) {
  try {
    await Promise.all(files.map((file) => !!file && fs.promises.unlink(`uploads/image/${file}`)));
    return Promise.resolve({ message: 'files deleted successfully' });
  } catch (err) {
    return Promise.reject({ message: 'failed to delete files', error: err });
  }
}
