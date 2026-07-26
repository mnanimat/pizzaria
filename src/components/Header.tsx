import React from 'react';
import { ShoppingBag, Clock, MapPin, Flame, Sparkles, Sun, Moon } from 'lucide-react';
import { PIZZERIA_INFO } from '../data/pizzaData';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenCustomBuilder: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenCustomBuilder,
  theme,
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-300 ${
      isDark 
        ? 'bg-slate-900/95 text-white border-b border-amber-500/20 shadow-xl backdrop-blur-md' 
        : 'bg-white/95 text-slate-900 border-b border-amber-200 shadow-md backdrop-blur-md'
    }`}>
      {/* Top Bar info */}
      <div className="bg-gradient-to-r from-red-700 via-amber-600 to-red-700 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 flex-wrap text-white">
        <span className="inline-flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-full text-amber-100">
          <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          Forno a Lenha Aceso
        </span>
        <span>• Entrega rápida em {PIZZERIA_INFO.estimatedTime}</span>
        <span className="hidden md:inline">• Use o cupom <strong className="bg-amber-300 text-slate-950 px-1 rounded font-bold">PRIMEIRO10</strong> para 10% OFF!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 p-0.5 shadow-lg shadow-red-900/30 flex items-center justify-center transform hover:scale-105 transition-transform">
            <div className={`w-full h-full rounded-[14px] flex items-center justify-center text-xl font-black ${
              isDark ? 'bg-slate-950 text-amber-400' : 'bg-slate-900 text-amber-300'
            }`}>
              🍕
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl sm:text-2xl font-extrabold tracking-tight font-serif ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {PIZZERIA_INFO.name}
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Aberto
              </span>
            </div>
            <p className={`text-xs hidden sm:block ${isDark ? 'text-amber-200/80' : 'text-slate-600'}`}>
              {PIZZERIA_INFO.slogan}
            </p>
          </div>
        </div>

        {/* Quick Info desktop */}
        <div className={`hidden lg:flex items-center gap-6 text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <div>
              <span className={`block text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Funcionamento</span>
              <span className="font-semibold">18:00 às 23:30</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-500" />
            <div>
              <span className={`block text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Localização</span>
              <span className="font-semibold max-w-[220px] truncate block" title={PIZZERIA_INFO.address}>
                {PIZZERIA_INFO.address}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Theme Switcher Button */}
          <button
            onClick={onToggleTheme}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold border transition-all active:scale-95 cursor-pointer shadow-sm ${
              isDark
                ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700 hover:text-amber-200'
                : 'bg-amber-100 text-amber-950 border-amber-300 hover:bg-amber-200'
            }`}
            title={isDark ? 'Mudar para Tom Claro' : 'Mudar para Tom Escuro'}
            aria-label="Alternar tema claro/escuro"
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">Tom Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-amber-800" />
                <span className="hidden md:inline">Tom Escuro</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenCustomBuilder}
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Monte Sua Pizza</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-xl font-bold shadow-lg shadow-red-600/30 transition-all active:scale-95 group cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-amber-200 group-hover:scale-110 transition-transform" />
            <div className="text-left hidden xs:block">
              <span className="text-[10px] block text-red-200 uppercase font-semibold leading-none">Seu Pedido</span>
              <span className="text-xs font-extrabold text-white">
                {cartTotal > 0 ? cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}
              </span>
            </div>
            {cartCount > 0 && (
              <span className="bg-amber-400 text-slate-950 font-black text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-red-700 shadow-sm animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
