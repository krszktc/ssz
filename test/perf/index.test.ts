import { itBench, setBenchOpts } from "@dapplion/benchmark";
import { types } from "../types";

describe("example containern", () => {
  setBenchOpts({ timeoutBench: 5000 });

  const bigContainer = {
    11: 0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaan,
    12: 0xbbbbbbbbbbbbbbbbn,
    13: 0xccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccn,
    21: 0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaan,
    22: 0xbbbbbbbbbbbbbbbbn,
    23: 0xccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccn,
    31: 0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaan,
    32: 0xbbbbbbbbbbbbbbbbn,
    33: 0xccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccn,
    41: 0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaan,
    42: 0xbbbbbbbbbbbbbbbbn,
    43: 0xccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccn,
    51: 0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaan,
    52: 0xbbbbbbbbbbbbbbbbn,
    53: 0xccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccn,
    61: 0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaan,
    62: 0xbbbbbbbbbbbbbbbbn,
    63: 0xccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccn,
    71: 0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaan,
  };

  itBench("BigContainer", () => {
    types.BigContainer.treeRoot(bigContainer);
  });
});
