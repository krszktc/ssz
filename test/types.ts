import { ContainerType, UintType } from "../src";

const uint8 = new UintType(8);
const uint16 = new UintType(16);
const uint32 = new UintType(32);

export const types = {
  ExampleContainer: new ContainerType({
    a: uint8,
    b: uint16,
    c: uint16,
    d: uint32,
    e: uint8,
    f: uint8,
  }),
  SmallContainer: new ContainerType({
    a: uint8,
    b: uint16,
    c: uint8,
  }),
  BigContainer: new ContainerType({
    "11": uint32,
    "12": uint8,
    "13": uint32,
    "21": uint32,
    "22": uint8,
    "23": uint32,
    "31": uint32,
    "32": uint8,
    "33": uint32,
    "41": uint32,
    "42": uint8,
    "43": uint32,
    "51": uint32,
    "52": uint8,
    "53": uint32,
    "61": uint32,
    "62": uint8,
    "63": uint32,
    "71": uint32,
  }),
  EmptyContainer: new ContainerType({}),
};
