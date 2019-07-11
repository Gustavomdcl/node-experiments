import multer from 'multer';
import crypto from 'crypto'; // biblioteca do próprio node (gerar caracteres aleatórios)
import { extname, resolve } from 'path'; // biblioteca do próprio node

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      // Controla o nome da imagem (para não duplicar, etc...)
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname)); // dfsdfs.png
      });
    },
  }),
};
