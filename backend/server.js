const express = require('express');
const cors = require('cors');
require('dotenv').config();
const puppeteer = require('puppeteer');



const { connectDB, sequelize } = require('./config/db');
const authRoutes = require('./routes/auth');
const pedidosRoutes = require('./routes/pedidos'); // 👈 importamos aqui
const estoqueRoutes = require('./routes/estoque.routes'); // ajuste o caminho
const caixaRoutes = require('./routes/caixas');
const vendaRoutes = require('./routes/vendaRoutes');
const transacaoRoutes = require('./routes/transacoes');
const dashboardRoutes = require('./routes/dashboardRoutes');



const app = express();
app.use(cors());
app.use(express.json());

connectDB();
sequelize.sync(); // Cria as tabelas automaticamente

app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidosRoutes); // 👈 adicionamos essa linha
// Rotas
app.use('/api/estoque', require('./routes/estoque.routes'));
app.use('/api/caixas', caixaRoutes);
app.use('/api/vendas', vendaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/transacoes', transacaoRoutes);





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));




app.get('/teste-pdf', async (req, res) => {
  const html = `<html><body><h1>Teste PDF</h1></body></html>`;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: puppeteer.executablePath(),
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="teste.pdf"');
    res.end(pdfBuffer); // importante: use .end, não .send
  } catch (err) {
    console.error('Erro ao gerar PDF:', err.message, err.stack);
    res.status(500).send('Erro ao gerar PDF.');
  }
});


