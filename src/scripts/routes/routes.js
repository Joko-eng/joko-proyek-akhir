import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import TambahPage from '../pages/tambah/tambah-page';
import DetailPage from '../pages/detail/detail-page';
import BookmarkPage from '../pages/bookmark/bookmark-page';

const routes = {
  '/': HomePage,
  '/about': new AboutPage(),
  '/login': LoginPage,
  '/register': RegisterPage,
  '/tambah': TambahPage,
  '/detail/:id': DetailPage,
  '/bookmarks': BookmarkPage,
};

export default routes;
