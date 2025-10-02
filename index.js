const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Webhooks 
const WEBHOOKS = {
  'Suporte Prime': 'https://chat.googleapis.com/v1/spaces/AAQAY2RwRPg/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=z_MMMg5AC4nHeoUFqnU8tLpTiY2p4gjitwZ_PdUxpf8',
  'Suporte Todos': 'https://chat.googleapis.com/v1/spaces/AAAABBBCCCD/messages?key=AIzaSyXXXXXXX&token=YYYYYYYYYYYYYYYYYYYYYYYYYYYY',
};

app.use(express.static(path.join(__dirname, 'public')));

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'favicon.ico'));
});

// Lista de TCODEs para Suporte Prime
const TCODE_PRIME = [
  "T49594","T03314","TFDBMT","TEZEMI","T07030","TFDSM4","DBK238","T77169","TEVVHG","T19815","TAALX9","T11036","TEZKO6","T76547","TEZFJU","T51580","T09032","T11933","T33436","T02800","T41773","T17941","TFDUKJ","T59698","T06697","TFBTU8","TEVVV2","TEZKQ5","T43410","TEZOB3","TFDITK","T31871","T09290","TEZIBV","TFBZVQ","115378","T10153","T22498","T23708","T52253","TAAFT3","T35094","T80848","TFCTB6","TFCGGY","T50732","TFCGRH","TFCGRD","T29213","T30612","TFCGRA","TFCGRG","T29296","TFBZDY","TFCNFT","T17401","TFCLQQ","T20359","T41463","TEZOQY","TFBRNV","TFCOVD","TEYJA5","T50585","TEYJ66","TEWTOM","TFCLEQ","TFCLER","T60366","T60370","TFBRNZ","TFBRNW","TEZFDT","TEYJ67","TEZGTZ","TFBRNU","T60365","T46391","T42222","TEZJIJ","TEZMXD","T58517","T50468","TEXPLS","TFCLES","TEZI68","TEVVTL","T42330","TFBRO1","T60372","TFCHYW","TEZFDU","TEXPND","TFBRO0","TFBTO7","TFCBVX","TEZH31","T41316","T29964","T39818","99061","T18851","T75069","T74511","TFDOQE","T10405","Temporários","TFCKYG","T06645","TFCRKT","TDCC0G","TFCUA3","TFDESF","TFAVF9","T03152","TFBNG2","TEVVV2","T59789","T17401","TFCLQQ.T20359","115378","TFECYR","T29964","T39818","99061","T18851","99034"
];

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
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          width: 100%;
          max-width: 420px;
          margin: 24px auto;
          background: #23263a;
          border-radius: 12px;
          box-shadow: 0 2px 12px #0005;
          padding: 32px 24px;
          box-sizing: border-box;
        }
        h1 {
          color: #0091ea;
          text-align: center;
          margin-bottom: 24px;
          letter-spacing: 1px;
          font-size: 2rem;
        }
        label {
          font-weight: 500;
          margin-top: 12px;
          display: block;
          color: #fff;
          font-size: 1rem;
        }
        input, textarea {
          width: 100%;
          margin: 8px 0 16px 0;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #444;
          font-size: 1rem;
          background: #181c2a;
          color: #fff;
          box-sizing: border-box;
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
          width: 100%;
        }
        button:hover {
          background: #005fa3;
        }
        .status {
          display: none;
        }
        .toast {
          position: fixed;
          top: 16px;
          right: 16px;
          background: #23263a;
          color: #fff;
          padding: 16px 28px;
          border-radius: 8px;
          box-shadow: 0 2px 12px #0007;
          font-size: 1.1rem;
          font-weight: 500;
          z-index: 9999;
          opacity: 0;
          transform: translateY(-20px;
          transition: opacity 0.4s, transform 0.4s;
        }
        .toast.show {
          opacity: 1;
          transform: translateY(0);
        }
        @media (max-width: 700px) {
          .container {
            max-width: 98vw;
            padding: 16px 8px;
            margin: 8px;
          }
          h1 {
            font-size: 1.3rem;
          }
        }
        @media (max-width: 400px) {
          .container {
            padding: 8px 2px;
          }
          label, input, textarea, button {
            font-size: 0.95rem;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>TOTVS Fluig Suporte<br>Priorização de Tickets</h1>
        <form method="POST" action="/send">
          <label for="tcode">Código T</label>
          <input type="text" id="tcode" name="tcode" placeholder="Ex: T12345" required>
          <label for="ticket">Ticket</label>
          <input type="text" id="ticket" name="ticket" placeholder="Ex: 123456" required>
          <label for="email">E-mail</label>
          <input type="email" id="email" name="email" placeholder="Informe seu e-mail" required>
          <span id="emailError" style="color:#ff5252;display:none;font-size:0.95rem;"></span>
          <label style="margin-top:16px;display:block;">Deseja informar o telefone?</label>
          <div style="display:flex;align-items:center;gap:18px;margin-bottom:8px;">
            <label style="display:flex;align-items:center;gap:6px;margin:0;">
              <input type="radio" id="telefone_nao" name="telefone_opcao" value="nao" checked style="accent-color:#0091ea;">
              Não
            </label>
            <label style="display:flex;align-items:center;gap:6px;margin:0;">
              <input type="radio" id="telefone_sim" name="telefone_opcao" value="sim" style="accent-color:#0091ea;">
              Sim
            </label>
          </div>
          <div id="telefoneDiv" style="display:none;">
            <label for="telefone">Telefone (opcional)</label>
            <input type="text" id="telefone" name="telefone" placeholder="Informe seu telefone">
          </div>
          <label for="mensagem">Mensagem</label>
          <textarea id="mensagem" name="mensagem" rows="4" placeholder="Digite a mensagem..." required></textarea>
          <button type="submit">Enviar</button>
        </form>
        <div class="status">${req.query.status ? req.query.status : ''}</div>
      </div>
      <footer style="position:fixed;left:0;bottom:0;width:100%;text-align:center;padding:8px 0;font-size:0.95rem;color:#b0b8c1;opacity:0.7;background:#181c2a;z-index:100;">
        TOTVS Fluig 
      </footer>
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

          // Mostrar/esconder campo telefone
          const telefoneSim = document.getElementById('telefone_sim');
          const telefoneNao = document.getElementById('telefone_nao');
          const telefoneDiv = document.getElementById('telefoneDiv');
          telefoneSim.addEventListener('change', function() {
            if (telefoneSim.checked) telefoneDiv.style.display = 'block';
          });
          telefoneNao.addEventListener('change', function() {
            if (telefoneNao.checked) telefoneDiv.style.display = 'none';
          });

          // Validação de email no frontend
          const form = document.querySelector('form');
          form.addEventListener('submit', function(e) {
            const emailInput = document.getElementById('email');
            if (!emailInput.value.trim().toLowerCase().endsWith('@totvs.com.br')) {
              e.preventDefault();
              if (typeof toastr !== 'undefined') {
                toastr.options = {
                  positionClass: 'toast-top-right',
                  timeOut: 3500,
                  closeButton: true,
                  progressBar: true
                };
                toastr.error('Você não tem autorização para solicitação de prioridade.');
              }
              emailInput.focus();
              return false;
            }
          });
        });
      </script>
    </body>
    </html>
  `);
});

// Dispara mensagem para o Google Chat
app.post('/send', async (req, res) => {
  const { tcode, ticket, mensagem, email, telefone } = req.body;
  if (!tcode || !ticket || !mensagem || !email) {
    return res.redirect('/?status=Preencha+todos+os+campos+obrigatórios.');
  }
  // Validação simples de email
  if (!email.trim().toLowerCase().endsWith('@totvs.com.br')) {
    return res.redirect('/?status=E-mail+não+autorizado,+fale+com+o+administrador.');
  }
  const grupo = TCODE_PRIME.some(tc => tcode.trim().toUpperCase().includes(tc)) ? 'Suporte Prime' : 'Suporte Todos';
  const webhook = WEBHOOKS[grupo];
  const ticketUrl = `https://totvssuporte.zendesk.com/agent/tickets/${ticket}`;
  const card = {
    cards: [
      {
        header: {
          title: `Priorização de Ticket`,
          imageUrl: "https://cdn-icons-png.flaticon.com/512/564/564619.png", 
          imageStyle: "AVATAR"
        },
        sections: [
          {
            widgets: [
              {
                keyValue: {
                  topLabel: "Ticket",
                  content: `<a href='${ticketUrl}'>${ticket}</a>`,
                  contentMultiline: false
                }
              },
              {
                keyValue: {
                  topLabel: "Mensagem",
                  content: mensagem,
                  contentMultiline: true
                }
              },
              {
                keyValue: {
                  topLabel: "Solicitante",
                  content: `Email: ${email}${telefone ? ` | Telefone: ${telefone}` : ''}`,
                  contentMultiline: true
                }
              }
            ]
          }
        ]
      }
    ]
  };
  try {
    await axios.post(webhook, card);
    res.redirect('/?status=Mensagem+enviada+com+sucesso!');
  } catch (error) {
    console.error('Erro ao enviar para Google Chat:', error.message);
    res.redirect('/?status=Erro+ao+enviar+mensagem.');
  }
});

// endpoint antigo de teste
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
