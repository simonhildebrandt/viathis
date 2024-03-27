const storageTokenKey = "lwlToken";
const storageStateKey = "lwlState";

export function handleToken() {
  const url = new URL(window.location);
  const params = url.searchParams;
  const token = params.get("lwl-token");
  const state = params.get("lwl-state");
  if (token) {
    localStorage.setItem(storageTokenKey, token);
    localStorage.setItem(storageStateKey, state);
    params.delete("lwl-token");
    params.delete("lwl-state");
    window.location.href = url;
  }
}

export function getTokenAndState() {
  return {
    token: localStorage.getItem(storageTokenKey),
    state: localStorage.getItem(storageStateKey)
  }
}

export function clearTokenAndState() {
  localStorage.removeItem(storageTokenKey);
  localStorage.removeItem(storageStateKey);
}
