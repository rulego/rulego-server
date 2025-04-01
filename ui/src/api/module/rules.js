import { request, rawRequest } from '@src/utils/request';

export function getRules(params) {
  return request.get('/rules', {
    params,
  });
}

export function setRulesBase(id, data) {
  return request.post(`/rules/${id}/base`, data);
}

export function setRules(id, data) {
  return request.post(`/rules/${id}`, data);
}

export function deleteRules(id) {
  return request.delete(`/rules/${id}`);
}

export function getRulesDetail(id) {
  return request.get(`/rules/${id}`);
}

export function setRulesConfigVars(id, data) {
  return request.post(`/rules/${id}/config/vars`, data);
}

export function executeRules({ id, msgType, data, headers, params }) {
  return rawRequest.post(`/rules/${id}/execute/${msgType}`, data, {
    headers,
    params: {
      debugMode: true,
      ...params,
    },
  });
}

export function notifyRules({ id, msgType, data, headers, params }) {
  return rawRequest.post(`/rules/${id}/notify/${msgType}`, data, {
    headers,
    params: {
      debugMode: true,
      ...params,
    },
  });
}

export function deploymentRules(id, disabled) {
  const operate = disabled ? 'start' : 'stop';
  return request.post(`/rules/${id}/operate/${operate}`);
}
