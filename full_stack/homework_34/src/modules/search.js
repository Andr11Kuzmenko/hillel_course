const ITEMS = [
  'Webpack',
  'Loaders',
  'Plugins',
  'Source maps',
  'Tree shaking',
  'Code splitting',
  'Content hashing',
  'Hot module replacement',
];

export function runSearch(query) {
  const list = document.getElementById('results');
  list.innerHTML = '';

  const normalized = query.trim().toLowerCase();
  const matches = normalized
    ? ITEMS.filter((item) => item.toLowerCase().includes(normalized))
    : ITEMS;

  for (const item of matches) {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  }
}
