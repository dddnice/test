import core from './core';

export const getDashboardStatistics = () => core.get('/api/2/dashboard/statistics').then(({data}) => data?.results);

export const getDashboardAdditional = () =>
  core.get('/api/2/dashboard/additional-data').then(({data}) => data?.results);

export const getProjectsAffected = (uuid: string, type: string) =>
  core.get(`/api/2/leveling/${uuid}/projects-affected?type=${type}`).then(({data}) => data?.results);

export const getDashboardBalance = (limit: number, page: number) =>
  core.get(`/api/2/dashboard/balance?limit=${limit}&page=${page}`).then(({data}) => data?.results);

export const updateConvertedRequest = (id: string, uuid: string, CSRFToken: string) => {
  const data = new FormData();
  data.append('uuid', uuid);
  data.append('id', id);
  data.append('status', 'cancelled');
  data.append('CSRFToken', CSRFToken);
  return core.post(`/api/2/account/${uuid}/payout/update`, data).then(({data}) => data?.results);
};

export const postDashboardTransActive = (value: string, CSRFToken: string) => {
  const fd = new FormData();
  fd.append('flag_value', value);
  fd.append('CSRFToken', CSRFToken);

  return core.post('/api/2/account/trans-inactive', fd).then(({data}) => data?.results);
};

export const getDashboardStatement = (
  limit: number,
  page: number,
  action_type?: string,
  action_date_from?: number,
  action_date_to?: number
) => {
  let query = `/api/2/dashboard/statement?limit=${limit}&page=${page}`;
  action_type && (query += `&action_type=${action_type}`);
  action_date_from && (query += `&action_date_from=${action_date_from}`);
  action_date_to && (query += `${query}&action_date_to=${action_date_to}`);

  return core.get(query).then(({data}) => data?.results);
};

export const getDashboardExportStatement = (type: string, email: string) =>
  core.get(`/api/2/account/statement/export?report_type=${type}&send_to_email=${email}`).then(({data}) => data?.status);

export const getIsRecruitment = () => core.get(`/api/2/recruitment/check`).then(({data}) => data?.results?.available);

export const postRejectedProject = (project_id: number, type: string) => {
  const fd = new FormData();
  fd.append('project_id', String(project_id));
  fd.append('attribute', type);

  return core.post('/api/2/leveling/rejected-project', fd).then(({data}) => data?.results);
};
