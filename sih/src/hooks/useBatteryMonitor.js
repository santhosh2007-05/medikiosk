import { useState, useEffect, useCallback, useRef } from 'react';

export const useBatteryMonitor = (options = { lowThreshold: 20, criticalThreshold: 10 }) => {
  const { lowThreshold = 20, criticalThreshold = 10 } = options;

  const [batteryState, setBatteryState] = useState({
    level: 100, // percentage 0 - 100
    charging: true,
    chargingTime: 0,
    dischargingTime: Infinity,
    isSupported: false,
    isSimulated: false,
    lastUpdated: new Date()
  });

  const [alertDismissed, setAlertDismissed] = useState(false);
  const [maintenanceAlertSent, setMaintenanceAlertSent] = useState(false);
  const audioAlertTriggeredRef = useRef(false);

  // 1. Initialize Real Web Battery API Listener
  useEffect(() => {

    const updateBatteryInfo = (battery) => {
      const pct = Math.round(battery.level * 100);
      setBatteryState(prev => {
        if (prev.isSimulated) return prev; // Do not overwrite if user is testing simulator
        return {
          level: pct,
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime,
          isSupported: true,
          isSimulated: false,
          lastUpdated: new Date()
        };
      });
    };

    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      navigator.getBattery()
        .then(battery => {
          updateBatteryInfo(battery);

          const onLevelChange = () => updateBatteryInfo(battery);
          const onChargingChange = () => {
            updateBatteryInfo(battery);
            if (battery.charging) {
              setAlertDismissed(false); // Reset dismissed state if plugged in
              audioAlertTriggeredRef.current = false;
            }
          };

          battery.addEventListener('levelchange', onLevelChange);
          battery.addEventListener('chargingchange', onChargingChange);

          return () => {
            battery.removeEventListener('levelchange', onLevelChange);
            battery.removeEventListener('chargingchange', onChargingChange);
          };
        })
        .catch(err => {
          console.warn("Battery API error / permission blocked:", err);
          // Fallback default state
          setBatteryState(prev => ({ ...prev, isSupported: false }));
        });
    } else {
      // Browser or device without navigator.getBattery
      setBatteryState(prev => ({ ...prev, isSupported: false, level: 85, charging: true }));
    }
  }, []);

  const isLow = batteryState.level <= lowThreshold && !batteryState.charging;
  const isCritical = batteryState.level <= criticalThreshold && !batteryState.charging;

  // 2. Play Audio Warning on Low Battery
  const playLowBatteryVoiceAlert = useCallback((pct) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Attention Kiosk Maintenance. Kiosk battery level is low at ${pct} percent. Please connect the power charging source immediately.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // 3. Automated Trigger when battery drops below threshold
  useEffect(() => {
    if (isLow && !audioAlertTriggeredRef.current && !batteryState.charging) {
      audioAlertTriggeredRef.current = true;
      playLowBatteryVoiceAlert(batteryState.level);
    }
    if (batteryState.charging) {
      audioAlertTriggeredRef.current = false;
    }
  }, [isLow, batteryState.level, batteryState.charging, playLowBatteryVoiceAlert]);

  // 4. Send Automated Dispatch Notification to Facility Admin / Backend
  const sendMaintenanceAlert = useCallback(async (customMessage = "") => {
    const alertPayload = {
      kioskId: "KIOSK-TN-CHE-042",
      facility: "Rajiv Gandhi Government General Hospital, Chennai",
      batteryLevel: batteryState.level,
      isCharging: batteryState.charging,
      timestamp: new Date().toISOString(),
      priority: isCritical ? "CRITICAL_P1" : "HIGH_P2",
      message: customMessage || `[KIOSK BATTERY ALERT]: Kiosk #042 battery at ${batteryState.level}% (${batteryState.charging ? 'Charging' : 'Discharging'}). Connect power source.`
    };

    console.log("⚡ [BATTERY DISPATCH ALERT SENT]:", alertPayload);

    try {
      await fetch("http://localhost:8080/api/admin/battery-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alertPayload)
      });
    } catch (err) {
      console.log("Backend offline, battery alert saved locally in session log:", err);
    }

    setMaintenanceAlertSent(true);
    return alertPayload;
  }, [batteryState.level, batteryState.charging, isCritical]);

  // 5. Battery Simulation Controls (For Testing & Demonstration)
  const simulateBattery = useCallback((level, charging = false) => {
    setBatteryState({
      level: Math.max(1, Math.min(100, level)),
      charging: charging,
      chargingTime: charging ? 1800 : 0,
      dischargingTime: charging ? Infinity : 3600,
      isSupported: true,
      isSimulated: true,
      lastUpdated: new Date()
    });
    setAlertDismissed(false);
    audioAlertTriggeredRef.current = false;
  }, []);

  const resetSimulation = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        setBatteryState({
          level: Math.round(battery.level * 100),
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime,
          isSupported: true,
          isSimulated: false,
          lastUpdated: new Date()
        });
      });
    } else {
      setBatteryState({
        level: 88,
        charging: true,
        chargingTime: 0,
        dischargingTime: Infinity,
        isSupported: false,
        isSimulated: false,
        lastUpdated: new Date()
      });
    }
    setAlertDismissed(false);
    setMaintenanceAlertSent(false);
  }, []);

  return {
    ...batteryState,
    isLow,
    isCritical,
    alertDismissed,
    setAlertDismissed,
    maintenanceAlertSent,
    sendMaintenanceAlert,
    simulateBattery,
    resetSimulation,
    playLowBatteryVoiceAlert
  };
};
