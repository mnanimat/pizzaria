import React from 'react';
import { Sparkles, Pizza, ShieldCheck, Flame, ArrowRight, Percent, Truck } from 'lucide-react';

interface HeroBannerProps {
  onOpenCustomBuilder: () => void;
  onSelectCategory: (category: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenCustomBuilder,
  onSelectCategory,
}) => {
  return (
    <div className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800">
      {/* Background Hero Image with Dark Overlay */}
      <div className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
           style={{
             backgroundImage: `url('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1920&q=80')`
           }}>
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Callout */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Pizzas Artesanais Assadas no Forno a Lenha</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight font-serif">
              A melhor pizza da cidade com <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500">preço justo e borda recheada!</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Monte sua pizza personalizada em segundos! Escolha tamanho, combine até 3 sabores, selecione borda de Catupiry ou Nutella e receba quentinha na sua casa. Pedido enviado direto pelo <strong>WhatsApp</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onOpenCustomBuilder}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-slate-950 hover:text-white font-extrabold text-base px-6 py-3.5 rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 transform active:scale-95 group cursor-pointer"
              >
                <Pizza className="w-5 h-5 text-slate-950 group-hover:text-white" />
                <span>Montar Minha Pizza Agora</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onSelectCategory('combos')}
                className="w-full sm:w-auto bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm px-5 py-3.5 rounded-2xl border border-slate-700 backdrop-blur-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Percent className="w-4 h-4 text-amber-400" />
                <span>Ver Combos Econômicos</span>
              </button>
            </div>

            {/* Badges / Highlights */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-slate-800/80 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Ingredientes Nobres</h4>
                  <p className="text-[10px] text-slate-400">100% fresco e artesanal</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Entrega Expressa</h4>
                  <p className="text-[10px] text-slate-400">Entrega em 35-50 min</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Percent className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Preço Acessível</h4>
                  <p className="text-[10px] text-slate-400">Pizzas a partir de R$ 24,90</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              {/* Floating Highlight Card */}
              <div className="absolute -top-4 -left-4 z-20 bg-slate-900/90 border border-amber-500/30 p-3 rounded-2xl shadow-2xl backdrop-blur-md hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center text-xl">
                  🔥
                </div>
                <div>
                  <div className="text-xs font-black text-amber-300">Super Borda Recheada</div>
                  <div className="text-[10px] text-slate-300">Catupiry, Cheddar ou Nutella!</div>
                </div>
              </div>

              {/* Main Photo Showcase */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl shadow-amber-500/10 group">
                <img
                  src="https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80"
                  alt="Pizza artesanal no forno"
                  className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Destaque do Dia</span>
                    <h3 className="text-sm font-bold text-white">Calabresa com Borda de Catupiry</h3>
                    <p className="text-xs text-slate-400">A partir de R$ 24,90</p>
                  </div>
                  <button
                    onClick={onOpenCustomBuilder}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Pedir
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
