const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();
app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
  host: 'bcjyxukjdqqjhqx76bgm-mysql.services.clever-cloud.com',
  user: 'uyt8bi4ddv4t8iut',
  password: 'V0V1t4auMVENQN1CLrAc',
  database: 'bcjyxukjdqqjhqx76bgm'
});

// Configuração do Google Drive
const drive = google.drive({
  version: 'v3',
  auth: 'bcf858579c51ac9612d6be40a11dec243d0cd48f' // Substitua pela sua chave de API do Google Drive
});

// Rota POST para inserir usuário
app.post('/usuarios', async (req, res) => {
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

  try {
    // Faz o upload da foto do usuário para o Google Drive
    const fileMetadata = {
      name: 'nome_da_foto.jpg', // Substitua pelo nome desejado para a foto
      parents: ['13UTAugsGM18aht53thXKT_ulmsmxChZs'] // Substitua pelo ID da pasta do Google Drive onde deseja salvar a foto
    };

    const media = {
      mimeType: 'image/jpeg',
      body: fs.createReadStream('uploads') // Substitua pelo caminho para o arquivo de foto no servidor
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    });

    const foto_usuario_google_drive_id = response.data.id;

    // Insere o usuário no banco de dados
    const query = `INSERT INTO usuarios (nome_usuario, profissao_usuario, endereco_usuario, habilidades, foto_usuario, ajudador, preciso_ser_ajudado, mora_aonde)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [nome_usuario, profissao_usuario, endereco_usuario, habilidades, foto_usuario_google_drive_id, ajudador, preciso_ser_ajudado, mora_aonde];

    const connection = await pool.getConnection();
    const [results] = await connection.query(query, values);
    connection.release();

    res.json({ message: 'Usuário inserido com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao inserir o usuário.' });
  }
});

// Restante das rotas...

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
