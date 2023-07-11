import { webApi } from '../config';

class UserLineApi {
  getAll = params => webApi({ auth: true }).get(`/user-lines`, params);
  getAllMessages = params => webApi({ auth: true }).get(`/user-lines/messages`);
  create = body => webApi({ auth: true }).post(`/user-lines`, body);
  createBulk = body => webApi({ auth: true }).post(`/user-lines/bulk`, body);

  getById = id => webApi({ auth: true }).get(`/user-lines/${id}`);
  update = (id, body) => webApi({ auth: true }).put(`/user-lines/${id}`, body);
  delete = id => webApi({ auth: true }).delete(`/user-lines/${id}`);
}

export const userLineApi = new UserLineApi();
