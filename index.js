const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Webhooks dos grupos de chat
const WEBHOOKS = {
  'Suporte Prime': 'https://chat.googleapis.com/v1/spaces/AAQAY2RwRPg/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=z_MMMg5AC4nHeoUFqnU8tLpTiY2p4gjitwZ_PdUxpf8',
  'Suporte Todos': 'https://chat.googleapis.com/v1/spaces/AAAABBBCCCD/messages?key=AIzaSyXXXXXXX&token=YYYYYYYYYYYYYYYYYYYYYYYYYYYY',
};

// Serve arquivos estáticos para PWA
app.use(express.static(path.join(__dirname, 'public')));

// Serve favicon.ico
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'favicon.ico'));
});

// Página HTML profissional
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>TOTVS Fluig Suporte - Priorização de Tickets</title>
      <link rel="manifest" href="/manifest.json">
      <meta name="theme-color" content="#1976d2" />
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css" />
      <style>
        body {
          background: #181c2a;
          font-family: 'Segoe UI', Arial, sans-serif;
          margin: 0;
        }
        .container {
          max-width: 420px;
          margin: 40px auto;
          background: #23263a;
          border-radius: 12px;
          box-shadow: 0 2px 12px #0005;
          padding: 32px;
        }
        h1 {
          color: #0091ea;
          text-align: center;
          margin-bottom: 24px;
          letter-spacing: 1px;
        }
        label {
          font-weight: 500;
          margin-top: 12px;
          display: block;
          color: #fff;
        }
        input, textarea, select {
          width: 100%;
          margin: 8px 0 16px 0;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #444;
          font-size: 1rem;
          background: #181c2a;
          color: #fff;
        }
        input::placeholder, textarea::placeholder {
          color: #b0b8c1;
        }
        button {
          background: #0091ea;
          color: #fff;
          border: none;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
          border-radius: 6px;
          padding: 12px;
          font-size: 1.1rem;
        }
        button:hover {
          background: #005fa3;
        }
        .status {
          display: none;
        }
        .toast {
          position: fixed;
          top: 32px;
          right: 32px;
          background: #23263a;
          color: #fff;
          padding: 16px 28px;
          border-radius: 8px;
          box-shadow: 0 2px 12px #0007;
          font-size: 1.1rem;
          font-weight: 500;
          z-index: 9999;
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.4s, transform 0.4s;
        }
        .toast.show {
          opacity: 1;
          transform: translateY(0);
        }
        @media (max-width: 500px) {
          .container { padding: 16px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>TOTVS Fluig Suporte<br>Priorização de Tickets</h1>
        <form method="POST" action="/send">
          <label for="ticket">Número do Ticket</label>
          <input type="text" id="ticket" name="ticket" placeholder="Ex: 123456" required>
          <label for="mensagem">Mensagem de Priorização</label>
          <textarea id="mensagem" name="mensagem" rows="4" placeholder="Descreva a prioridade..." required></textarea>
          <label for="grupo">Grupo do Chat</label>
          <select id="grupo" name="grupo" required>
            <option value="Suporte Prime">Suporte Prime</option>
            <option value="Suporte Todos">Suporte Todos</option>
          </select>
          <button type="submit">Enviar Prioridade</button>
        </form>
        <div class="status">${req.query.status ? req.query.status : ''}</div>
      </div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
      <script>
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', function() {
            navigator.serviceWorker.register('/service-worker.js');
          });
        }

        window.addEventListener('DOMContentLoaded', function() {
          const params = new URLSearchParams(window.location.search);
          const status = params.get('status');
          if (status && typeof toastr !== 'undefined') {
            toastr.options = {
              positionClass: 'toast-top-right',
              timeOut: 3500,
              closeButton: true,
              progressBar: true
            };
            toastr.success(decodeURIComponent(status.split('+').join(' ')));
            setTimeout(function() {
              window.history.replaceState({}, document.title, window.location.pathname);
            }, 4000);
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Recebe dados do formulário e envia ao grupo selecionado
app.post('/send', async (req, res) => {
  const { ticket, mensagem, grupo } = req.body;
  const webhook = WEBHOOKS[grupo];
  if (!webhook) {
    return res.redirect('/?status=Grupo+inválido.');
  }
  const texto = `*Ticket:* ${ticket}\n*Prioridade:* ${mensagem}`;
  try {
    await axios.post(webhook, { text: texto });
    res.redirect('/?status=Mensagem+enviada+com+sucesso!');
  } catch (error) {
    console.error('Erro ao enviar para Google Chat:', error.message);
    res.redirect('/?status=Erro+ao+enviar+mensagem.');
  }
});

// Mantém o endpoint antigo para testes
app.post('/webhook', async (req, res) => {
  console.log('Webhook recebido:', req.body);
  try {
    await axios.post(WEBHOOKS['Suporte Prime'], {
      text: 'Mensagem de teste recebida via webhook!'
    });
    res.send('Mensagem enviada ao Google Chat com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar para Google Chat:', error.message);
    res.status(500).send('Erro ao enviar mensagem ao Google Chat.');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
