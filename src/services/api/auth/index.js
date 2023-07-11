import { webApi } from '../config';

class AuthApi {
  login = body => webApi().post('/auth/login/', body);
  logout = () => webApi({ auth: true }).post('/auth/logout/');
  refresh = body => webApi({ auth: true }).post('/auth/refresh-token/', body);
  register = body => webApi().post('/auth/register/', body);
  verify = body => webApi().post('/auth/verify/', body);
  me = () => webApi({ auth: true }).get('/auth/me/');
  activate = (id, body) => webApi().put(`/auth/${id}/activate/`, body);
}

export const authApi = new AuthApi();
