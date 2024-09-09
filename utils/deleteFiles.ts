import fs from 'fs';

export async function deleteFiles(files: string[]) {
  try {
    await Promise.all(files.map((file) => !!file && fs.promises.unlink(`uploads/image/${file}`)));
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
}
