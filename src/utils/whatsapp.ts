import { CartItem, CustomerDetails } from '../types';
import { PIZZERIA_INFO } from '../data/pizzaData';

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export interface WhatsAppOrderPayload {
  cartItems: CartItem[];
  customer: CustomerDetails;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  couponCode?: string;
  orderId: string;
}

export function generateWhatsAppMessage(payload: WhatsAppOrderPayload): string {
  const { cartItems, customer, subtotal, discount, deliveryFee, total, orderId } = payload;

  let msg = `🍕 *PEDIDO DE PIZZA #${orderId}*\n`;
  msg += `*${PIZZERIA_INFO.name}*\n`;
  msg += `-----------------------------------\n\n`;

  msg += `👤 *DADOS DO CLIENTE*\n`;
  msg += `• *Nome:* ${customer.name}\n`;
  msg += `• *Telefone:* ${customer.phone}\n`;
  msg += `• *Tipo:* ${customer.deliveryType === 'delivery' ? '🚚 Entrega em Domicílio' : '🏪 Retirada na Loja'}\n`;

  if (customer.deliveryType === 'delivery') {
    msg += `• *Endereço:* ${customer.street}, Nº ${customer.number}\n`;
    msg += `• *Bairro:* ${customer.neighborhood}\n`;
    if (customer.complement) {
      msg += `• *Complemento:* ${customer.complement}\n`;
    }
    if (customer.referencePoint) {
      msg += `• *Ponto de Ref.:* ${customer.referencePoint}\n`;
    }
  }

  msg += `\n🛒 *ITENS DO PEDIDO*\n`;

  cartItems.forEach((item, index) => {
    msg += `\n*${index + 1}. `;

    if (item.type === 'pizza' && item.pizzaDetails) {
      const p = item.pizzaDetails;
      msg += `Pizza ${p.size.name} (${p.size.slices} fatias)* x${item.quantity}\n`;
      
      if (p.flavors.length === 1) {
        msg += `   • *Sabor:* ${p.flavors[0].name}\n`;
      } else {
        msg += `   • *Sabores (Meio a Meio):*\n`;
        p.flavors.forEach(f => {
          msg += `     - 1/${p.flavors.length} ${f.name}\n`;
        });
      }

      msg += `   • *Borda:* ${p.crust.name}\n`;
      if (p.doughType !== 'tradicional') {
        msg += `   • *Massa:* ${p.doughType === 'fina' ? 'Massa Fina e Crocante' : 'Massa Pan Alta'}\n`;
      }
      if (p.extraCheese) {
        msg += `   • *Adicional:* Extra de Muçarela Gratinada (+R$ 5,00)\n`;
      }
      if (p.customNotes) {
        msg += `   • *Obs:* ${p.customNotes}\n`;
      }
    } else if (item.type === 'side' && item.sideDetails) {
      const s = item.sideDetails;
      msg += `${s.item.name}* x${item.quantity}\n`;
      if (s.item.volumeOrUnit) {
        msg += `   • *Unidade:* ${s.item.volumeOrUnit}\n`;
      }
      if (s.notes) {
        msg += `   • *Obs:* ${s.notes}\n`;
      }
    } else if (item.type === 'combo' && item.comboDetails) {
      const c = item.comboDetails;
      msg += `${c.combo.name}* x${item.quantity}\n`;
      msg += `   • *Sabores da Pizza:*\n`;
      c.selectedFlavors.forEach(f => {
        msg += `     - ${f.name}\n`;
      });
      msg += `   • *Borda:* ${c.selectedCrust.name}\n`;
      if (c.selectedSide) {
        msg += `   • *Acompanhamento:* ${c.selectedSide.name}\n`;
      }
      if (c.notes) {
        msg += `   • *Obs:* ${c.notes}\n`;
      }
    }

    msg += `   • *Valor:* ${formatCurrency(item.totalPrice)}\n`;
  });

  msg += `\n-----------------------------------\n`;
  msg += `💵 *RESUMO FINANCEIRO*\n`;
  msg += `• Subtotal: ${formatCurrency(subtotal)}\n`;
  if (discount > 0) {
    msg += `• Desconto Cupom: -${formatCurrency(discount)}\n`;
  }
  msg += `• Taxa de Entrega: ${deliveryFee > 0 ? formatCurrency(deliveryFee) : '🎉 GRÁTIS'}\n`;
  msg += `• *TOTAL FINAL: ${formatCurrency(total)}*\n\n`;

  msg += `💳 *FORMA DE PAGAMENTO*\n`;
  if (customer.paymentMethod === 'pix') {
    msg += `• *Pix* (Chave será enviada após confirmação)\n`;
  } else if (customer.paymentMethod === 'cartao_entrega') {
    msg += `• *Cartão de Débito/Crédito na Entrega*\n`;
  } else {
    msg += `• *Dinheiro*`;
    if (customer.changeFor) {
      msg += ` (Levar troco para ${customer.changeFor})`;
    }
    msg += `\n`;
  }

  if (customer.notes) {
    msg += `\n📝 *OBSERVAÇÕES DO PEDIDO*\n${customer.notes}\n`;
  }

  msg += `\n-----------------------------------\n`;
  msg += `⏳ *Tempo Estimado:* ${PIZZERIA_INFO.estimatedTime}\n`;
  msg += `Obrigado por escolher a ${PIZZERIA_INFO.name}! 🍕❤️`;

  return msg;
}

export function buildWhatsAppUrl(phone: string, textMessage: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedText = encodeURIComponent(textMessage);
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
}
