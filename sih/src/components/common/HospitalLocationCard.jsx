import React from 'react';
import { getHospitalLocationDetails } from '../../data/tnHospitals';
import { MEDICAL_IMAGES } from '../../data/images';
import { MapPin, Phone, Clock, Navigation, Stethoscope, Building2, ExternalLink } from 'lucide-react';

export const HospitalLocationCard = ({ hospitalName, className = "" }) => {
  const details = getHospitalLocationDetails(hospitalName);

  if (!details) return null;

  // Pick a hospital image based on name length modulo
  const hospitalPhotos = [
    MEDICAL_IMAGES.hospitalBuilding1,
    MEDICAL_IMAGES.hospitalBuilding2,
    MEDICAL_IMAGES.hospitalBuilding3,
    MEDICAL_IMAGES.hospitalBuilding4
  ];
  const photoUrl = hospitalPhotos[(hospitalName.length || 0) % hospitalPhotos.length];

  return (
    <div className={`bg-gradient-to-br from-stone-900 via-stone-950 to-emerald-950 text-white rounded-2xl border border-emerald-500/30 shadow-xl overflow-hidden ${className}`}>
      {/* Hospital Photo Banner */}
      <div className="relative h-36 sm:h-44 w-full overflow-hidden">
        <img
          src={photoUrl}
          alt={details.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md">
            Verified Govt Facility • {details.district}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-stone-800 pb-3">
          <div className="flex items-start gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0 mt-0.5">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                Government Medical Institution
              </span>
              <h3 className="font-extrabold text-sm sm:text-base text-white leading-snug">
                {details.name}
              </h3>
            </div>
          </div>
        </div>

      {/* Address & Landmark Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 space-y-1">
          <div className="flex items-center gap-1.5 text-stone-400 font-semibold text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Physical Address</span>
          </div>
          <p className="text-stone-200 font-medium leading-relaxed">
            {details.address}
          </p>
        </div>

        <div className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 space-y-1">
          <div className="flex items-center gap-1.5 text-stone-400 font-semibold text-[11px]">
            <Navigation className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Nearest Landmark</span>
          </div>
          <p className="text-amber-200/90 font-medium leading-relaxed">
            {details.landmark}
          </p>
        </div>
      </div>

      {/* Timings, Phone & Ayush */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-900/50 border border-stone-800">
          <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="truncate">
            <div className="text-stone-400 text-[9px] uppercase font-bold">Helpline / Phone</div>
            <div className="font-mono text-emerald-300 font-bold truncate">{details.phone}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-900/50 border border-stone-800">
          <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="truncate">
            <div className="text-stone-400 text-[9px] uppercase font-bold">OPD Timings</div>
            <div className="text-stone-200 font-semibold truncate">{details.opdTimings || "07:30 AM - 01:00 PM"}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-900/50 border border-stone-800">
          <Stethoscope className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="truncate">
            <div className="text-stone-400 text-[9px] uppercase font-bold">AYUSH Wings</div>
            <div className="text-emerald-300 font-medium truncate">{details.ayushDepartments || "Siddha & Ayurveda"}</div>
          </div>
        </div>
      </div>

      {/* Google Maps Directions Link Button */}
      <div className="pt-1 flex items-center justify-between gap-3">
        <div className="text-[10px] text-stone-400 font-mono">
          GPS: <span className="text-stone-300">{details.coords}</span>
        </div>

        <a
          href={details.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(details.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 transition shadow-md hover:scale-[1.02]"
        >
          <Navigation className="w-4 h-4" />
          <span>Get Live Directions on Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>
    </div>
  </div>
);
};
