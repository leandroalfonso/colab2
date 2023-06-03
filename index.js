const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

// Criar uma instância do Express
const app = express();

// Configuração do middleware
app.use(express.json());
app.use(cors());

// Configuração da conexão com o banco de dados MySQL
const connection = mysql.createConnection({
  host: 'bcjyxukjdqqjhqx76bgm-mysql.services.clever-cloud.com',
  user: 'uyt8bi4ddv4t8iut',
  password: 'V0V1t4auMVENQN1CLrAc',
  database: 'bcjyxukjdqqjhqx76bgm'
});

// Rota de exemplo para realizar uma consulta ao banco de dados
app.get('/usuarios', (req, res) => {
  // Executa uma consulta ao banco de dados
  connection.query('SELECT * FROM usuarios', (error, results) => {
    if (error) throw error;

    // Retorna os resultados da consulta como resposta da API
    res.json(results);
  });
});

// Rota para inserir um novo usuário na tabela
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

  // Executa a consulta SQL para inserir o novo usuário
  const query = `INSERT INTO usuarios (nome_usuario, profissao_usuario, endereco_usuario, habilidades, foto_usuario, ajudador, preciso_ser_ajudado, mora_aonde)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [nome_usuario, profissao_usuario, endereco_usuario, habilidades, foto_usuario, ajudador, preciso_ser_ajudado, mora_aonde];

  connection.query(query, values, (error, results) => {
    if (error) throw error;

    // Retorna uma resposta indicando o sucesso da inserção
    res.json({ message: 'Usuário inserido com sucesso!' });
  });
});


// Rota para obter os detalhes de um usuário específico
app.get('/usuarios/:id', (req, res) => {
    const userId = req.params.id;
  
    // Executa uma consulta ao banco de dados para obter os detalhes do usuário com base no ID
    const query = 'SELECT * FROM usuarios WHERE id_usuario = ?';
    connection.query(query, [userId], (error, results) => {
      if (error) throw error;
  
      // Verifica se o usuário foi encontrado
      if (results.length > 0) {
        const user = results[0];
  
        // Retorna os detalhes do usuário como resposta da API
        res.json(user);
      } else {
        // Retorna uma resposta de erro caso o usuário não seja encontrado
        res.status(404).json({ message: 'Usuário não encontrado' });
      }
    });
  });
  

// Inicia o servidor na porta desejada
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

// Conectar-se ao banco de dados MySQL
connection.connect(error => {
  if (error) throw error;
  console.log('Conectado ao banco de dados MySQL');
});
