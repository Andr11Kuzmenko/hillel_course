// (2) External CSS, (3) SCSS + LESS preprocessors.
import './styles/main.scss';
import './styles/external.css';
import './styles/theme.less';

// Local fonts from @fontsource — bundled and content-hashed by webpack.
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';

// Image asset — under the inline threshold so it lands as a data URL.
import logoUrl from './assets/images/logo.svg';

// Optimised external — per-function ES import so unused lodash code is
// tree-shaken out of the vendor chunk.
import debounce from 'lodash-es/debounce';

import { runSearch } from './modules/search';

const logo = document.getElementById('app-logo') as HTMLImageElement | null;
if (logo) {
  logo.src = logoUrl;
}

const input = document.getElementById('search') as HTMLInputElement | null;
if (input) {
  input.addEventListener(
    'input',
    debounce((event: Event) => {
      const target = event.target as HTMLInputElement;
      runSearch(target.value);
    }, 250)
  );
}

runSearch('');
