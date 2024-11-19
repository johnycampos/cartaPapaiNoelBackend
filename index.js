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
const email = "johnyfreitas@apiplanilhas-442123.iam.gserviceaccount.com";
const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDjresdUGIngpuv
ujROBHvv2iCFtdjgIfjbSHT84uGB40D8u29OBJJUGIMCQumrk+fdq1z5F7sUBp15
KBdIag6pAFm02sUBMgRPEkuP8AhFDkfgvxvX9d2fuKcHrAM7Otiffdkrt3hoEGIY
ELvx0AEd1kQkFZUBXaVv73BLIASMRcEn64pyup/ExivJeTvQtiKzHtXke2WjdxC9
vqFvIZbJROzF9Xs7nThsboEHPYBlyemxDPLaBeQ8cnLbvzPsWG0dedDfwkhPrm0V
5RDTWAuIKVL9Cytb6gel02VS+HMQE+i2fQPujLduuQ1PbCxomOBpEW0si+fHR0UA
tJKBEBdNAgMBAAECggEAIje9ubKehdSdxFvGR6Fp5QLR13aciRbh+Uba+jS48pXu
au1ajY2nVkc2zUy0JKq+crSx7OfRoHFcElzhnur9mA2q7cDhUcwsFJwpyhCnlYVP
bSobq6nSbJJKXB9QfwLZkqLN1EGnMXCg5YACVxXNTSgqJogt1D44QmnoZQoDVPdQ
HorBBDMlqf/ppWIwvxch3PZaorKtnmZDm4x3oiZaXM22wEFNBERErOanR8jzCvYh
KnIOYdwZcCCFCMDSlzMtZaO5MjxdYvcaB4WHKU3dkY8PFqvUfypxvD3V1CNupt03
rm2hnuEgsXMuGnvJFWOOinGOpy4kSXuCBrSI5X942wKBgQD/+CTKb8vBAogF7AK7
/ZsbCxyM1Cpyzo2GlinxXizMFPJ2jp+Ct0shK5jQIy+o8OHGoWAVbOGvyoQal2xh
4zAG3L6g8yj+asn5OrVyEeQTazhDtn10gM1XtTT1N2yKszcn9zmAK6b1ifKVn4rO
a2RJWZW5q/wMHqxfVKQ6RSQkmwKBgQDjtOgLD+lTF2acxFi/wW9LYwXRUjIWvIkc
vJYS1GJYIZmZItcnHgZn85FDt28rhwSlXbHpZb9WoWsB2idAFPAWSGU9GlDPIRaW
9D1xU9WltcQx8RwW61uqm120gQkFh7ZPkJala2ryfsAPL29UQ4wADUIne0qDs4bU
7aNScz9ONwKBgQCtBgN4g5FralagCiTfBlKuORiXaWM4L78i1qaLbWlCmnY7BbV1
GolCZsHpD5/LxugW6EaWtP7pYS9i+jBdCsEQIm8JRNTVBUJ5oeG8tbNCHRvvSZAM
DHTBcM/XYhuQtgv2i/rmVJuLJjBAS5P8bENiAZhf5Y1+c814szI/4TTJOQKBgHx1
jANH3iNBfh+fnlapNtjAthRUVfZhdJwVY/3EwkAjlV3DUlAaNCwrUDHwGD51XQ+5
552HtI54ShHIGH4JM7UqOtOsB5E/J6a4tsCzruoVMLiPbegFGqRkqVIY2UKBjB9v
Czg9P0ZuCzIBnlszVFlO5eLIm9DilobZoNRXE7n/AoGAVwbXoabuQgSeVRdTYh0X
lB72fP5W2wCL1H/Oyx/J1SaCJzoAHZ4iKP6RXdXv9cOWNYUb/csYuCraymomebDK
ViFJRSbVKBKa5wNJOenp2UOHchMZnyaqa5lJoPTmD4N4glVV0GFaPZRvVg6Q1IMV
TGPIVH7MzfwZx7J2csk6lxE=
-----END PRIVATE KEY-----`;


const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const auth = new google.auth.JWT(
  email,
  null,
  privateKey,
  SCOPES
);

const sheets = google.sheets({ version: 'v4', auth });

// ID da planilha (substitua pelo seu ID)
const SPREADSHEET_ID = '1ds8wdKuHXp0hm6NZgS0k1y_xDKKy6Tr2hLau6DKNpuE';

// Rota para salvar os dados na planilha
app.post('/save-letter', async (req, res) => {
  const { name, idade, state, city, presente, letter, whatsapp } = req.body;

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
        values: [[name, idade, state, city, presente, letter, whatsapp, new Date().toISOString()]],
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
