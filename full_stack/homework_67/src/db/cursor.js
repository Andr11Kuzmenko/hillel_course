/**
 * Утиліти для роботи з курсорами MongoDB.
 */

/**
 * Пагінація через курсор: find().sort().skip().limit() і ручна ітерація
 * cursor.hasNext() / cursor.next() — документи читаються по одному з батчів курсора.
 */
export const paginateWithCursor = async (collection, { filter = {}, sort = { _id: 1 }, projection, page = 1, pageSize = 10 }) => {
  const total = await collection.countDocuments(filter);
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const cursor = collection
    .find(filter, { projection })
    .sort(sort)
    .skip((safePage - 1) * pageSize)
    .limit(pageSize)
    .batchSize(pageSize);

  const items = [];
  try {
    while (await cursor.hasNext()) {
      items.push(await cursor.next());
    }
  } finally {
    await cursor.close();
  }

  return {
    items,
    page: safePage,
    pageSize,
    total,
    totalPages,
    hasPrevPage: safePage > 1,
    hasNextPage: safePage < totalPages,
  };
};

/**
 * Стрімить документи курсора у HTTP-відповідь (NDJSON або JSON-масив),
 * не завантажуючи всю вибірку в пам'ять: for await (const doc of cursor).
 * Враховує backpressure (подія 'drain') і закриває курсор, якщо клієнт відключився.
 */
export const streamCursorToResponse = async (cursor, res, { format = 'ndjson' } = {}) => {
  let clientGone = false;
  const onClose = () => {
    if (!res.writableFinished) clientGone = true;
  };
  res.on('close', onClose);

  const waitForDrain = () =>
    new Promise((resolve) => {
      const done = () => {
        res.off('drain', done);
        res.off('close', done);
        resolve();
      };
      res.once('drain', done);
      res.once('close', done);
    });

  const isJson = format === 'json';
  let count = 0;

  try {
    if (isJson) res.write('[\n');

    for await (const doc of cursor) {
      if (clientGone) break;
      const chunk = isJson ? `${count ? ',\n' : ''}${JSON.stringify(doc)}` : `${JSON.stringify(doc)}\n`;
      count += 1;
      if (!res.write(chunk)) await waitForDrain();
    }

    if (!clientGone) res.end(isJson ? '\n]\n' : '');
  } finally {
    res.off('close', onClose);
    await cursor.close();
  }

  return { count, aborted: clientGone };
};
