
export const getPickResults = (meta, key, event) => {
  const k = `${meta}_${event}_${key}`;
  if (localStorage[k]) {
    try {
      return JSON.parse(localStorage[k]);
    } catch {}
  }
  return {};
}
export const setPickResults = (meta, key, event, val) => {
  const k = `${meta}_${event}_${key}`;
  localStorage[k] = JSON.stringify(val);
}
