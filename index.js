const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const connection = mysql.createConnection({
  host: 'bcjyxukjdqqjhqx76bgm-mysql.services.clever-cloud.com',
  user: 'uyt8bi4ddv4t8iut',
  password: 'V0V1t4auMVENQN1CLrAc',
  database: 'bcjyxukjdqqjhqx76bgm'
});

app.get('/usuarios', (req, res) => {
  connection.query('SELECT * FROM usuarios', (error, results) => {
    if (error) throw error;

    res.json(results);
  });
});

app.post('/usuarios', upload.single('foto_usuario'), (req, res) => {
  const {
    nome_usuario,
    profissao_usuario,
    endereco_usuario,
    habilidades,
    ajudador,
    preciso_ser_ajudado,
    mora_aonde
  } = req.body;

  const foto_usuario = req.file.filename;

  const query = `INSERT INTO usuarios (nome_usuario, profissao_usuario, endereco_usuario, habilidades, foto_usuario, ajudador, preciso_ser_ajudado, mora_aonde)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [nome_usuario, profissao_usuario, endereco_usuario, habilidades, foto_usuario, ajudador, preciso_ser_ajudado, mora_aonde];

  connection.query(query, values, (error, results) => {
    if (error) throw error;

    res.json({ message: 'Usuário inserido com sucesso!' });
  });
});

app.get('/usuarios/:id', (req, res) => {
  const userId = req.params.id;

  const query = 'SELECT * FROM usuarios WHERE id_usuario = ?';
  connection.query(query, [userId], (error, results) => {
    if (error) throw error;

    if (results.length > 0) {
      const user = results[0];
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

connection.connect(error => {
  if (error) throw error;
  console.log('Conectado ao banco de dados MySQL');
});
