import Database from '../../data/database';

class BookmarkPresenter {
  constructor(view) {
    this.view = view;
    this.db = Database;
  }

  async init() {
    try {
      const stories = await this.db.getAllStories();
      this.view.showStories(stories);
      
      // Jika tidak ada data, tampilkan pesan
      if (!stories || stories.length === 0) {
        this.view.showEmptyMessage();
      }
    } catch (error) {
      this.view.showError(error.message);
    }
  }

  async removeStory(id) {
    try {
      await this.db.removeStory(id);
      return true;
    } catch (error) {
      console.error('Failed to remove story:', error);
      this.view.showError('Gagal menghapus laporan');
      return false;
    }
  }
}

export default BookmarkPresenter;