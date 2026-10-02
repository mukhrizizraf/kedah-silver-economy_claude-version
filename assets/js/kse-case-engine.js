/* ============================================================================
   Kedah Silver Economy: portable "Try a case" rules
   Pure case normalization and sample scoring. This file has no DOM work so
   the same state shape and rules can be ported to SwiftUI and Android Compose.
   ============================================================================ */
(function (K) {
'use strict';

var S = K.scenario;
var VERSION = '2026.10.02';
var DISTRICTS = Object.keys(S.districtAdj);
var NEEDS = Object.keys(S.needs);

function has(obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); }
function uniqueKnown(list, known) {
  var out = [];
  (Array.isArray(list) ? list : []).forEach(function (key) {
    if (known.indexOf(key) >= 0 && out.indexOf(key) < 0) out.push(key);
  });
  return out;
}
function firstOr(value, list, fallback) { return list.indexOf(value) >= 0 ? value : (fallback || list[0]); }
function incomeValue(value) {
  if (value === null || value === undefined || value === '' || value === 'unknown' || value === 'prefer-not') return null;
  var n = Number(value);
  return isFinite(n) && n >= 0 ? n : null;
}
function normalize(input) {
  input = input || {};
  var income = incomeValue(input.income);
  var district = has(S.districtAdj, input.district) ? input.district : DISTRICTS[0];
  var needs = uniqueKnown(input.needs, NEEDS);
  if (!needs.length) needs = ['companion'];
  return {
    ageBand: input.ageBand || '60-64',
    gender: input.gender || 'prefer-not',
    persona: firstOr(input.persona, Object.keys(S.profiles), 'independent'),
    district: district,
    mukim: input.mukim || (S.mukimByDistrict[district] || [])[0] || '',
    living: input.living || 'alone',
    needs: needs,
    income: income,
    incomeKnown: income !== null,
    urgency: input.urgency || 'info',
    support: uniqueKnown(input.support, ['alone','spouse','children','family','neighbours','none']),
    financialSupport: uniqueKnown(input.financialSupport, ['pension','welfare','family','zakat','none']),
    note: typeof input.note === 'string' ? input.note.trim().slice(0, 500) : ''
  };
}
function clamp(n) { return Math.max(20, Math.min(96, n)); }
function score(personaKey, needKeys, districtKey, income) {
  var p = S.profiles[personaKey] || S.profiles.independent;
  var needs = uniqueKnown(needKeys, NEEDS);
  if (!needs.length) needs = ['companion'];
  var districtAdj = has(S.districtAdj, districtKey) ? S.districtAdj[districtKey] : 0;
  var needAdd = needs.reduce(function (sum, key) { return sum + S.needs[key].add; }, 0);
  var complexity = Math.max(0, needs.length - 1) * -4;
  var raw = p.coverage + needAdd + complexity + districtAdj;
  var sub = clamp(raw), incomeNumber = incomeValue(income), incomeAdjustment = 0;
  if (incomeNumber !== null && incomeNumber < 1000) incomeAdjustment = 6;
  else if (incomeNumber !== null && incomeNumber > 3000 && needs.indexOf('welfare') >= 0) incomeAdjustment = -8;
  var v = clamp(sub + incomeAdjustment);
  return {
    v: v,
    raw: raw,
    sub: sub,
    base: p.coverage,
    need: needAdd,
    complexity: complexity,
    district: districtAdj,
    income: v - sub,
    incomeKnown: incomeNumber !== null,
    clamped: sub !== raw || v !== sub + incomeAdjustment
  };
}
function findRecord(nodeKey, district) {
  var node = S.nodes[nodeKey];
  if (!node || !node.m) return -1;
  var best = -1;
  for (var i = 0; i < K.records.length; i++) {
    if (K.records[i].name.indexOf(node.m) !== 0) continue;
    if (K.records[i].district === district) return i;
    if (best < 0) best = i;
  }
  return best;
}
function hash(text) {
  var h = 2166136261;
  for (var i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ('00000000' + (h >>> 0).toString(16).toUpperCase()).slice(-8);
}
function caseId(state) {
  var key = JSON.stringify({
    ageBand: state.ageBand, gender: state.gender, persona: state.persona,
    district: state.district, mukim: state.mukim, living: state.living,
    needs: state.needs, income: state.income, urgency: state.urgency,
    support: state.support, financialSupport: state.financialSupport
  });
  return 'KSE-' + VERSION.replace(/\./g, '') + '-' + hash(key);
}
function resolve(input) {
  var state = normalize(input), profile = S.profiles[state.persona];
  var result = score(state.persona, state.needs, state.district, state.income);
  var path = profile.path.slice(), nodes = profile.nodes.slice();
  state.needs.forEach(function (key) {
    var need = S.needs[key];
    if (path.indexOf(need.step) < 0) path.unshift(need.step);
    if (nodes.indexOf(need.node) < 0) nodes.unshift(need.node);
  });
  path = path.slice(0, 5); nodes = nodes.slice(0, 4);
  var negativeNeeds = state.needs.filter(function (key) { return S.needs[key].add < 0; }).length;
  var steps = Math.max(2, profile.steps + Math.max(0, state.needs.length - 1) + negativeNeeds + (result.district < 0 ? 1 : 0));
  var gap = profile.gap;
  if (result.district < 0) gap = 'district';
  else if (state.needs.length > 1) gap = 'multiple';
  else if (negativeNeeds) gap = 'capacity';
  var stateName = result.v > 70 ? 'good' : result.v > 50 ? 'warn' : 'crit';
  var providers = nodes.map(function (key) {
    var idx = findRecord(key, state.district), record = idx >= 0 ? K.records[idx] : null;
    return { key: key, node: S.nodes[key], index: idx, record: record, status: record ? record.status : S.nodes[key].s };
  });
  return {
    version: VERSION,
    caseId: caseId(state),
    input: state,
    profile: profile,
    score: result,
    path: path,
    nodes: nodes,
    providers: providers,
    steps: steps,
    gap: gap,
    state: stateName
  };
}

K.caseEngine = { VERSION: VERSION, normalize: normalize, score: score, resolve: resolve, findRecord: findRecord, caseId: caseId };
})(window.KSE);
