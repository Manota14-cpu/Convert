self.onmessage = function(e) {
  const { imageData, width, height, tolerance, bgR, bgG, bgB } = e.data;
  const data = new Uint8ClampedArray(imageData);
  const w = width, h = height;

  const visited = new Uint8Array(w * h);
  const queue = [];
  const enqueue = (x, y) => { const idx = y * w + x; if (!visited[idx]) { visited[idx] = 1; queue.push(idx); } };

  for (let x = 0; x < w; x++) { enqueue(x, 0); enqueue(x, h - 1); }
  for (let y = 1; y < h - 1; y++) { enqueue(0, y); enqueue(w - 1, y); }

  const colorMatch = idx => {
    const p = idx * 4;
    return Math.abs(data[p] - bgR) + Math.abs(data[p + 1] - bgG) + Math.abs(data[p + 2] - bgB) < tolerance * 3;
  };

  const initial = queue.filter(idx => colorMatch(idx));
  queue.length = 0;
  initial.forEach(idx => { visited[idx] = 1; queue.push(idx); });

  let head = 0;
  while (head < queue.length) {
    const idx = queue[head++];
    const x = idx % w, y = Math.floor(idx / w);
    for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
      const nIdx = ny * w + nx;
      if (!visited[nIdx] && colorMatch(nIdx)) { visited[nIdx] = 1; queue.push(nIdx); }
    }
  }

  const featherPx = 3;
  for (let i = 0; i < w * h; i++) {
    if (!visited[i]) continue;
    const x = i % w, y = Math.floor(i / w);
    let minDist = featherPx + 1;
    for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1], [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1], [x + 1, y + 1]]) {
      if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
      if (!visited[ny * w + nx]) { minDist = 1; break; }
    }
    if (minDist <= featherPx) {
      const alpha = Math.max(0, Math.round((1 - minDist / featherPx) * 255));
      data[i * 4 + 3] = alpha;
    }
  }

  self.postMessage({ outputData: data.buffer }, [data.buffer]);
};
