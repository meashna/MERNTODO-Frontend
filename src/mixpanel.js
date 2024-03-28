import mixpanel from "mixpanel-browser";

const mixPanelToken = import.meta.env.VITE_MIX_PANEL_TOKEN;

mixpanel.init(mixPanelToken, {
  debug: true,
  track_pageview: true,
  persistence: "localStorage",
  ignore_dnt: true,
});

export default mixpanel;
