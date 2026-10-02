import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini SDK with server-side API Key
const apiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// API Route: Smart Expense Parser from natural text
app.post('/api/ai/parse-expense', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      res.status(400).json({ error: 'Texto não informado para análise.' });
      return;
    }

    if (!aiClient) {
      // Local heuristic fallback if no API key is configured
      const localResult = fallbackParseExpense(text);
      res.json({ ...localResult, source: 'offline-heuristic' });
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const prompt = `Você é um assistente financeiro especialista em controle de pequenos gastos.
Analise a mensagem do usuário em português e extraia as informações estruturadas da despesa.

Mensagem: "${text.trim()}"
Data de hoje: ${todayStr}

Categorias válidas (escolha a mais adequada):
- Alimentação (lanches, refeições, café, padaria, delivery, supermercado)
- Transporte (uber, ônibus, metrô, combustível, estacionamento)
- Lazer (cinema, streaming, passeios, cerveja, bar)
- Moradia (contas da casa, manutenção, aluguel, luz, água)
- Saúde (remédio, farmácia, médico, academia)
- Compras (roupas, acessórios, eletrônicos, compras avulsas)
- Outros (qualquer outro gasto)

Métodos de pagamento comuns:
- PIX
- Cartão de Crédito
- Cartão de Débito
- Dinheiro
- Outro

Retorne estritamente um objeto JSON com o formato:
{
  "description": "descrição concisa e limpa (ex: Almoço no quilo)",
  "amount": 25.50 (número float positivo, ou 0 se não identificado),
  "category": "Alimentação | Transporte | Lazer | Moradia | Saúde | Compras | Outros",
  "paymentMethod": "PIX | Cartão de Crédito | Cartão de Débito | Dinheiro | Outro",
  "date": "YYYY-MM-DD" (se o usuário disse hoje, use ${todayStr}, ontem ou uma data relativa se informada),
  "confidence": "high | medium | low",
  "summary": "Explicação amigável em 1 frase curta"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const contentText = response.text?.trim() || '{}';
    const parsed = JSON.parse(contentText);
    res.json({ ...parsed, source: 'gemini' });
  } catch (error: any) {
    console.error('Error parsing expense with AI:', error);
    // Graceful fallback to heuristic
    const localResult = fallbackParseExpense(req.body?.text || '');
    res.json({ ...localResult, source: 'fallback-after-error' });
  }
});

// API Route: Financial Insights & Budget Diagnostics
app.post('/api/ai/analyze-finances', async (req: Request, res: Response): Promise<void> => {
  try {
    const { expenses, monthlyBudget } = req.body;
    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
      res.status(400).json({ error: 'Nenhum gasto fornecido para análise.' });
      return;
    }

    if (!aiClient) {
      res.json({
        headline: 'Diagnóstico dos Seus Pequenos Gastos',
        tips: [
          'Você tem gastos recorrentes. Pequenos valores diários como cafezinhos e lanches somam um montante considerável ao final do mês.',
          'Defina um teto semanal para compras por impulso e priorize pagamentos via PIX à vista com desconto.',
          'Continue registrando cada centavo: a conscientização é o primeiro passo para a liberdade financeira.'
        ],
        alerts: ['Atenção aos gastos com alimentação fora de casa, que costumam liderar o orçamento.'],
        score: 'Bons hábitos em formação',
        source: 'local-insights'
      });
      return;
    }

    const expensesSummary = expenses.slice(0, 50).map(e => ({
      d: e.description,
      v: e.amount,
      c: e.category,
      p: e.paymentMethod,
      dt: e.date
    }));

    const total = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

    const prompt = `Você é o PoupaMais AI, um orientador financeiro pessoal amigável, direto e focado na realidade brasileira (moeda R$).
O usuário cadastrou pequenos gastos pessoais:
- Total gasto registrado: R$ ${total.toFixed(2)}
- Limite/Meta mensal definido pelo usuário: ${monthlyBudget ? `R$ ${monthlyBudget}` : 'Não informado'}
- Lista de gastos recentes: ${JSON.stringify(expensesSummary)}

Faça um diagnóstico inteligente com foco em pequenos gastos invisíveis ("efeito cafezinho"), padrão de consumo por categoria e como economizar sem sofrimento.

Retorne estritamente um JSON com:
{
  "headline": "Uma manchete motivadora e realista sobre o momento financeiro",
  "score": "Um status curto (ex: 'Excelente Controle', 'Atenção aos Pequenos Deslizes', 'Sinal Amarelo')",
  "totalAnalyzed": ${total},
  "topCategoryComment": "Comentário sobre a categoria onde mais se gasta",
  "tips": [
    "Dica prática 1 com ação imediata",
    "Dica prática 2 específica sobre os itens cadastrados",
    "Dica prática 3 sobre economia sustentável"
  ],
  "microSavingsIdea": "Ideia criativa de como economizar pelo menos R$ 50 a R$ 100 no próximo mês com base no perfil",
  "praise": "Um ponto positivo observado no registro do usuário"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json({ ...parsed, source: 'gemini' });
  } catch (error: any) {
    console.error('Error analyzing finances with AI:', error);
    res.status(500).json({
      error: 'Não foi possível gerar análise com IA no momento.',
      details: error?.message
    });
  }
});

