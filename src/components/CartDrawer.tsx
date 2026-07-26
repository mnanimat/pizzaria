import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, Truck, Sparkles, CheckCircle2 } from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { COUPONS, PIZZERIA_INFO } from '../data/pizzaData';
import { formatCurrency } from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: () => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
}) => {
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  
  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderValue) {
    discount = (subtotal * appliedCoupon.discountPercent) / 100;
  }

  const isFreeDelivery = subtotal >= PIZZERIA_INFO.freeDeliveryMin;
  const deliveryFee = subtotal > 0 && !isFreeDelivery ? PIZZERIA_INFO.deliveryFee : 0;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  const freeDeliveryRemaining = Math.max(0, PIZZERIA_INFO.freeDeliveryMin - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / PIZZERIA_INFO.freeDeliveryMin) * 100);

  const handleApplyCouponCode = () => {
    setCouponError('');
    const cleanCode = couponCodeInput.trim().toUpperCase();
    const found = COUPONS.find(c => c.code === cleanCode);

    if (!found) {
      setCouponError('Cupom inválido. Tente PRIMEIRO10');
      return;
    }

    if (subtotal < found.minOrderValue) {
      setCouponError(`Mínimo de ${formatCurrency(found.minOrderValue)} para usar este cupom.`);
      return;
    }

    onApplyCoupon(found);
    setCouponCodeInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-amber-500/30 text-white flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white font-serif">Seu Carrinho de Compras</h3>
                <p className="text-xs text-slate-400">{cartItems.length} {cartItems.length === 1 ? 'item' : 'itens'} no pedido</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          {subtotal > 0 && (
            <div className="bg-slate-950/90 border-b border-slate-800 p-3.5 space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Truck className="w-4 h-4 text-amber-400" />
                  {isFreeDelivery ? (
                    <span className="text-emerald-400">🎉 Parabéns! Você ganhou Frete Grátis!</span>
                  ) : (
                    <span>Faltam {formatCurrency(freeDeliveryRemaining)} para Frete Grátis</span>
                  )}
                </span>
                <span className="text-amber-400 font-extrabold">{Math.round(freeDeliveryProgress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${freeDeliveryProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-800/80 mx-auto flex items-center justify-center text-3xl opacity-60">
                  🍕
                </div>
                <h4 className="text-base font-bold text-slate-300">Seu carrinho está vazio</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Adicione saborosas pizzas artesanais, bordas recheadas e bebidas geladas para começar seu pedido.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Ver Cardápio
                </button>
              </div>
            ) : (
              cartItems.map(item => (
                <div
                  key={item.id}
                  className="bg-slate-950/80 border border-slate-800/80 p-3.5 rounded-2xl flex gap-3 relative group"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute top-2 right-2 text-slate-500 hover:text-red-400 transition-colors p-1"
                    title="Remover item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex-1 min-w-0 space-y-1 pr-6">
                    {item.type === 'pizza' && item.pizzaDetails && (
                      <>
                        <span className="text-[10px] font-bold text-amber-400 uppercase bg-amber-500/10 px-1.5 py-0.5 rounded">
                          Pizza {item.pizzaDetails.size.name} ({item.pizzaDetails.size.slices} fatias)
                        </span>
                        <h4 className="text-xs font-bold text-white mt-1">
                          {item.pizzaDetails.flavors.map(f => f.name).join(' + ')}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Borda: {item.pizzaDetails.crust.name}
                        </p>
                        {item.pizzaDetails.extraCheese && (
                          <p className="text-[10px] text-amber-300">+ Extra Muçarela Gratinada</p>
                        )}
                      </>
                    )}

                    {item.type === 'side' && item.sideDetails && (
                      <>
                        <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-800 px-1.5 py-0.5 rounded">
                          Acompanhamento
                        </span>
                        <h4 className="text-xs font-bold text-white mt-1">{item.sideDetails.item.name}</h4>
                        <p className="text-[11px] text-slate-400">{item.sideDetails.item.volumeOrUnit}</p>
                      </>
                    )}

                    {item.type === 'combo' && item.comboDetails && (
                      <>
                        <span className="text-[10px] font-bold text-red-400 uppercase bg-red-500/10 px-1.5 py-0.5 rounded">
                          Combo Especial
                        </span>
                        <h4 className="text-xs font-bold text-white mt-1">{item.comboDetails.combo.name}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {item.comboDetails.selectedFlavors.map(f => f.name).join(' / ')}
                        </p>
                      </>
                    )}

                    <div className="pt-2 flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-2 py-1 rounded-xl">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="text-slate-400 hover:text-white"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-black text-amber-400">
                        {formatCurrency(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-4">
              
              {/* Coupon Input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-950/60 border border-emerald-500/40 p-2.5 rounded-xl text-xs text-emerald-300">
                    <span className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Cupom {appliedCoupon.code} ({appliedCoupon.discountPercent}% OFF)
                    </span>
                    <button
                      onClick={() => onApplyCoupon(null)}
                      className="text-slate-400 hover:text-white text-[11px] underline"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={couponCodeInput}
                          onChange={e => setCouponCodeInput(e.target.value)}
                          placeholder="Possui Cupom? (ex: PRIMEIRO10)"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white uppercase placeholder:normal-case placeholder-slate-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <button
                        onClick={handleApplyCouponCode}
                        className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 cursor-pointer"
                      >
                        Aplicar
                      </button>
                    </div>
                    {couponError && <p className="text-[10px] text-red-400 font-medium">{couponError}</p>}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Desconto ({appliedCoupon?.code})</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxa de Entrega</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-400">Grátis</strong> : formatCurrency(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                  <span>Total Final</span>
                  <span className="text-amber-400">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={onProceedToCheckout}
                className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-slate-950 hover:text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Avançar para Finalizar Pedido</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
