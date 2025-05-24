import LoginPresenter from './login-presenter';

const LoginPage = {
  async render() {
    return `
      <section class="form-page">
        <form id="loginForm" class="form-card">
          <label for="email">Username</label>
          <input id="email" name="email" type="text" placeholder="Contoh:Joko@gmail.com" required />

          <label for="password">Password</label>
          <input id="password" name="password" type="password" placeholder="********" required />

          <button type="submit">Login</button>
        </form>
        <p id="loginError" style="color: red;" aria-live="assertive"></p>
        <p>Belum punya akun? <a href="#/register">Buat akun</a></p>
      </section>
    `;
  },

  async afterRender() {
    this.presenter = new LoginPresenter({ view: this });

    const form = document.getElementById('loginForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.email.value;
      const password = form.password.value;

      this.presenter.handleLogin(email, password);
    });
  },

  showError(message) {
    const errorElem = document.getElementById('loginError');
    errorElem.textContent = message;
  }
};

export default LoginPage;
