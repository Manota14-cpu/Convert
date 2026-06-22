self.onmessage = function(e) {
  const { frames, width, height, delay, palette } = e.data;
  try {
    const gifData = encodeGif(frames, width, height, delay, palette);
    self.postMessage({ gifData: gifData.buffer }, [gifData.buffer]);
  } catch (err) {
    self.postMessage({ error: err.message });
  }
};

function encodeGif(frames, w, h, delay, palette) {
  const buf = [];
  const push = (...bytes) => bytes.forEach(b => buf.push(b));
  const pushStr = s => { for (let i=0;i<s.length;i++) buf.push(s.charCodeAt(i)); };
  const pushU16 = n => { buf.push(n & 0xff, (n >> 8) & 0xff); };

  pushStr('GIF89a');
  pushU16(w); pushU16(h);
  push(0xf7, 0, 0);
  palette.forEach(c => push(c[0], c[1], c[2]));
  pushStr('\x21\xff\x0bNETSCAPE2.0\x03\x01\x00\x00\x00');

  for (const frame of frames) {
    push(0x21, 0xf9, 0x04, 0x00);
    pushU16(delay);
    push(0x00, 0x00);
    push(0x2c);
    pushU16(0); pushU16(0); pushU16(w); pushU16(h);
    push(0x00);
    const indices = quantizeFrame(frame, palette);
    const lzw = lzwEncode(indices, 8);
    push(0x08);
    for (let i=0; i<lzw.length; i+=255) {
      const chunk = lzw.slice(i, i+255);
      push(chunk.length, ...chunk);
    }
    push(0x00);
  }
  push(0x3b);
  return new Uint8Array(buf);
}

function quantizeFrame(frame, palette) {
  const out = new Uint8Array(frame.width * frame.height);
  for (let i=0;i<frame.data.length;i+=4) {
    const r=frame.data[i], g=frame.data[i+1], b=frame.data[i+2];
    let best=0, bestD=Infinity;
    for (let j=0;j<palette.length;j++) {
      const dr=r-palette[j][0], dg=g-palette[j][1], db=b-palette[j][2];
      const d=dr*dr+dg*dg+db*db;
      if (d<bestD) { bestD=d; best=j; }
    }
    out[i>>2]=best;
  }
  return out;
}

function lzwEncode(indices, minCodeSize) {
  const out = [];
  const clearCode = 1 << minCodeSize;
  const eofCode = clearCode + 1;
  let codeSize = minCodeSize + 1, nextCode = eofCode + 1;
  const table = new Map();
  const initTable = () => {
    table.clear();
    for (let i=0;i<clearCode;i++) table.set(String(i), i);
    codeSize = minCodeSize + 1; nextCode = eofCode + 1;
  };
  let bits = 0, bitsLen = 0;
  const writeBits = code => {
    bits |= code << bitsLen; bitsLen += codeSize;
    while (bitsLen >= 8) { out.push(bits & 0xff); bits >>= 8; bitsLen -= 8; }
  };
  initTable();
  writeBits(clearCode);
  let buf = String(indices[0]);
  for (let i=1;i<indices.length;i++) {
    const next = buf + ',' + indices[i];
    if (table.has(next)) { buf = next; }
    else {
      writeBits(table.get(buf));
      if (nextCode < 4096) { table.set(next, nextCode++); if (nextCode > (1<<codeSize) && codeSize<12) codeSize++; }
      else { writeBits(clearCode); initTable(); }
      buf = String(indices[i]);
    }
  }
  writeBits(table.get(buf));
  writeBits(eofCode);
  if (bitsLen > 0) out.push(bits & 0xff);
  return out;
}
