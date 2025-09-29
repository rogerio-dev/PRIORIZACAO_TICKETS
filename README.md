# TOTVS Fluig Suporte - Priorização de Tickets

Esta é uma aplicação web para ajudar a gestão na priorização de tickets, enviando notificações diretamente para grupos do Google Chat.

## Funcionalidades
- Interface moderna e responsiva
- Seleção de grupo de chat para envio
- Campos para número do ticket e mensagem de priorização
- Notificações visuais de sucesso
- Progressive Web App (PWA)

## Como usar
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor:
   ```bash
   npm start
   ```
3. Acesse no navegador:
   ```
   http://localhost:3000/
   ```
4. Preencha os campos e envie a priorização para o grupo desejado.

## Configuração dos webhooks
Edite o arquivo `index.js` para configurar os webhooks dos grupos do Google Chat conforme sua necessidade.

## Requisitos
- Node.js 18+

## Licença
MIT
