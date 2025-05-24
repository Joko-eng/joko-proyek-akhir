import BookmarkView from './bookmark-view';
import BookmarkPresenter from './bookmark-presenter';

const BookmarkPage = {
  async render() {
    return BookmarkView.render();
  },

  async afterRender() {
    const presenter = new BookmarkPresenter(BookmarkView);
    await presenter.init();
    
    BookmarkView.bindRemoveButton(async (id) => {
      const success = await presenter.removeStory(id);
      if (success) {
        const storyElement = document.querySelector(`.story-item[data-id="${id}"]`);
        if (storyElement) {
          storyElement.remove();
        }
        // Update counter atau notifikasi
        BookmarkView.showMessage('Laporan dihapus dari penyimpanan');
      }
    });
  }
};

export default BookmarkPage;