const API_BASE_URL = 'http://localhost:8080/api';

export const apiService = {
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch (err) {
      console.warn('Spring Boot API unavailable, falling back to local client state mode.');
      return { status: 'DEMO_MODE', speechEngine: 'Browser ASR', ocrEngine: 'Tesseract.js Wasm' };
    }
  },

  async saveSession(session) {
    try {
      const res = await fetch(`${API_BASE_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: session.identity.token,
          name: session.identity.name,
          age: session.identity.age,
          gender: session.identity.gender,
          language: session.identity.language,
          ayushMode: session.identity.ayushMode,
          consentGiven: session.identity.consentGiven,
          chiefComplaint: session.conversationalHistory.chiefComplaint,
          site: session.conversationalHistory.hpi.site,
          onset: session.conversationalHistory.hpi.onset,
          character: session.conversationalHistory.hpi.character,
          radiation: session.conversationalHistory.hpi.radiation,
          associated: session.conversationalHistory.hpi.associated,
          severity: session.conversationalHistory.hpi.severity,
          prakriti: session.conversationalHistory.ayushParameters.prakriti,
          agni: session.conversationalHistory.ayushParameters.agni,
          koshtha: session.conversationalHistory.ayushParameters.koshtha,
          sleep: session.conversationalHistory.ayushParameters.sleep,
          summaryText: session.summary.generatedText
        })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.log('Saved session to local state (offline mode)');
    }
    return session;
  },

  async fetchDoctorQueue() {
    try {
      const res = await fetch(`${API_BASE_URL}/doctor/queue`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.log('Using in-memory demo doctor queue');
    }
    return null;
  }
};
