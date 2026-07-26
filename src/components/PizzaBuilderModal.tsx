import React, { useState, useMemo } from 'react';
import { X, Check, Pizza, ChevronRight, AlertCircle, Info, Sparkles, Plus, Minus } from 'lucide-react';
import { PIZZA_SIZES, PIZZA_FLAVORS, STUFFED_CRUSTS } from '../data/pizzaData';
import { PizzaSize, PizzaFlavor, StuffedCrust, SelectedPizza } from '../types';
import { formatCurrency } from '../utils/whatsapp';

interface PizzaBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (pizza: SelectedPizza, quantity: number, unitPrice: number) => void;
  initialFlavor?: PizzaFlavor | null;
}

export const PizzaBuilderModal: React.FC<PizzaBuilderModalProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  initialFlavor,
}) => {
  // Wizard States
  const [selectedSize, setSelectedSize] = useState<PizzaSize>(PIZZA_SIZES[2]); // Default Grande (8 fatias)
  const [selectedFlavors, setSelectedFlavors] = useState<PizzaFlavor[]>(
    initialFlavor ? [initialFlavor] : [PIZZA_FLAVORS[0]]
  );
  const [selectedCrust, setSelectedCrust] = useState<StuffedCrust>(STUFFED_CRUSTS[0]);
  const [doughType, setDoughType] = useState<'tradicional' | 'fina' | 'pan'>('tradicional');
  const [extraCheese, setExtraCheese] = useState<boolean>(false);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [flavorFilter, setFlavorFilter] = useState<'todos' | 'tradicional' | 'especial' | 'doce'>('todos');

  // Handle Size change and ensure flavors count complies with maxFlavors
  const handleSelectSize = (size: PizzaSize) => {
    setSelectedSize(size);
    if (selectedFlavors.length > size.maxFlavors) {
      setSelectedFlavors(selectedFlavors.slice(0, size.maxFlavors));
    }
  };

  // Toggle flavor selection (1, 2 or 3 flavors)
  const handleToggleFlavor = (flavor: PizzaFlavor) => {
    const isAlreadySelected = selectedFlavors.some(f => f.id === flavor.id);

    if (isAlreadySelected) {
      // Must keep at least 1 flavor
      if (selectedFlavors.length > 1) {
        setSelectedFlavors(selectedFlavors.filter(f => f.id !== flavor.id));
      }
    } else {
      if (selectedFlavors.length < selectedSize.maxFlavors) {
        setSelectedFlavors([...selectedFlavors, flavor]);
      } else {
        // If reached max, replace the last one or switch single flavor
        if (selectedSize.maxFlavors === 1) {
          setSelectedFlavors([flavor]);
        } else {
          // Replace second/last flavor
          const updated = [...selectedFlavors];
          updated[updated.length - 1] = flavor;
          setSelectedFlavors(updated);
        }
      }
    }
  };

  // Filtered Flavors
  const filteredFlavors = useMemo(() => {
    if (flavorFilter === 'todos') return PIZZA_FLAVORS;
    return PIZZA_FLAVORS.filter(f => f.category === flavorFilter);
  }, [flavorFilter]);

  // Price Calculation Logic
  const calculatedUnitPrice = useMemo(() => {
    let price = selectedSize.basePrice;

    // Highest price modifier among selected flavors (standard Brazilian pizza rule) or average
    const maxModifier = Math.max(0, ...selectedFlavors.map(f => f.priceModifier));
    price += maxModifier;

    // Add Stuffed Crust Price
    price += selectedCrust.price;

    // Extra cheese
    if (extraCheese) price += 5.00;

    return price;
  }, [selectedSize, selectedFlavors, selectedCrust, extraCheese]);

  const calculatedTotalPrice = calculatedUnitPrice * quantity;

  const handleConfirmOrder = () => {
    const pizza: SelectedPizza = {
      size: selectedSize,
      flavors: selectedFlavors,
      crust: selectedCrust,
      doughType,
      extraCheese,
      customNotes,
    };

    onAddToCart(pizza, quantity, calculatedUnitPrice);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl text-white overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-lg">
                🍕
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-serif">Monte Sua Pizza Personalizada</h2>
              <p className="text-xs text-amber-300/80">Escolha o tamanho, combinação de sabores e borda recheada</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable Wizard */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 divide-y divide-slate-800/80">

          {/* STEP 1: Select Size */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center">1</span>
                Escolha o Tamanho da Pizza
              </h3>
              <span className="text-xs text-slate-400">Até {selectedSize.maxFlavors} {selectedSize.maxFlavors === 1 ? 'sabor' : 'sabores'}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PIZZA_SIZES.map(size => {
                const isSelected = selectedSize.id === size.id;
                return (
                  <button
                    key={size.id}
                    onClick={() => handleSelectSize(size)}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10 text-white'
                        : 'bg-slate-800/50 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                    <div className="text-xs font-black uppercase text-amber-300">{size.name}</div>
                    <div className="text-lg font-black text-white mt-0.5">{formatCurrency(size.basePrice)}</div>
                    <div className="text-[11px] text-slate-400 mt-1 leading-tight">{size.description}</div>
                    <div className="text-[10px] text-slate-500 mt-2 font-medium">Serves {size.recommendedFor}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Select Flavors */}
          <div className="pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center">2</span>
                  Escolha {selectedSize.maxFlavors === 1 ? 'o Sabor' : `até ${selectedSize.maxFlavors} Sabores (Meio a Meio)`}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Selecionados: {selectedFlavors.length} de {selectedSize.maxFlavors}
                </p>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                {(['todos', 'tradicional', 'especial', 'doce'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFlavorFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                      flavorFilter === cat
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Flavors Preview Bar */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-amber-500/20 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-amber-300 mr-2">Sua combinação:</span>
              {selectedFlavors.map((flavor, index) => (
                <div key={flavor.id} className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-semibold px-3 py-1 rounded-full">
                  <span>
                    {selectedFlavors.length > 1 ? `1/${selectedFlavors.length}` : 'Inteira'} {flavor.name}
                  </span>
                  {selectedFlavors.length > 1 && (
                    <button
                      onClick={() => handleToggleFlavor(flavor)}
                      className="hover:text-red-400 text-amber-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {selectedFlavors.length < selectedSize.maxFlavors && (
                <span className="text-xs text-slate-400 italic">
                  (Você pode adicionar mais {selectedSize.maxFlavors - selectedFlavors.length} sabor)
                </span>
              )}
            </div>

            {/* Flavor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {filteredFlavors.map(flavor => {
                const isSelected = selectedFlavors.some(f => f.id === flavor.id);
                return (
                  <div
                    key={flavor.id}
                    onClick={() => handleToggleFlavor(flavor)}
                    className={`p-3 rounded-2xl border flex gap-3 transition-all cursor-pointer group relative ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 shadow-md text-white'
                        : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={flavor.image}
                      alt={flavor.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-extrabold text-white truncate">{flavor.name}</h4>
                          {flavor.priceModifier > 0 && (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                              +{formatCurrency(flavor.priceModifier)}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{flavor.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 text-[10px]">
                        <div className="flex items-center gap-1.5">
                          {flavor.isVegetarian && <span className="text-emerald-400 font-medium">🌱 Veg</span>}
                          {flavor.isSpicy && <span className="text-red-400 font-medium">🌶️ Apimentada</span>}
                          {flavor.category === 'doce' && <span className="text-pink-400 font-medium">🍫 Doce</span>}
                        </div>
                        <span className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {isSelected ? 'Selecionado' : 'Escolher'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Stuffed Crusts */}
          <div className="pt-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center">3</span>
              Borda Recheada (Opcional)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {STUFFED_CRUSTS.map(crust => {
                const isSelected = selectedCrust.id === crust.id;
                return (
                  <button
                    key={crust.id}
                    onClick={() => setSelectedCrust(crust)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{crust.name}</div>
                      <div className="text-[11px] text-slate-400">{crust.description}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs font-black ${crust.price === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {crust.price === 0 ? 'Grátis' : `+${formatCurrency(crust.price)}`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4: Dough & Custom Extras */}
          <div className="pt-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center">4</span>
              Tipo de Massa & Adicionais
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Dough options */}
              <button
                onClick={() => setDoughType('tradicional')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  doughType === 'tradicional' ? 'bg-amber-500/10 border-amber-500 text-white' : 'bg-slate-800/40 border-slate-800 text-slate-300'
                }`}
              >
                <div className="text-xs font-bold">Massa Tradicional</div>
                <div className="text-[10px] text-slate-400">Crosta média no ponto ideal</div>
              </button>

              <button
                onClick={() => setDoughType('fina')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  doughType === 'fina' ? 'bg-amber-500/10 border-amber-500 text-white' : 'bg-slate-800/40 border-slate-800 text-slate-300'
                }`}
              >
                <div className="text-xs font-bold">Massa Fina e Crocante</div>
                <div className="text-[10px] text-slate-400">Leve e super crocante</div>
              </button>

              <button
                onClick={() => setDoughType('pan')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  doughType === 'pan' ? 'bg-amber-500/10 border-amber-500 text-white' : 'bg-slate-800/40 border-slate-800 text-slate-300'
                }`}
              >
                <div className="text-xs font-bold">Massa Pan Fofinha</div>
                <div className="text-[10px] text-slate-400">Alta e macia por dentro</div>
              </button>
            </div>

            {/* Extra Cheese Checkbox */}
            <div className="flex items-center justify-between p-3.5 bg-slate-800/40 border border-slate-800 rounded-2xl">
              <div>
                <span className="text-xs font-bold text-white block">🧀 Extra de Muçarela Gratinada</span>
                <span className="text-[11px] text-slate-400">Adicione uma camada extra de queijo por cima</span>
              </div>
              <button
                type="button"
                onClick={() => setExtraCheese(!extraCheese)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  extraCheese ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {extraCheese ? 'Com Extra (+R$ 5,00)' : 'Adicionar (+R$ 5,00)'}
              </button>
            </div>

            {/* Notes Input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Observações do Pedido (Ex: sem cebola, bem assada, cortar em 12 fatias)
              </label>
              <input
                type="text"
                value={customNotes}
                onChange={e => setCustomNotes(e.target.value)}
                placeholder="Escreva detalhes para o pizzaiolo..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

        </div>

        {/* Modal Footer / Total & Submit */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 z-20">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs font-bold text-slate-300">Qtd:</span>
            <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-sm font-extrabold text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="sm:hidden text-right">
              <span className="text-[10px] text-slate-400 block uppercase">Total</span>
              <span className="text-base font-black text-amber-400">{formatCurrency(calculatedTotalPrice)}</span>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            <div className="hidden sm:block text-right">
              <span className="text-[10px] text-slate-400 block uppercase">Preço Total</span>
              <span className="text-lg font-black text-amber-400">{formatCurrency(calculatedTotalPrice)}</span>
            </div>

            <button
              onClick={handleConfirmOrder}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-slate-950 hover:text-white font-black text-sm px-6 py-3 rounded-2xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Pizza className="w-4 h-4" />
              <span>Adicionar ao Pedido • {formatCurrency(calculatedTotalPrice)}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
