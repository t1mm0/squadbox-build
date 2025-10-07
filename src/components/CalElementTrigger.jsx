import { useEffect } from 'react';

// Loads Cal.com element-click embed once and initializes namespace "30min"
const CalElementTrigger = ({ children }) => {
  useEffect(() => {
    const init = () => {
      try {
        // eslint-disable-next-line no-undef
        Cal && Cal("init", "30min", { origin: "https://app.cal.com" });
        // eslint-disable-next-line no-undef
        Cal.ns["30min"]("ui", { hideEventTypeDetails: false, layout: "month_view" });
      } catch (e) {
        // ignore until script loads
      }
    };

    // Only load once
    if (!window.__calEmbedLoaded) {
      const s = document.createElement('script');
      s.src = 'https://app.cal.com/embed/embed.js';
      s.async = true;
      s.onload = () => {
        window.__calEmbedLoaded = true;
        init();
      };
      document.head.appendChild(s);
    } else {
      init();
    }
  }, []);

  return children || null;
};

export default CalElementTrigger;


