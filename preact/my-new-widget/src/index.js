// const poly = require('preact-cli/lib/lib/webpack/polyfills');

// import { h } from 'preact';
import habitat from 'preact-habitat';

import Widget from './components/hello-world';

const widgetHabitat = habitat(Widget);

widgetHabitat.render({
    selector: '[data-widget-host="habitat"]',
    clean: true,
});
