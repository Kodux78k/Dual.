import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import Stripe from 'stripe';

dotenv.config();
const app = express();
const PORT = 3000;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const USERS_FILE = './users.json';

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.static('public'));

// Verificar uso
app.get('/api/usage', (req, res) => {
  const { userId } = req.query;
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const user = users[userId];
  if (!user) return res.json({ exists: false });
  return res.json({
    exists: true,
    authenticated: true,
    isAdmin: userId === 'kodux',
    saldo: { IFT: user.IFT || 0 }
  });
});

// Criar usuário
app.post('/api/create-user', (req, res) => {
  const { userId } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  if (users[userId]) return res.json({ msg: 'Usuário já existe' });
  users[userId] = { IFT: 0 };
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  return res.json({ ok: true });
});

// Criar checkout Stripe
app.post('/api/create-checkout', async (req, res) => {
  const { userId, packageId } = req.body;
  const price = 1000; // R$10,00 em centavos

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['pix', 'card'],
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'brl',
        product_data: { name: 'IFT Tokens - Pacote 999' },
        unit_amount: price,
      },
      quantity: 1,
    }],
    metadata: { userId },
    success_url: 'https://seusite.com.br/obrigado',
    cancel_url: 'https://seusite.com.br/cancelado'
  });

  return res.json({ url: session.url });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});