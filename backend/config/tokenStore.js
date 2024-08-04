const tokenStore = {};

export function storeToken(token, userData) {
  tokenStore[token] = userData;
}

export function getTokenData(token) {
  return tokenStore[token] || null;
}