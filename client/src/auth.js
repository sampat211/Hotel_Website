export function setToken(t){ localStorage.setItem('hs_token', t); }
export function getToken(){ return localStorage.getItem('hs_token'); }
export function clearToken(){ localStorage.removeItem('hs_token'); }
export function setUser(u){ localStorage.setItem('hs_user', JSON.stringify(u)); }
export function getUser(){ try { return JSON.parse(localStorage.getItem('hs_user') || 'null'); } catch { return null; } }
export function logout(){ clearToken(); localStorage.removeItem('hs_user'); }
