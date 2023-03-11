import fs from "fs/promises";

/**
 * path で渡したディレクトリ内のファイルリストを返す
 * @param path
 * @returns File[]
 */
export const getFileList = async (path) => {
  return (await fs.readdir(path, { withFileTypes: true })).filter((dirent) =>
    dirent.isFile()
  );
};
