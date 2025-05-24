import L from "leaflet";
import "leaflet/dist/leaflet.css";
import DetailView from "./detail-view.js";
import DetailPresenter from "./detail-presenter.js";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DetailPage = {
  async render() {
    return DetailView.renderContainer();
  },

  async afterRender() {
    const view = DetailView;
    const presenter = new DetailPresenter(view);

    await presenter.init(); // presenter yang meng-handle event tombol
  },
};

export default DetailPage;
