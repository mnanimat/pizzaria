import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Plus, Pizza, Coffee, Utensils, Percent, ChevronRight, Check } from 'lucide-react';
import { PIZZA_FLAVORS, SIDE_ITEMS, COMBOS, PIZZA_SIZES, STUFFED_CRUSTS } from '../data/pizzaData';
import { PizzaFlavor, SideItem, ComboItem } from '../types';
import { formatCurrency } from '../utils/whatsapp';

interface MenuSectionProps {
  onOpenCustomBuilder: (flavor?: PizzaFlavor) => void;
  onAddSideDirect: (side: SideItem) => void;
  onAddComboDirect: (combo: ComboItem) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  theme?: 'dark' | 'light';
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  onOpenCustomBuilder,
  onAddSideDirect,
  onAddComboDirect,
  selectedCategory,
  onSelectCategory,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVeggie, setFilterVeggie] = useState(false);
  const [filterSpicy, setFilterSpicy] = useState(false);

  // Filtered Flavors
  const filteredFlavors = useMemo(() => {
    return PIZZA_FLAVORS.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            f.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesVeg = !filterVeggie || f.isVegetarian;
      const matchesSpicy = !filterSpicy || f.isSpicy;
      return matchesSearch && matchesVeg && matchesSpicy;
    });
  }, [searchQuery, filterVeggie, filterSpicy]);

  // Filtered Sides
  const filteredSides = useMemo(() => {
    return SIDE_ITEMS.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  return (
    <section id="cardapio" className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      
      {/* Category Navigation Bar */}
      <div className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        {[
          { id: 'todos', label: '🍕 Cardápio Completo' },
          { id: 'combos', label: '🏷️ Combos Econômicos' },
          { id: 'pizzas', label: '🍕 Pizzas Populares' },
          { id: 'acompanhamentos', label: '🍟 Acompanhamentos' },
          { id: 'bebidas', label: '🥤 Bebidas & Molhos' },
        ].map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : isDark
                    ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                    : 'bg-white text-slate-700 hover:bg-amber-100/80 hover:text-slate-900 border border-slate-200 shadow-sm'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search and Filters Bar */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border transition-colors ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por pão de alho, sabor, guarana..."
            className={`w-full border rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-amber-500 ${
              isDark 
                ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
          <button
            onClick={() => setFilterVeggie(!filterVeggie)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              filterVeggie 
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300' 
                : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            🌱 Apenas Vegetarianas
          </button>
          <button
            onClick={() => setFilterSpicy(!filterSpicy)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              filterSpicy 
                ? 'bg-red-500/20 border-red-500 text-red-700 dark:text-red-300' 
                : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            🌶️ Apimentadas
          </button>
        </div>
      </div>

      {/* SECTION: COMBOS ECONÔMICOS */}
      {(selectedCategory === 'todos' || selectedCategory === 'combos') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-black font-serif flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span className="text-amber-500">🏷️</span> Combos Econômicos com Desconto
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Kits completos com pizza, pão de alho ou borda e bebida por um preço especial
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {COMBOS.map(combo => (
              <div
                key={combo.id}
                className={`border rounded-3xl overflow-hidden shadow-xl transition-all flex flex-col group ${
                  isDark 
                    ? 'bg-slate-900 border-amber-500/30 hover:border-amber-500/60' 
                    : 'bg-white border-amber-400/60 hover:border-amber-500 shadow-amber-500/5'
                }`}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={combo.image}
                    alt={combo.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-slate-900' : 'from-white'} via-transparent to-transparent`}></div>
                  <div className="absolute top-3 left-3 bg-red-600 text-white font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md">
                    Econômico
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-200 text-[10px] line-through px-2 py-0.5 rounded-md">
                    {formatCurrency(combo.originalPrice)}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className={`text-base font-extrabold font-serif ${isDark ? 'text-white' : 'text-slate-900'}`}>{combo.name}</h3>
                    <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{combo.description}</p>
                  </div>

                  <div className={`pt-2 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div>
                      <span className={`text-[10px] block uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>A partir de</span>
                      <span className="text-xl font-black text-amber-600 dark:text-amber-400">{formatCurrency(combo.price)}</span>
                    </div>

                    <button
                      onClick={() => onAddComboDirect(combo)}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Escolher Sabores</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: PIZZAS POPULARES */}
      {(selectedCategory === 'todos' || selectedCategory === 'pizzas') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-black font-serif flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span className="text-amber-500">🍕</span> Sabores Mais Pedidos
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Escolha o sabor para personalizar o tamanho e borda
              </p>
            </div>
            <button
              onClick={() => onOpenCustomBuilder()}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Montar do Zero</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFlavors.map(flavor => (
              <div
                key={flavor.id}
                className={`border rounded-3xl overflow-hidden transition-all flex flex-col group ${
                  isDark 
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-lg' 
                    : 'bg-white border-slate-200 hover:border-amber-300 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={flavor.image}
                    alt={flavor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-slate-900 via-slate-900/20' : 'from-white via-transparent'} to-transparent`}></div>
                  
                  {flavor.isPopular && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md">
                      🔥 Campeã de Vendas
                    </span>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5">
                    {flavor.isVegetarian && (
                      <span className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-md">
                        🌱 Vegetariana
                      </span>
                    )}
                    {flavor.isSpicy && (
                      <span className="bg-red-950/80 border border-red-500/30 text-red-300 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-md">
                        🌶️ Apimentada
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{flavor.name}</h3>
                    <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{flavor.description}</p>
                    
                    {/* Ingredients Pills */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {flavor.ingredients.map((ing, i) => (
                        <span key={i} className={`text-[10px] px-2 py-0.5 rounded-md ${
                          isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={`pt-3 border-t flex items-center justify-between ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`}>
                    <div>
                      <span className={`text-[10px] block uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Pizza Grande 8 fatias</span>
                      <span className="text-base font-black text-amber-600 dark:text-amber-400">
                        {formatCurrency(PIZZA_SIZES[2].basePrice + flavor.priceModifier)}
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenCustomBuilder(flavor)}
                      className={`font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                        isDark 
                          ? 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white' 
                          : 'bg-amber-100 hover:bg-amber-500 text-amber-950 hover:text-slate-950 border border-amber-200'
                      }`}
                    >
                      <Pizza className="w-3.5 h-3.5" />
                      <span>Montar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: ACOMPANHAMENTOS & BEBIDAS */}
      {(selectedCategory === 'todos' || selectedCategory === 'acompanhamentos' || selectedCategory === 'bebidas') && (
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-xl font-black font-serif flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span className="text-amber-500">🧄</span> Acompanhamentos, Bebidas e Sobremesas
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Experimente nosso Pão de Alho Especial Recheado, porções crocantes e bebidas geladas
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSides.map(side => {
              const isPaoDeAlho = side.id === 'pao_alho';
              return (
                <div
                  key={side.id}
                  id={isPaoDeAlho ? 'pao-de-alho-card' : undefined}
                  className={`border p-3.5 rounded-2xl flex items-center gap-3 transition-all relative ${
                    isPaoDeAlho
                      ? 'ring-2 ring-amber-500/60 shadow-lg shadow-amber-500/10'
                      : ''
                  } ${
                    isDark 
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700' 
                      : 'bg-white border-slate-200 hover:border-amber-300 shadow-sm'
                  }`}
                >
                  {isPaoDeAlho && (
                    <span className="absolute -top-2.5 right-3 bg-gradient-to-r from-amber-500 to-red-600 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-full shadow">
                      ⭐ Especial da Casa
                    </span>
                  )}
                  <img
                    src={side.image}
                    alt={side.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-20">
                    <div>
                      <h4 className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{side.name}</h4>
                      <p className={`text-[11px] line-clamp-2 mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{side.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-amber-600 dark:text-amber-400">{formatCurrency(side.price)}</span>
                      <button
                        onClick={() => onAddSideDirect(side)}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </section>
  );
};
