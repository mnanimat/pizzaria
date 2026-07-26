import React, { useState } from 'react';
import { X, Check, Pizza } from 'lucide-react';
import { ComboItem, PizzaFlavor, StuffedCrust, CartItem } from '../types';
import { PIZZA_FLAVORS, STUFFED_CRUSTS } from '../data/pizzaData';
import { formatCurrency } from '../utils/whatsapp';

interface ComboModalProps {
  combo: ComboItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCombo: (combo: ComboItem, selectedFlavors: PizzaFlavor[], selectedCrust: StuffedCrust) => void;
}

export const ComboModal: React.FC<ComboModalProps> = ({
  combo,
  isOpen,
  onClose,
  onConfirmCombo,
}) => {
  if (!isOpen || !combo) return null;

  const [selectedFlavors, setSelectedFlavors] = useState<PizzaFlavor[]>([PIZZA_FLAVORS[0], PIZZA_FLAVORS[1]]);
  const [selectedCrust, setSelectedCrust] = useState<StuffedCrust>(
    STUFFED_CRUSTS.find(c => c.id === combo.crustIncludedId) || STUFFED_CRUSTS[1]
  );

  const handleToggleFlavor = (flavor: PizzaFlavor) => {
    const isAlreadySelected = selectedFlavors.some(f => f.id === flavor.id);
    if (isAlreadySelected) {
      if (selectedFlavors.length > 1) {
        setSelectedFlavors(selectedFlavors.filter(f => f.id !== flavor.id));
      }
    } else {
      if (selectedFlavors.length < combo.includedFlavorsCount) {
        setSelectedFlavors([...selectedFlavors, flavor]);
      } else {
        const updated = [...selectedFlavors];
        updated[updated.length - 1] = flavor;
        setSelectedFlavors(updated);
      }
    }
  };

  const handleConfirm = () => {
    onConfirmCombo(combo, selectedFlavors, selectedCrust);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-2xl text-white shadow-2xl overflow-hidden">
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase">Personalizar Combo</span>
            <h3 className="text-base font-extrabold text-white font-serif">{combo.name}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-slate-800 hover:bg-slate-700">
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Flavor Selection */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase">
              1. Selecione os {combo.includedFlavorsCount} Sabores da Pizza do Combo
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PIZZA_FLAVORS.map(flavor => {
                const isSelected = selectedFlavors.some(f => f.id === flavor.id);
                return (
                  <button
                    key={flavor.id}
                    onClick={() => handleToggleFlavor(flavor)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{flavor.name}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{flavor.description}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Crust Selection */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase">2. Selecione a Borda Recheada</div>
            <div className="grid grid-cols-2 gap-2">
              {STUFFED_CRUSTS.slice(0, 4).map(crust => {
                const isSelected = selectedCrust.id === crust.id;
                return (
                  <button
                    key={crust.id}
                    onClick={() => setSelectedCrust(crust)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected ? 'bg-amber-500/10 border-amber-500 text-white' : 'bg-slate-800/40 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">{crust.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block">Preço do Combo</span>
            <span className="text-lg font-black text-amber-400">{formatCurrency(combo.price)}</span>
          </div>
          <button
            onClick={handleConfirm}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
          >
            Adicionar Combo ao Pedido
          </button>
        </div>
      </div>
    </div>
  );
};
