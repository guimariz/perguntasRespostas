const express = require('express');
const app = express();
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');

connection
  .authenticate()
  .then(() => {
    console.log('Conexão feita com o banco de dados!');
  })
  .catch((error) => {
    console.log(error);
  });

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  Pergunta.findAll({ raw: true, order: [['id', 'DESC']] }).then((i) => {
    res.render('index', {
      perguntas: i,
    });
  });
});

app.get('/perguntar', (req, res) => {
  res.render('perguntar');
});

app.post('/salvarpergunta', (req, res) => {
  let titulo = req.body.titulo;
  let descricao = req.body.descricao;

  Pergunta.create({
    titulo,
    descricao,
  }).then(() => {
    res.redirect('/');
  });
});

app.get('/pergunta/:id', (req, res) => {
  let id = req.params.id;
  Pergunta.findOne({ where: { id } }).then((i) => {
    if (i != undefined) {
      Resposta.findAll({
        where: { perguntaId: i.id },
        order: [['id', 'DESC']],
      }).then((j) => {
        res.render('pergunta', {
          pergunta: i,
          respostas: j,
        });
      });
    } else {
      res.redirect('/');
    }
  });
});

app.post('/responder', (req, res) => {
  let corpo = req.body.corpo;
  let perguntaId = req.body.pergunta;

  Resposta.create({
    corpo,
    perguntaId,
  }).then(() => {
    res.redirect('/pergunta/' + perguntaId);
  });
});

app.listen(8080, () => {
  console.log('8080 listenning...');
});
