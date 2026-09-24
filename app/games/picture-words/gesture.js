/* Geometry is independent of rendering so sparse, fast pointer paths can be tested. */
((root) => {
  'use strict';
  function advanceSelection(path, id, limit) {
    // Crossing any selected letter leaves the swipe intact, even on the way out.
    if (path.includes(id)) return path;
    return path.length >= limit ? path : [...path, id];
  }
  function sweptHits(nodes, from, to, radius) {
    const dx = to.x - from.x, dy = to.y - from.y, squared = dx * dx + dy * dy;
    if (!squared) return [];
    return nodes.map(node => {
      const t = Math.max(0, Math.min(1, ((node.x - from.x) * dx + (node.y - from.y) * dy) / squared));
      return { node, t, distance: Math.hypot(node.x - from.x - dx * t, node.y - from.y - dy * t) };
    }).filter(hit => hit.distance <= radius(hit.node)).sort((a, b) => a.t - b.t).map(hit => hit.node.id);
  }
  function activeBatch(path, batches) {
    const incomplete = batches.findIndex(ids => !ids.every(id => path.includes(id)));
    return incomplete < 0 ? batches.length - 1 : incomplete;
  }
  function canSelectRing(node, path, batches) {
    // The outer ring is visually muted initially, but never locked.
    return !path.includes(node.id);
  }
  function planLetters(answer, decoys, innerCount, dual) {
    // Keep every required letter visible from the start. Never page a ring.
    const letters = answer.map((char, id) => ({ char, id, answerIndex: id, batch: dual && id >= innerCount ? 1 : 0 }));
    const last = letters.at(-1)?.batch || 0;
    decoys.slice(0, Math.max(0, 6 - letters.filter(node => node.batch === last).length)).forEach(char => letters.push({ char, id: letters.length, answerIndex: -1, batch: last }));
    const batches = Array.from({ length: last + 1 }, (_, batch) => letters.filter(node => node.batch === batch && node.answerIndex >= 0).map(node => node.id));
    return { letters, batches };
  }
  const api = { advanceSelection, sweptHits, activeBatch, canSelectRing, planLetters };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WordBloomGesture = api;
})(typeof window === 'undefined' ? globalThis : window);
