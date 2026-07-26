import React, { useState } from 'react';
import { X, Truck, Store, CreditCard, QrCode, Banknote, User, Phone, MapPin, Send, MessageSquare, AlertCircle } from 'lucide-react';
import { CartItem, CustomerDetails, DeliveryType, PaymentMethod, Coupon } from '../types';
import { PIZZERIA_INFO } from '../data/pizzaData';
import { generateWhatsAppMessage, buildWhatsAppUrl, formatCurrency } from '../utils/whatsapp';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  appliedCoupon: Coupon | null;
  onOrderCompleted: (formattedMessage: string, whatsappUrl: string, orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  appliedCoupon,
  onOrderCompleted,
}) => {
  if (!isOpen) return null;

  // Form State
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');
  const [referencePoint, setReferencePoint] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [changeFor, setChangeFor] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Calculate Prices
  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderValue) {
    discount = (subtotal * appliedCoupon.discountPercent) / 100;
  }
  const isFreeDelivery = subtotal >= PIZZERIA_INFO.freeDeliveryMin || deliveryType === 'retirada';
  const deliveryFee = isFreeDelivery ? 0 : PIZZERIA_INFO.deliveryFee;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handleFinishOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Por favor, informe seu nome completo.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Por favor, informe seu telefone com DDD.');
      return;
    }

    if (deliveryType === 'delivery') {
      if (!street.trim() || !number.trim() || !neighborhood.trim()) {
        setFormError('Por favor, preencha o endereço completo (Rua, Número e Bairro).');
        return;
      }
    }

    const orderId = `${Math.floor(1000 + Math.random() * 9000)}`;

    const customerDetails: CustomerDetails = {
      name,
      phone,
      deliveryType,
      street,
      number,
      neighborhood,
      complement,
      referencePoint,
      paymentMethod,
      changeFor,
      notes,
    };

    const formattedMessage = generateWhatsAppMessage({
      cartItems,
      customer: customerDetails,
      subtotal,
      discount,
      deliveryFee,
      total: grandTotal,
      couponCode: appliedCoupon?.code,
      orderId,
    });

    const whatsappUrl = buildWhatsAppUrl(PIZZERIA_INFO.whatsappNumber, formattedMessage);

    onOrderCompleted(formattedMessage, whatsappUrl, orderId);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-3xl text-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white font-serif">Finalizar Pedido via WhatsApp</h3>
              <p className="text-xs text-amber-300">Preencha seus dados para montarmos a mensagem do WhatsApp</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFinishOrder} className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {formError && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{formError}</span>
            </div>
          )}

          {/* 1. Delivery Type Toggle */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase text-amber-400 tracking-wider">1. Forma de Recebimento</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  deliveryType === 'delivery'
                    ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400'
                }`}
              >
                <Truck className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-xs font-extrabold">Entrega em Domicílio</div>
                  <div className="text-[10px] text-slate-400">
                    {deliveryFee === 0 ? 'Frete Grátis' : `Taxa de ${formatCurrency(deliveryFee)}`}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('retirada')}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  deliveryType === 'retirada'
                    ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400'
                }`}
              >
                <Store className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-xs font-extrabold">Retirada no Balcão</div>
                  <div className="text-[10px] text-slate-400">Sem taxa de entrega</div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Customer Personal Info */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase text-amber-400 tracking-wider">2. Seus Dados</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Seu Nome Completo *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">WhatsApp / Telefone *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="(11) 99999-8888"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Delivery Address (if Delivery) */}
          {deliveryType === 'delivery' && (
            <div className="space-y-3 p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
              <label className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> Endereço de Entrega
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-slate-300 block mb-1">Rua / Avenida *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    placeholder="Ex: Av. Paulista"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Número *</label>
                  <input
                    type="text"
                    required
                    value={number}
                    onChange={e => setNumber(e.target.value)}
                    placeholder="Ex: 1500"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Bairro *</label>
                  <input
                    type="text"
                    required
                    value={neighborhood}
                    onChange={e => setNeighborhood(e.target.value)}
                    placeholder="Ex: Bela Vista"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Complemento (Apto/Bloco)</label>
                  <input
                    type="text"
                    value={complement}
                    onChange={e => setComplement(e.target.value)}
                    placeholder="Ex: Apt 42"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Ponto de Referência</label>
                  <input
                    type="text"
                    value={referencePoint}
                    onChange={e => setReferencePoint(e.target.value)}
                    placeholder="Ex: Próximo à padaria"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Payment Method */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase text-amber-400 tracking-wider">3. Forma de Pagamento</label>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'pix'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400'
                }`}
              >
                <QrCode className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                <span className="text-xs block">Pix</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cartao_entrega')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'cartao_entrega'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                <span className="text-xs block">Cartão na Entrega</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('dinheiro')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'dinheiro'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400'
                }`}
              >
                <Banknote className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                <span className="text-xs block">Dinheiro</span>
              </button>
            </div>

            {paymentMethod === 'dinheiro' && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <label className="text-[11px] text-slate-300 block mb-1">Troco para quanto?</label>
                <input
                  type="text"
                  value={changeFor}
                  onChange={e => setChangeFor(e.target.value)}
                  placeholder="Ex: Troco para R$ 100,00"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Total do Pedido</span>
              <span className="text-xl font-black text-amber-400">{formatCurrency(grandTotal)}</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm px-7 py-3.5 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Pedido pelo WhatsApp</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
