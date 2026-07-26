import React, { useState } from 'react';
import { X, Truck, Store, CreditCard, QrCode, Banknote, User, Phone, MapPin, Send, MessageSquare, AlertCircle, Calendar, Clock, Zap } from 'lucide-react';
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
  const [orderTiming, setOrderTiming] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduleDateType, setScheduleDateType] = useState<'hoje' | 'amanha' | 'custom'>('hoje');
  const [customDate, setCustomDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('19:30');

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

  const getFormattedScheduledDate = (): string => {
    const today = new Date();
    if (scheduleDateType === 'hoje') {
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      return `Hoje (${day}/${month})`;
    } else if (scheduleDateType === 'amanha') {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const day = String(tomorrow.getDate()).padStart(2, '0');
      const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
      return `Amanhã (${day}/${month})`;
    } else if (customDate) {
      const parts = customDate.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return customDate;
    }
    return 'Hoje';
  };

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

    if (orderTiming === 'scheduled') {
      if (scheduleDateType === 'custom' && !customDate) {
        setFormError('Por favor, escolha a data desejada para o agendamento.');
        return;
      }
      if (!scheduledTime) {
        setFormError('Por favor, escolha o horário desejado para o agendamento.');
        return;
      }
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
      isScheduled: orderTiming === 'scheduled',
      scheduledDate: orderTiming === 'scheduled' ? getFormattedScheduledDate() : undefined,
      scheduledTime: orderTiming === 'scheduled' ? scheduledTime : undefined,
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

  const timeOptions = [
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'
  ];

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

          {/* 2. Order Timing & Scheduling */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> 2. Horário do Pedido
            </label>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderTiming('immediate')}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  orderTiming === 'immediate'
                    ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="text-xs font-extrabold">Enviar Agora</div>
                  <div className="text-[10px] text-slate-400">O mais rápido possível (~{PIZZERIA_INFO.estimatedTime})</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOrderTiming('scheduled')}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  orderTiming === 'scheduled'
                    ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold flex items-center gap-1">
                    <span>Agendar Pedido</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded-full">Novo</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Escolha a data e hora</div>
                </div>
              </button>
            </div>

            {/* Scheduled Options Panel */}
            {orderTiming === 'scheduled' && (
              <div className="p-4 bg-slate-950/80 border border-amber-500/30 rounded-2xl space-y-4 animate-in fade-in duration-200">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-2 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" /> Selecione o Dia do Agendamento:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setScheduleDateType('hoje')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        scheduleDateType === 'hoje'
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      Hoje
                    </button>

                    <button
                      type="button"
                      onClick={() => setScheduleDateType('amanha')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        scheduleDateType === 'amanha'
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      Amanhã
                    </button>

                    <button
                      type="button"
                      onClick={() => setScheduleDateType('custom')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        scheduleDateType === 'custom'
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      Outro Dia
                    </button>
                  </div>

                  {scheduleDateType === 'custom' && (
                    <div className="mt-2.5">
                      <input
                        type="date"
                        value={customDate}
                        onChange={e => setCustomDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-slate-900 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> Horário Desejado de {deliveryType === 'delivery' ? 'Entrega' : 'Retirada'}:
                    </span>
                    <span className="text-[10px] text-amber-300 font-mono">
                      Funcionamento: {PIZZERIA_INFO.openingHours}
                    </span>
                  </label>

                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {timeOptions.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setScheduledTime(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          scheduledTime === t
                            ? 'bg-emerald-500 text-slate-950 border border-emerald-400 shadow'
                            : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Ou digite outro horário:</span>
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={e => setScheduledTime(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>
                    Resumo do Agendamento: <strong>{getFormattedScheduledDate()} às {scheduledTime}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 3. Customer Personal Info */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase text-amber-400 tracking-wider">3. Seus Dados</label>
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
                    placeholder="(75) 99999-8888"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Delivery Address (if Delivery) */}
          {deliveryType === 'delivery' && (
            <div className="space-y-3 p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
              <label className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> 4. Endereço de Entrega
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-slate-300 block mb-1">Rua / Avenida *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    placeholder="Ex: Av. Getúlio Vargas"
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
                    placeholder="Ex: Centro"
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
                    placeholder="Ex: Próximo à praça"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. Payment Method */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase text-amber-400 tracking-wider">
              {deliveryType === 'delivery' ? '5. Forma de Pagamento' : '4. Forma de Pagamento'}
            </label>

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

          {/* Additional Notes */}
          <div>
            <label className="text-[11px] text-slate-300 block mb-1">Observações Adicionais (opcional)</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Sem cebola em uma das pizzas, tocar a campainha..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
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
              <span>{orderTiming === 'scheduled' ? 'Enviar Agendamento pelo WhatsApp' : 'Enviar Pedido pelo WhatsApp'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

