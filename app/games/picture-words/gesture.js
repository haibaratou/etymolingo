/* Geometry is independent of rendering so sparse, fast pointer paths can be tested. */
((root) => {
  'use strict';
  function advanceSelection(path, id, limit) {
    const used = path.indexOf(id);
    if (used === path.length - 1 && used >= 0) return path;
    if (used >= 0) return path.slice(0, used + 1);
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
  const api = { advanceSelection, sweptHits };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WordBloomGesture = api;
})(typeof window === 'undefined' ? globalThis : window);
