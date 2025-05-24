import "../styles/styles.css";
import App from "./pages/app";

import { registerServiceWorker } from "./utils";
import {
  subscribe,
  getPushSubscription,
} from "./utils/notification-helper";
import { unsubscribePushNotification } from "./data/api";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  await app.renderPage();
  await registerServiceWorker();
   console.log('Berhasil mendaftarkan service worker.');

  const runPageTransition = async () => {
    const section = document.querySelector("section");
    if (!section) return;

    section.style.opacity = 0;

    await new Promise((resolve) => setTimeout(resolve, 100));
    section.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    section.style.opacity = 1;
    section.style.transform = "translateY(0)";
  };

  window.addEventListener("hashchange", async () => {
    await runPageTransition();
    await app.renderPage();
  });

  const subscribeLink = document.getElementById("subscribeLink");

  async function updateSubscriptionUI() {
    const pushSubscription = await getPushSubscription();

    if (pushSubscription) {
      subscribeLink.textContent = "Unsubscribe";
      subscribeLink.dataset.subscribed = "true";
    } else {
      subscribeLink.textContent = "Subscribe";
      subscribeLink.dataset.subscribed = "false";
    }
  }

  async function handleSubscriptionToggle(event) {
    event.preventDefault();

    const isSubscribed = subscribeLink.dataset.subscribed === "true";

    if (isSubscribed) {
      // Unsubscribe logic
      try {
        const pushSubscription = await getPushSubscription();
        if (pushSubscription) {
          const { endpoint } = pushSubscription.toJSON();
          const response = await unsubscribePushNotification({ endpoint });
          if (response.ok) {
            await pushSubscription.unsubscribe();
            alert("Berhenti berlangganan push notification.");
            await updateSubscriptionUI();
          } else {
            alert("Gagal berhenti berlangganan.");
          }
        }
      } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan saat unsubscribe.");
      }
    } else {
      // Subscribe logic
      await subscribe();
      await updateSubscriptionUI();
    }
  }

  if (subscribeLink) {
    await updateSubscriptionUI();
    subscribeLink.addEventListener("click", handleSubscriptionToggle);
  }
});
