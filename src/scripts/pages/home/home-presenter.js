import { getStories } from '../../data/api';

export default class HomePresenter {
  constructor({ view, token }) {
    this.view = view;
    this.token = token;
  }

  async init() {
    if (!this.token) {
      this.view.showError('Silakan login untuk melihat stories.');
      this.view.hideMap();
      return;
    }

    try {
      this.view.showLoading();
      const stories = await getStories(this.token);

      if (stories.length === 0) {
        this.view.showEmpty();
        this.view.hideMap();
        return;
      }

      this.view.showStories(stories);

      const storiesWithLocation = stories.filter(s => s.lat && s.lon);
      if (storiesWithLocation.length === 0) {
        this.view.hideMap();
        return;
      }

      this.view.initMap(storiesWithLocation);

    } catch (error) {
      this.view.showError(error.message);
      this.view.hideMap();
    }
  }
}
