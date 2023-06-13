import { createHash } from "node:crypto";
import { TREE_DEGREE } from "./reducers";

let miniCache: { [key: string]: string } = { 'none': '' };

const hash = (chunks: string[]): string => {
  const buffers = chunks.map(chunk => Buffer.from(chunk, 'hex'));
  return createHash('sha256')
    .update(Buffer.concat(buffers))
    .digest('hex');
}

const hashChunks = (chunks: string[]): string[] => {
  const hashedChunks = [];
  let start = 0;
  let stop = TREE_DEGREE;
  while (stop <= chunks.length) {
    const chunk = chunks.slice(start, stop);
    const cacheKey = chunk.toString();
    if (cacheKey in miniCache) {
      hashedChunks.push(miniCache[cacheKey])
    } else {
      const chunkHash = hash(chunk);
      hashedChunks.push(chunkHash);
      miniCache = { [cacheKey]: chunkHash }
    }
    start += TREE_DEGREE;
    stop += TREE_DEGREE;
  }
  return hashedChunks;
}

export const encodeChunks = (chunks: string[]): string => {
  let levels = [...chunks];
  while (levels.length !== 1) {
    levels = hashChunks(levels)
  }
  return levels[0];
}