const { Venda, VendaItem, Pedido, ItemPedido, data_entrega, Estoque, Transacao } = require('../models');

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');


exports.criarVenda = async (req, res) => {
  try {
    const {
      caixa_id,
      itens,
      total,
      valor_recebido,
      valor_restante,
      metodo_pagamento,
      status_pagamento,
      data_entrega,
      cliente,
      telefone,
      obs
    } = req.body;

    if (!itens || itens.length === 0) {
      return res.status(400).json({ erro: 'Nenhum item adicionado à venda.' });
    }

    // 1. Criar a Venda
    const novaVenda = await Venda.create({
      caixa_id,
      total,
      valor_recebido,
      valor_restante,
      metodo_pagamento,
      status_pagamento,
      data_entrega,
      cliente,
      telefone,
      obs
    });

    // 2. Criar os Itens da Venda
    await Promise.all(itens.map(item =>
      VendaItem.create({
        venda_id: novaVenda.id,
        produto_id: item.id,
        quantidade: item.quantidade,
        valor_unitario: item.valor,
        subtotal: item.quantidade * item.valor
      })
    ));

    // 3. Criar o Pedido vinculado à venda
    const novoPedido = await Pedido.create({
      cliente,
      telefone,
      obs,
      valorTotal: total,
      valorSinal: valor_recebido,
      valorRestante: valor_restante,
      status: 'aguardando',
      status_pagamento,
      dataEntrega: new Date(),
      dataPedido: new Date()
    });

    // 4. Criar os Itens do Pedido
    await Promise.all(itens.map(item =>
  ItemPedido.create({
    pedidoId: novoPedido.id,  
    produto: item.nome,
    quantidade: item.quantidade,
    valorUnitario: item.valor,
    valorTotal: item.quantidade * item.valor,
    obs: item.obs
  })
));

  // Criar uma transação de entrada no caixa
await Transacao.create({
  tipo: 'entrada',
  valor: valor_recebido,
  descricao: `Venda - Cliente: ${cliente}`,
  caixa_id: caixa_id,
  data: new Date()
});

    res.status(201).json({ sucesso: true });

  } catch (error) {
    console.error('Erro ao registrar venda:', error.message);
    res.status(500).json({ erro: 'Erro ao registrar venda', detalhe: error.message });
  }
};

// ✅ FORA da função criarVenda




// controllers/vendaController.js
exports.listarVendas = async (req, res) => {
  try {
    const vendas = await Venda.findAll({
      include: [
        {
          model: VendaItem,
          as: 'itens',
          include: [{
            model: Estoque,
            as: 'produto',
            attributes: ['id', 'nome', 'valor', 'quantidade']
          }]
        }
      ],
      attributes: ['id', 'total', 'obs', 'cliente', 'telefone', 'created_at', 'caixa_id'], // 👈 adicione isso
      order: [['created_at', 'DESC']]
    });

    res.json(vendas);
  } catch (error) {
    console.error("Erro ao listar vendas:", error);
    res.status(500).json({ error: "Erro ao buscar vendas" });
  }
};



exports.excluirVenda = async (req, res) => {
  const { id } = req.params;

  try {
    // Excluir itens vinculados à venda primeiro
    await VendaItem.destroy({ where: { venda_id: id } });

    // Depois excluir a venda
    await Venda.destroy({ where: { id } });

    res.status(200).json({ sucesso: true, mensagem: "Venda excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir venda:", error);
    res.status(500).json({ erro: "Erro ao excluir venda" });
  }
};

exports.atualizarStatusPedido = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status é obrigatório" });
  }

  try {
    const venda = await Venda.findByPk(id);
    if (!venda) {
      return res.status(404).json({ message: "Venda não encontrada" });
    }

    venda.status_pedido = status;
    await venda.save();

    return res.json({ message: "Status do pedido atualizado com sucesso", venda });
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);
    return res.status(500).json({ message: "Erro interno ao atualizar status" });
  }
};




exports.gerarRecibo = async (req, res) => {
  const vendaId = req.params.id;

  try {
    const venda = await Venda.findByPk(vendaId, {
      include: [
        {
          model: VendaItem,
          as: 'itens',
          include: [{ model: Estoque, as: 'produto' }]
        }
      ]
    });

    if (!venda) return res.status(404).send("Venda não encontrada.");

    const itens = venda.itens || [];

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            color: #333;
            background-color: #fff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #ccc;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .logo {
            width: 120px;
            height: auto;
          }
          .empresa {
            text-align: right;
            font-size: 14px;
          }
          .titulo {
            text-align: center;
            margin: 30px 0;
            font-size: 24px;
            color: #4B0082;
            font-weight: bold;
          }
          .cliente-info, .totais {
            font-size: 14px;
            margin-top: 10px;
            padding: 10px;
            background: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 6px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 13px;
          }
          table th, table td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
          }
          table th {
            background-color: #f2f2f2;
          }
          .totais p {
            margin: 5px 0;
          }
          .assinatura {
            margin-top: 60px;
            font-size: 14px;
            text-align: center;
          }
          .assinatura span {
            display: inline-block;
            margin-top: 40px;
            border-top: 1px solid #000;
            padding-top: 4px;
            width: 300px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-style: italic;
            font-size: 13px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img class="logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png" />
          <div class="empresa">
            <strong>Gráfica Sublima Rio</strong><br />
            CNPJ: 00.000.000/0001-00<br />
            Rua das Impressoras, 123 - Centro - RJ<br />
            Tel: (21) 99999-9999
          </div>
        </div>

        <div class="titulo">Recibo de Venda</div>

        <div class="cliente-info">
          <p><strong>Cliente:</strong> ${String(venda.cliente || "N/A")}</p>
          <p><strong>Telefone:</strong> ${String(venda.telefone || "N/A")}</p>
          <p><strong>Data:</strong> ${venda.created_at ? new Date(venda.created_at).toLocaleDateString('pt-BR') : "N/A"}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itens.map(i => `
              <tr>
                <td>${i.produto?.nome || 'Produto'}</td>
                <td>${i.quantidade || 0}</td>
                <td>R$ ${i.subtotal ? Number(i.subtotal).toFixed(2) : '0.00'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totais">
          <p><strong>Total:</strong> R$ ${venda.total ? parseFloat(venda.total).toFixed(2) : '0.00'}</p>
          <p><strong>Recebido:</strong> R$ ${venda.valor_recebido ? parseFloat(venda.valor_recebido).toFixed(2) : '0.00'}</p>
          <p><strong>Restante:</strong> R$ ${venda.valor_restante ? parseFloat(venda.valor_restante).toFixed(2) : '0.00'}</p>
        </div>

        <div class="assinatura">
          <span>Assinatura do Cliente</span>
        </div>

        <div class="footer">
          Obrigado pela preferência!
        </div>
      </body>
      </html>
    `;

    console.log('Iniciando geração do PDF...');

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: puppeteer.executablePath(),
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({ format: 'A4', margin: { top: '20mm', bottom: '20mm' } });

    await browser.close();

    if (!pdf || pdf.length === 0) {
      console.error('PDF gerado com tamanho 0');
      return res.status(500).send("Erro ao gerar PDF.");
    }

    console.log('PDF gerado com sucesso, tamanho:', pdf.length);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="recibo-venda-${venda.id}.pdf"`);
    res.end(pdf);

  } catch (err) {
    console.error("Erro ao gerar recibo PDF:", err.message, err.stack);
    res.status(500).send("Erro ao gerar recibo.");
  }
};