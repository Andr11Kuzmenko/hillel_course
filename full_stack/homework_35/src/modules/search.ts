const ITEMS: readonly string[] = [
  'DevServer + HMR',
  'External CSS',
  'SCSS preprocessor',
  'LESS preprocessor',
  'TypeScript',
  'Babel',
  'ESLint',
  'Bundle Analyzer',
];

export function runSearch(query: string): void {
  const list = document.getElementById('results');
  if (!list) return;

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
