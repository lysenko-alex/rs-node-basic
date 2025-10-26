const remove = async () => {
  try {
    const fileExists = await checkFileExists(FILE_PATH);
    if (!fileExists) {
      throw new Error(ERROR_MESSAGE);
    }
    await fs.unlink(FILE_PATH);
  } catch (error) {
    throw new Error(error);
  }
};

await remove();
