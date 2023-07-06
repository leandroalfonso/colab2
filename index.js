const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
  host: 'bcjyxukjdqqjhqx76bgm-mysql.services.clever-cloud.com',
  user: 'uyt8bi4ddv4t8iut',
  password: 'V0V1t4auMVENQN1CLrAc',
  database: 'bcjyxukjdqqjhqx76bgm'
});

app.get('/usuarios', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query('SELECT * FROM usuarios');
    connection.release();
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar os usuários.' });
  }
});

app.post('/usuarios', (req, res) => {
  const {
    nome_usuario,
    profissao_usuario,
    endereco_usuario,
    habilidades,
    foto_usuario,
    ajudador,
    preciso_ser_ajudado,
    mora_aonde
  } = req.body;

  const query = `INSERT INTO usuarios (nome_usuario, profissao_usuario, endereco_usuario, habilidades, foto_usuario, ajudador, preciso_ser_ajudado, mora_aonde)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [nome_usuario, profissao_usuario, endereco_usuario, habilidades, foto_usuario, ajudador, preciso_ser_ajudado, mora_aonde];

  connection.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Ocorreu um erro ao inserir o usuário.' });
    }

    res.json({ message: 'Usuário inserido com sucesso!' });
  });
});


app.get('/usuarios/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const connection = await pool.getConnection();
    const query = 'SELECT * FROM usuarios WHERE id_usuario = ?';
    const [results] = await connection.query(query, [userId]);
    connection.release();

    if (results.length > 0) {
      const user = results[0];
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar o usuário.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
