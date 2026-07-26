import React, { useState, useEffect } from 'react';
import { Check, Copy, ExternalLink, MessageSquare, ArrowLeft, Edit3, CheckCircle2, PhoneCall } from 'lucide-react';
import { PIZZERIA_INFO } from '../data/pizzaData';
import { buildWhatsAppUrl } from '../utils/whatsapp';

interface OrderSuccessModalProps {
  isOpen: boolean;
  orderId: string;
  formattedMessage: string;
  whatsappUrl: string;
  onNewOrder: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  orderId,
  formattedMessage,
  whatsappUrl: initialWhatsappUrl,
  onNewOrder,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [customMessage, setCustomMessage] = useState(formattedMessage);

  useEffect(() => {
    setCustomMessage(formattedMessage);
  }, [formattedMessage]);

  if (!isOpen) return null;

  const currentWhatsappUrl = buildWhatsAppUrl(PIZZERIA_INFO.whatsappNumber, customMessage);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    window.open(currentWhatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-2xl text-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-center space-y-2 relative">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto text-white shadow-inner mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white font-serif">Pedido Montado com Sucesso!</h2>
          <p className="text-xs text-emerald-100 flex items-center justify-center gap-1 flex-wrap">
            <span>Pedido <strong className="bg-emerald-950/50 px-2 py-0.5 rounded text-amber-300">#{orderId}</strong> para enviar ao WhatsApp de</span>
            <strong className="bg-emerald-950/70 text-emerald-300 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-400/30">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              Micael Nildo {PIZZERIA_INFO.phoneDisplay}
            </strong>
          </p>
        </div>

        {/* Message Preview Block */}
        <div className="p-5 sm:p-6 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" /> Mensagem do Pedido:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isEditing ? 'Concluir Edição' : 'Editar Mensagem'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
                </button>
              </div>
            </div>

            {isEditing ? (
              <textarea
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                rows={10}
                className="w-full bg-slate-950 border border-amber-500/50 rounded-2xl p-4 text-xs font-mono text-slate-100 leading-relaxed shadow-inner focus:outline-none focus:border-amber-400"
                placeholder="Edite sua mensagem aqui antes de enviar..."
              />
            ) : (
              <pre className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed shadow-inner">
                {customMessage}
              </pre>
            )}
          </div>

          <div className="text-xs text-slate-300 bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between gap-3">
            <p>
              💡 Destino do Pedido: <strong className="text-emerald-400 font-bold">Micael Nildo ({PIZZERIA_INFO.phoneDisplay})</strong>
            </p>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
              WhatsApp Pronto
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleOpenWhatsApp}
              className="w-full sm:flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm py-3.5 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Enviar para o WhatsApp de Micael Nildo</span>
            </button>

            <button
              onClick={onNewOrder}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-5 py-3.5 rounded-2xl border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Novo Pedido</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
