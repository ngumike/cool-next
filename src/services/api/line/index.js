import { webApi } from '../config';

class LineApi {
  getAll = params => webApi({ auth: true }).get(`/lines`, params);
  create = body => webApi({ auth: true }).post(`/lines`, body);
  import = body => webApi({ auth: true }).post(`/lines/import`, body, { formData: true });
  getById = id => webApi({ auth: true }).get(`/lines/${id}`);
  update = (id, body) => webApi({ auth: true }).put(`/lines/${id}`, body);
  delete = id => webApi({ auth: true }).delete(`/lines/${id}`);
}

export const lineApi = new LineApi();
