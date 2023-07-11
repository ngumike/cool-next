import { webApi } from '../config';

class MessageApi {
  getAll = params => webApi({ auth: true }).get(`/messages`, { ...params });
  create = body => webApi({ auth: true }).post(`/messages`, body);
  getById = id => webApi({ auth: true }).get(`/messages/${id}`);
  update = (id, body, level = 1) => webApi({ auth: true }).put(`/messages/${id}?level=${level}`, body);
  delete = id => webApi({ auth: true }).delete(`/messages/${id}`);
}

export const messageApi = new MessageApi();
