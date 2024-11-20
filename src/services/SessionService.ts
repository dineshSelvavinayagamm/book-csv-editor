class SessionService {
  sessionCallback?: () => void;
  observe(callback: () => void) {
    this.sessionCallback = callback;
  }
  unAuthenticated() {
    this.sessionCallback?.();
  }
}

const instance = new SessionService();

export default instance;
