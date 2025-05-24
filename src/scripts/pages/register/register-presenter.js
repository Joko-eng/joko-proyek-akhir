import { register } from '../../data/api';

export default class RegisterPresenter {
  constructor({ view }) {
    this.view = view;
  }

  async handleRegister(name, email, password) {
    try {
      await register({ name, email, password });
      window.location.hash = '/login';
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}
