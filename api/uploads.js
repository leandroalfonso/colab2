const { createReadStream } = require('fs');
const { join } = require('path');

module.exports = (req, res) => {
  const fileName = req.query.fileName;
  const filePath = join(process.cwd(), 'uploads', fileName);
  const readStream = createReadStream(filePath);

  readStream.on('open', () => {
    readStream.pipe(res);
  });

  readStream.on('error', (error) => {
    res.status(404).json({ message: 'Arquivo não encontrado' });
  });
};
