export const SESSIONSTORAGE_KEYS = {
  TOKEN: 'token',
};

export function getSession(key) {
  return JSON.parse(sessionStorage.getItem(key));
}

export function setSession(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}