// Helper for local offline heuristic parsing
function fallbackParseExpense(text: string) {
  const clean = text.toLowerCase();
  
  // Extract number (e.g. 25,50 or 25.50 or R$ 25)
  const matchNum = text.match(/(?:r\$\s*)?(\d+([.,]\d{1,2})?)/i);
  let amount = 0;
  if (matchNum) {
    amount = parseFloat(matchNum[1].replace(',', '.'));
  }

  // Detect payment method
  let paymentMethod = 'Outro';
  if (clean.includes('pix')) paymentMethod = 'PIX';
  else if (clean.includes('crédito') || clean.includes('credito')) paymentMethod = 'Cartão de Crédito';
  else if (clean.includes('débito') || clean.includes('debito')) paymentMethod = 'Cartão de Débito';
  else if (clean.includes('dinheiro') || clean.includes('espécie') || clean.includes('especie')) paymentMethod = 'Dinheiro';

  // Detect category
  let category = 'Outros';
  if (/lanche|almoço|almoco|jantar|café|cafe|padaria|pizza|hamburguer|mercado|açaí|acai|sorvete|restaurante|ifood|coxinha|suco|pastel|refrigerante|salgado|bolo|cerveja|chopp|marmita/.test(clean)) {
    category = 'Alimentação';
  } else if (/uber|99|ônibus|onibus|metrô|metro|gasolina|combustível|estacionamento|passagem|táxi|taxi|pedágio|pedagio/.test(clean)) {
    category = 'Transporte';
  } else if (/cinema|bar|cerveja|jogo|show|filme|passeio|festa|balada|praia/.test(clean)) {
    category = 'Lazer';
  } else if (/remédio|remedio|farmácia|farmacia|médico|medico|exame|dentista|hospital|curativo/.test(clean)) {
    category = 'Saúde';
  } else if (/aluguel|luz|água|agua|internet|gás|gas|condomínio|condominio|reforma/.test(clean)) {
    category = 'Moradia';
  } else if (/roupa|tênis|tenis|camisa|shopee|livro|presente|calçado|calcado|eletrônico|fone/.test(clean)) {
    category = 'Compras';
  }

  // Clean description
  let description = text
    .replace(/(?:r\$\s*)?\d+([.,]\d{1,2})?/gi, '')
    .replace(/\b(no\s+pix|no\s+crédito|no\s+debito|no\s+débito|no\s+dinheiro|em\s+dinheiro|reais|hoje|ontem)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!description || description.length < 2) {
    description = text.trim();
  }
  if (description.length > 50) {
    description = description.substring(0, 50);
  }

  return {
    description: description.charAt(0).toUpperCase() + description.slice(1),
    amount: amount || 0,
    category,
    paymentMethod,
    date: new Date().toISOString().split('T')[0],
    confidence: amount > 0 ? 'medium' : 'low',
    summary: 'Processado automaticamente via identificação de padrões.'
  };
}

// Vite middleware in dev or static files in prod
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`PoupaMais server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
