import { login } from '../../data/api';

export default class LoginPresenter {
  constructor({ view }) {
    this.view = view;
  }

  async handleLogin(email, password) {
    try {
      const data = await login({ email, password });
      localStorage.setItem('story_token', data.loginResult.token);
      window.location.hash = '/';
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}
