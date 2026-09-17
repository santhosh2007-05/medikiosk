import React from 'react';
import { Battery, BatteryCharging, BatteryWarning, Zap } from 'lucide-react';

export const BatteryWidget = ({ batteryMonitor, onClick, compact = false }) => {
  if (!batteryMonitor) return null;

  const { level, charging, isLow, isCritical } = batteryMonitor;

  const getBatteryIcon = () => {
    if (charging) {
      return <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />;
    }
    if (isCritical) {
      return <BatteryWarning className="w-3.5 h-3.5 text-rose-400 animate-pulse" />;
    }
    if (isLow) {
      return <BatteryWarning className="w-3.5 h-3.5 text-amber-400" />;
    }
    return <Battery className="w-3.5 h-3.5 text-emerald-400" />;
  };

  const getBadgeStyle = () => {
    if (charging) {
      return "bg-emerald-950/80 text-emerald-300 border-emerald-800 hover:border-emerald-600";
    }
    if (isCritical) {
      return "bg-rose-950 text-rose-300 border-rose-700 shadow-rose-900/30 animate-pulse hover:border-rose-500";
    }
    if (isLow) {
      return "bg-amber-950 text-amber-300 border-amber-700 hover:border-amber-500";
    }
    return "bg-stone-900 text-stone-300 border-stone-800 hover:border-emerald-600";
  };

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`px-2 py-1 rounded-lg border text-[11px] font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${getBadgeStyle()}`}
        title="Kiosk Battery Telemetry"
      >
        {getBatteryIcon()}
        <span>{level}%</span>
        {charging && <Zap className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400" />}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs ${getBadgeStyle()}`}
      title="Click to view Kiosk Power Telemetry & Diagnostics"
    >
      {getBatteryIcon()}
      <span>{level}%</span>
      {charging ? (
        <span className="text-[10px] text-emerald-400 font-sans font-semibold flex items-center gap-0.5">
          <Zap className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400" /> AC
        </span>
      ) : isLow ? (
        <span className="text-[10px] text-rose-400 font-sans font-bold">LOW</span>
      ) : (
        <span className="text-[10px] text-stone-400 font-sans">BAT</span>
      )}
    </button>
  );
};
