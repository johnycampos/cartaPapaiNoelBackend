const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa o pacote CORS
const { google } = require('googleapis');
const fs = require('fs');

const app = express();
app.use(cors()); // Permite todas as origens
app.use(bodyParser.json());

// Credenciais do Google
const CREDENTIALS = JSON.parse(fs.readFileSync('apiplanilhas-442123-6e12c46da424.json', 'utf8'));
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  null,
  CREDENTIALS.private_key,
  SCOPES
);

const sheets = google.sheets({ version: 'v4', auth });

// ID da planilha (substitua pelo seu ID)
const SPREADSHEET_ID = '1ds8wdKuHXp0hm6NZgS0k1y_xDKKy6Tr2hLau6DKNpuE';

// Rota para salvar os dados na planilha
app.post('/save-letter', async (req, res) => {
  const { name, state, city, letter, email, whatsapp } = req.body;

  if (!name || !state || !city || !letter || !email) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
//   console.log("Teste" ,SPREADSHEET_ID, CREDENTIALS.client_email, CREDENTIALS.private_key )

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'A1', // Ajuste para a aba e célula desejadas
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[name, state, city, letter, email, whatsapp, new Date().toISOString()]],
      },
    });

    res.status(200).json({ message: 'Dados salvos com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar na planilha:', error);
    res.status(500).json({ error: 'Erro ao salvar os dados' });
  }
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
