import React from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles } from 'lucide-react';

interface BlackCardProps {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
  focusedField: string;
}

export const BlackCard: React.FC<BlackCardProps> = ({
  number,
  name,
  expiry,
  cvc,
  focusedField,
}) => {
  const isFlipped = focusedField === 'cvc';

  // Detect card type (e.g., Visa if starts with 4, Mastercard if 5)
  const getCardType = () => {
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5')) return 'Mastercard';
    return 'Elite Club';
  };

  const formatCardNumber = (num: string) => {
    const defaultPlaceholder = '•••• •••• •••• ••••';
    if (!num) return defaultPlaceholder;
    
    // Auto spacing of 4 digits
    const cleaned = num.replace(/\s?/g, '').substring(0, 16);
    const groups = cleaned.match(/.{1,4}/g);
    
    if (!groups) return defaultPlaceholder;
    const formatted = groups.join(' ');
    
    // Fill the rest with placeholders
    const missingChars = 16 - cleaned.length;
    const dotsNeeded = Math.ceil(missingChars / 4);
    let restPlaceholder = '';
    
    for (let i = 0; i < dotsNeeded; i++) {
      const size = Math.min(4, missingChars - i * 4);
      if (size > 0) {
        restPlaceholder += ' ' + '•'.repeat(size);
      }
    }
    
    return (formatted + restPlaceholder).trim();
  };

  return (
    <div className="w-full flex justify-center py-6 perspective-1000">
      <motion.div
        className="relative w-full max-w-[340px] h-[210px] cursor-pointer rounded-2xl preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Front of the Card */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between backface-hidden black-card overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #181d24 0%, #080a0d 100%)',
          }}
        >
          {/* Decorative glow lines */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-gold-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gold-600/5 rounded-full blur-xl pointer-events-none" />

          {/* Top Row: Metallic Chip & Type logo */}
          <div className="flex justify-between items-center z-10" id="card-top-row">
            {/* Holographic Metal Chip */}
            <div className="w-11 h-8 rounded-md bg-gradient-to-r from-amber-200 via-amber-100 to-yellow-600 p-[1px] relative shadow-inner overflow-hidden">
              <div className="w-full h-full bg-stone-900/40 rounded-[5px] flex flex-col justify-around p-1">
                <div className="flex justify-between">
                  <div className="w-2 h-[2px] bg-amber-200/50" />
                  <div className="w-2 h-[2px] bg-amber-200/50" />
                </div>
                <div className="w-full h-[1px] bg-amber-200/30" />
                <div className="flex justify-between">
                  <div className="w-2 h-[2px] bg-amber-200/50" />
                  <div className="w-2 h-[2px] bg-amber-200/50" />
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="flex items-center space-x-1.5 font-mono text-xs text-gold-400 font-extrabold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>{getCardType()}</span>
            </div>
          </div>

          {/* Center Card Number */}
          <div className="my-3 z-10" id="card-number-wrapper">
            <p className="text-xl md:text-2xl font-mono text-gold-100 font-black tracking-[0.18em] drop-shadow-md text-center">
              {formatCardNumber(number)}
            </p>
          </div>

          {/* Bottom Row: Holder Name & Expiry */}
          <div className="flex justify-between items-end z-10" id="card-bottom-row">
            <div className="flex-1 mr-3">
              <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold mb-0.5">Titular de Tarjeta</p>
              <p className="text-xs font-mono tracking-wider text-white uppercase font-bold truncate max-w-[180px]">
                {name || 'EXCELENTÍSIMO CLIENTE'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold mb-0.5">Vence</p>
              <p className="text-xs font-mono tracking-wider text-white font-bold">
                {expiry || 'MM/AA'}
              </p>
            </div>
          </div>
        </div>

        {/* Back of the Card */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl flex flex-col justify-between backface-hidden black-card rotate-y-180 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0d1015 0%, #040507 100%)',
          }}
        >
          {/* Top Black Magnetic Strip */}
          <div className="w-full h-11 bg-zinc-950 mt-5 shadow-lg" />

          {/* Signature panel & CVC */}
          <div className="px-6 py-2 flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Reserva Exclusiva de Servicios</span>
              <Shield className="w-3 h-3 text-gold-500" />
            </div>
            <div className="flex items-center space-x-2">
              {/* Signature lookalike */}
              <div className="flex-1 h-9 bg-zinc-800/80 rounded-md border border-zinc-700/50 flex items-center px-3 justify-start overflow-hidden">
                <span className="font-serif italic text-sm text-zinc-400 select-none opacity-60">Elite Barber Concierge Chile</span>
              </div>
              {/* Physical CVC */}
              <div className="w-12 h-8 bg-gold-400 text-zinc-950 rounded-md font-mono text-xs font-black tracking-widest flex items-center justify-center shadow-inner">
                {cvc || '•••'}
              </div>
            </div>
          </div>

          {/* Hologram or terms */}
          <div className="px-6 pb-5 flex justify-between items-center" id="card-back-footer">
            <span className="text-[7px] text-zinc-600 font-mono tracking-tight leading-none max-w-[180px]">
              Válido únicamente para servicios y rituales de Alexander Wright en Elite Barber. Sujeto a estrictas políticas de membresía. Chile.
            </span>
            <div className="w-6 h-6 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-gold-500/60" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
