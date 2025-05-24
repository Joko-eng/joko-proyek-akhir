import RegisterPresenter from './register-presenter';

const RegisterPage = {
  async render() {
    return `
      <section class="form-page">
        <form id="registerForm" class="form-card">
          <label for="name">Name</label>
          <input id="name" name="name" type="text" placeholder="Contoh: Mohamad Joko" required />

          <label for="email">Email</label>
          <input id="email" name="email" type="email" placeholder="joko@gmail..com" required />

          <label for="password">Password</label>
          <input id="password" name="password" type="password" placeholder="********" required />

          <button type="submit">Register</button>
        </form>
        <p id="registerError" style="color: red;" aria-live="assertive"></p>
        <p>Sudah punya akun? <a href="#/login">Login</a></p>
      </section>
    `;
  },

  async afterRender() {
    this.presenter = new RegisterPresenter({ view: this });

    const form = document.getElementById('registerForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value;
      const email = form.email.value;
      const password = form.password.value;

      this.presenter.handleRegister(name, email, password);
    });
  },

  showError(message) {
    const errorElem = document.getElementById('registerError');
    errorElem.textContent = message;
  }
};

export default RegisterPage;
