import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN 
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { itens } = req.body;

    const itemsMP = itens.map((i) => ({
      title: i.name,
      quantity: i.qty,
      unit_price: i.price,
      currency_id: "BRL",
    }));

    const preference = await new Preference(client).create({
      body: {
        items: itemsMP,
        back_urls: {
          success: "https://seu-site.com/sucesso",
          failure: "https://seu-site.com/falha",
          pending: "https://seu-site.com/pendente",
        },
        auto_return: "approved",
      },
    });

    return res.status(200).json({ init_point: preference.init_point });
  } catch (e) {
    return res.status(500).json({ error: "Erro ao criar pagamento" });
  }
}