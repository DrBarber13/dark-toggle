(() => {
  const STYLE_ID = "dark-toggle-style";
  const key = `dark:${location.hostname}`;

  // Invert the whole page, then invert media back so photos and videos
  // keep their real colors. hue-rotate keeps hues roughly the same.
  const CSS = `
    html {
      filter: invert(1) hue-rotate(180deg) !important;
      background-color: #fff;
    }
    img, picture, video, canvas, iframe, embed, object,
    svg image, [style*="background-image"] {
      filter: invert(1) hue-rotate(180deg) !important;
    }
    /* Don't double-invert media nested inside already re-inverted media. */
    picture img, [style*="background-image"] img,
    [style*="background-image"] [style*="background-image"] {
      filter: none !important;
    }
  `;

  function apply(on) {
    const existing = document.getElementById(STYLE_ID);
    if (on && !existing) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = CSS;
      (document.head || document.documentElement).appendChild(style);
    } else if (!on && existing) {
      existing.remove();
    }
  }

  browser.storage.local.get(key).then((items) => apply(Boolean(items[key])));

  browser.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && key in changes) {
      apply(Boolean(changes[key].newValue));
    }
  });
})();
