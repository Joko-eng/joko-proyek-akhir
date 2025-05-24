import { getStoryDetail } from '../../data/api.js';
import Database from '../../data/database';

class DetailPresenter {
  constructor(view, dbModel) {
    this.view = view;
    this.dbModel = dbModel || Database;
    this.storyId = null;
    this.currentStory = null;
  }

  async init() {
    this.storyId = window.location.hash.split('/')[2];
    const token = localStorage.getItem('story_token');

    try {
      const detail = await getStoryDetail(this.storyId, token);
      this.currentStory = detail;
      this.view.showDetail(detail);

      // Check if story is already saved
      const savedStory = await this.dbModel.getStoryById(this.storyId);
      this.view.toggleSaveButton(!!savedStory);

      // Bind buttons
      this.view.bindBackButton(() => {
        window.location.hash = '/';
      });

      this.view.bindSaveButton(async () => {
        await this.handleSaveAction();
      });

    } catch (error) {
      this.view.showError(error.message);
    }
  }

  async handleSaveAction() {
    try {
      const savedStory = await this.dbModel.getStoryById(this.storyId);
      
      if (savedStory) {
        await this.dbModel.removeStory(this.storyId);
        this.view.showMessage('Laporan dihapus dari penyimpanan');
      } else {
        await this.dbModel.putStory({
          id: this.storyId,
          ...this.currentStory,
          savedAt: new Date().toISOString()
        });
        this.view.showMessage('Laporan disimpan untuk offline');
      }
      
      this.view.toggleSaveButton(!savedStory);
    } catch (error) {
      this.view.showError(`Gagal ${savedStory ? 'menghapus' : 'menyimpan'}: ${error.message}`);
    }
  }
}



export default DetailPresenter;
