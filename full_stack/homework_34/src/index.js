// (4) Pull CSS into the build — webpack pipes it through sass/css loaders.
import './styles/main.scss';

// (2) Local fonts — @fontsource ships the .woff2 files, css-loader follows
//     the url() in their stylesheet, and the font rule hashes them.
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';

// (3) Image asset — small SVG inlined as a data URL by the asset module.
import logoUrl from './assets/images/logo.svg';

// (5) Optimised external — per-function ES import so unused lodash code is
//     tree-shaken instead of pulling the whole package into the bundle.
import debounce from 'lodash-es/debounce';

import { runSearch } from './modules/search.js';

document.getElementById('app-logo').src = logoUrl;

const input = document.getElementById('search');
input.addEventListener(
  'input',
  debounce((event) => runSearch(event.target.value), 250)
);

runSearch('');
