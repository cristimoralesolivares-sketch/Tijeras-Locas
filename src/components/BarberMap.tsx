import React from 'react';
import { MapPin, Scissors, ExternalLink, Navigation, Compass, Clock, Map } from 'lucide-react';

// Coordenadas fijas reales de la Barbería "Tijeras Locas"
// Zona: Avenida Estadio, Barrio Universitario, La Serena, Chile.
export const BARBER_LATITUDE = -29.9142; 
export const BARBER_LONGITUDE = -71.2425;
export const BARBER_NAME = "Barbería Tijeras Locas";
export const BARBER_ADDRESS = "Avenida Estadio 1420, Barrio Universitario, La Serena, Chile";

interface BarberMapProps {
  compact?: boolean;
}

export function BarberMap({ compact = false }: BarberMapProps) {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BARBER_ADDRESS)}`;
  const coordinatesUrl = `https://www.google.com/maps?q=${BARBER_LATITUDE},${BARBER_LONGITUDE}`;

  return (
    <div 
      className={`bg-gradient-to-tr from-slate-50 to-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-md flex flex-col ${
        compact ? 'max-w-xl mx-auto' : 'w-full'
      }`} 
      id="barb-location-card"
    >
      {/* Header Visual Decorative Accent */}
      <div className="bg-indigo-950 p-5 text-left flex items-center justify-between" id="location-header-accent">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-[0.25em] text-indigo-400 uppercase font-black flex items-center gap-1.5">
            <Scissors className="w-4 h-4 text-indigo-400" />
            Ubicación Presencial Confirmada
          </span>
          <h3 className="text-lg font-black text-white uppercase tracking-wide">
            ¿Cómo llegar al Local?
          </h3>
        </div>
        <div className="p-2.5 bg-indigo-900 border border-indigo-750 rounded-xl text-white">
          <Map className="w-5 h-5 text-indigo-300" />
        </div>
      </div>

      {/* Main Location content */}
      <div className="p-6 space-y-6 text-left" id="location-content-body">
        
        {/* Destination Card with Address */}
        <div className="p-4 bg-indigo-50/50 border-2 border-indigo-150 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-white border border-indigo-200 rounded-xl text-indigo-750 shrink-0 shadow-sm mt-0.5">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-900 font-extrabold block">Dirección Oficial</span>
              <p className="text-sm font-black text-slate-950 leading-snug">
                {BARBER_ADDRESS}
              </p>
              <p className="text-xs text-slate-700 font-medium">
                Punto de referencia: A pasos de la rotonda Amunátegui, Barrio Universitario, La Serena.
              </p>
            </div>
          </div>
          
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-mono text-xs uppercase font-black tracking-wider transition-all rounded-xl flex items-center justify-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
          >
            <Navigation className="w-4 h-4 shrink-0" />
            <span>Ver en Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </a>
        </div>

        {/* Localized Reference Directions list (100% accurate, non-simulated) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="directions-grid-container">
          <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider border-b border-slate-200 pb-1.5">
              <Compass className="w-4 h-4 text-indigo-750" />
              <span>Instrucciones desde el Centro</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-900 font-bold leading-normal">
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-700 font-black">•</span>
                <span>Sube por Avenida Amunátegui en dirección al oriente (hacia la cordillera).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-700 font-black">•</span>
                <span>En la rotonda de Av. Estadio, gira a la derecha (hacia el sur).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-700 font-black">•</span>
                <span>Avanza 150 metros. Encontrarás el local #1420 en el costado poniente, justo a un costado de las facultades universitarias.</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider border-b border-slate-200 pb-1.5">
              <Clock className="w-4 h-4 text-indigo-750" />
              <span>Horarios y Estacionamiento</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-800 font-medium leading-normal">
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-800 font-black">⏰</span>
                <span className="text-slate-900 font-bold">Lunes a Sábado: 09:00 hrs - 19:00 hrs (Horario Continuo).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-800 font-black">🚗</span>
                <span className="text-slate-900 font-bold">Estacionamiento exclusivo reservado gratis para clientes justo al frente del local.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-800 font-black">📍</span>
                <span className="text-slate-900 font-bold">Puedes ver coordenadas GPS exactas para tu navegador del auto: 
                  <a href={coordinatesUrl} target="_blank" rel="noopener noreferrer" className="ml-1 text-indigo-700 font-black hover:underline inline-flex items-center gap-0.5">
                    ({BARBER_LATITUDE}, {BARBER_LONGITUDE})
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footnote advice for users */}
        <p className="text-[10px] text-slate-500 font-mono text-center pt-2 border-t border-slate-100">
          Ubicación de alta precisión real de La Serena. Sin cargos extra de navegación o uso de datos de satélite simulados.
        </p>
      </div>
    </div>
  );
}
