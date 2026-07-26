import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { MenuSection } from './components/MenuSection';
import { PizzaBuilderModal } from './components/PizzaBuilderModal';
import { ComboModal } from './components/ComboModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';

import { CartItem, SelectedPizza, PizzaFlavor, SideItem, ComboItem, StuffedCrust, Coupon } from './types';
import { PIZZERIA_INFO } from './data/pizzaData';
import { formatCurrency } from './utils/whatsapp';
import { Sparkles, Pizza, Phone, MapPin, Heart, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('pizzeria-theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const handleToggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('pizzeria-theme', next);
      return next;
    });
  };

  // Application State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderInitialFlavor, setBuilderInitialFlavor] = useState<PizzaFlavor | null>(null);
  
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [activeCombo, setActiveCombo] = useState<ComboItem | null>(null);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('todos');

  // Success Payload
  const [formattedOrderMessage, setFormattedOrderMessage] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [lastOrderId, setLastOrderId] = useState('');

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Cart Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  // Open Builder with optional initial flavor
  const handleOpenCustomBuilder = (flavor?: PizzaFlavor) => {
    setBuilderInitialFlavor(flavor || null);
    setIsBuilderOpen(true);
  };

  // Add Custom Pizza to Cart
  const handleAddPizzaToCart = (selectedPizza: SelectedPizza, quantity: number, unitPrice: number) => {
    const newItem: CartItem = {
      id: `pizza-${Date.now()}-${Math.random()}`,
      type: 'pizza',
      pizzaDetails: selectedPizza,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
    };

    setCartItems(prev => [...prev, newItem]);
    showToast(`🍕 Pizza ${selectedPizza.size.name} adicionada ao seu pedido!`);
  };

  // Add Side Item Direct
  const handleAddSideDirect = (side: SideItem) => {
    const existingIndex = cartItems.findIndex(
      item => item.type === 'side' && item.sideDetails?.item.id === side.id
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      const existing = updated[existingIndex];
      const newQty = existing.quantity + 1;
      updated[existingIndex] = {
        ...existing,
        quantity: newQty,
        totalPrice: existing.unitPrice * newQty,
      };
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        id: `side-${Date.now()}-${Math.random()}`,
        type: 'side',
        sideDetails: { item: side },
        quantity: 1,
        unitPrice: side.price,
        totalPrice: side.price,
      };
      setCartItems(prev => [...prev, newItem]);
    }

    showToast(`🥤 ${side.name} adicionado ao pedido!`);
  };

  // Open Combo Modal
  const handleStartComboSelection = (combo: ComboItem) => {
    setActiveCombo(combo);
    setIsComboModalOpen(true);
  };

  // Confirm Combo
  const handleConfirmCombo = (
    combo: ComboItem,
    selectedFlavors: PizzaFlavor[],
    selectedCrust: StuffedCrust
  ) => {
    const newItem: CartItem = {
      id: `combo-${Date.now()}-${Math.random()}`,
      type: 'combo',
      comboDetails: {
        combo,
        selectedFlavors,
        selectedCrust,
      },
      quantity: 1,
      unitPrice: combo.price,
      totalPrice: combo.price,
    };

    setCartItems(prev => [...prev, newItem]);
    showToast(`🏷️ ${combo.name} adicionado ao pedido!`);
  };

  // Update Cart Item Quantity
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: item.unitPrice * newQuantity,
          };
        }
        return item;
      })
    );
  };

  // Remove Item
  const handleRemoveItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Proceed to Checkout
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Order Completed
  const handleOrderCompleted = (
    formattedMessage: string,
    url: string,
    orderId: string
  ) => {
    setFormattedOrderMessage(formattedMessage);
    setWhatsappUrl(url);
    setLastOrderId(orderId);

    setIsCheckoutOpen(false);
    setIsSuccessOpen(true);
    
    // Automatically trigger window.open for WhatsApp
    window.open(url, '_blank');
  };

  const handleNewOrder = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setIsSuccessOpen(false);
  };

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 selection:bg-amber-500 selection:text-slate-950 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-amber-50/50 text-slate-900'
    }`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 px-4 py-3 rounded-2xl shadow-2xl font-black text-xs sm:text-sm flex items-center gap-2 animate-in slide-in-from-bottom-5 border-2 border-slate-950">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* App Header */}
      <Header
        cartCount={cartCount}
        cartTotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCustomBuilder={() => handleOpenCustomBuilder()}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Hero Banner */}
      <HeroBanner
        onOpenCustomBuilder={() => handleOpenCustomBuilder()}
        onSelectCategory={cat => {
          setSelectedCategory(cat);
          const el = document.getElementById('cardapio');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Menu & Pizza Customizer Section */}
      <main className="flex-1">
        <MenuSection
          onOpenCustomBuilder={handleOpenCustomBuilder}
          onAddSideDirect={handleAddSideDirect}
          onAddComboDirect={handleStartComboSelection}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          theme={theme}
        />
      </main>

      {/* Footer */}
      <footer className={`border-t py-10 text-xs mt-16 transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-slate-900 border-slate-800 text-slate-400'
          : 'bg-white border-amber-200/80 text-slate-600 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-6 ${
            theme === 'dark' ? 'border-slate-800/80' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 p-0.5 flex items-center justify-center shadow-sm">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl">
                  🍕
                </div>
              </div>
              <div>
                <h3 className={`text-base font-extrabold font-serif ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{PIZZERIA_INFO.name}</h3>
                <p className="text-[11px] text-slate-500">{PIZZERIA_INFO.slogan}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-amber-600 dark:text-amber-300 flex-wrap justify-center sm:justify-end">
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4 text-amber-500" /> {PIZZERIA_INFO.phoneDisplay}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-amber-500" /> {PIZZERIA_INFO.address}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] text-slate-500">
            <div className="space-y-1">
              <p>© 2026 {PIZZERIA_INFO.name}. Todos os direitos reservados.</p>
              <p className="inline-flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Site fictício demonstrativo para apresentação a clientes interessados na criação de sites e sistemas web.</span>
              </p>
            </div>
            <p className="flex items-center justify-center gap-1 text-slate-400">
              Desenvolvido para amantes de pizza <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            </p>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <PizzaBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onAddToCart={handleAddPizzaToCart}
        initialFlavor={builderInitialFlavor}
      />

      <ComboModal
        combo={activeCombo}
        isOpen={isComboModalOpen}
        onClose={() => setIsComboModalOpen(false)}
        onConfirmCombo={handleConfirmCombo}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={setAppliedCoupon}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        appliedCoupon={appliedCoupon}
        onOrderCompleted={handleOrderCompleted}
      />

      <OrderSuccessModal
        isOpen={isSuccessOpen}
        orderId={lastOrderId}
        formattedMessage={formattedOrderMessage}
        whatsappUrl={whatsappUrl}
        onNewOrder={handleNewOrder}
      />

    </div>
  );
}
