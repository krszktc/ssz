# Merkleizer spec

Encoding scheme to merkleize and compute the tree root of pre-defined types.

**Background**

- This spec is a simplified variation of [SSZ](https://github.com/ethereum/consensus-specs/blob/dev/ssz/simple-serialize.md)
- Blockchains require hashing objects for consensus, but just running a large blob of data prevents cheap lightclient protocols.
- Merkleizing objects allows to prove that some data belongs to a known tree root with log(n) complexity.

## Spec

| Name            | Value | Description                 |
| --------------- | ----- | --------------------------- |
| BYTES_PER_CHUNK | 32    | Number of bytes per chunk.  |
| TREE_DEGREE     | 3     | Number of children per node |

### Types

**Basic types**:

- uintN: N-bit unsigned integer (where N in [8, 16, 32, 64, 128, 256]) little-endian.

**Composite types**:

- container: ordered collection of basic types

```
ContainerExample(Container):
  a: uint64
  b: uint128
  c: uint128
  d: uint256
  e: uint64
  f: uint64
```

### Merkleization

**pack(values)**

- Serialize values into bytes. Pack items until exceeding BYTES_PER_CHUNK, then continue to the next chunk.
- If not aligned to a multiple of BYTES_PER_CHUNK bytes, right-pad with zeroes to the next multiple.
- Partition the bytes into BYTES_PER_CHUNK-byte chunks.

_Note_: Container values may be packed unevenly across multiple chunks. For the `ContainerExample` above it would be packed into two chunks as:

```
                                       tree_root
                  ________________________/\___________________
                 /                        |                    \
      __________/\_____            _______/\_____         ______/\_____
     /          |      \          /       |      \       /      |      \
[a][bb][00] [cc][00] [dddd]  [e][f][00] [0000] [0000]  [0000] [0000] [0000]
```

**merkleize(chunks)**

Given ordered BYTES_PER_CHUNK-byte chunks, merkleize the chunks, and return the root:

- The merkleization depends on the effective input, which must be padded/limited:
  - pad the chunks with zeroed chunks to `next_pow_of(len(chunks), TREE_DEGREE)` (virtually for memory efficiency).
- Then, merkleize the chunks (empty input is padded to 1 zero chunk):
  - If 1 chunk: the root is the chunk itself.
  - If > 1 chunks: merkleize as m-ary tree where `m` is the `TREE_DEGREE`.
- Hashing algorithm is SHA256

**next_pow_of(i, TREE_DEGREE)**

get the next power of TREE_DEGREE of i, if not already a power of TREE_DEGREE, with 0 mapping to 1. Examples (with TREE_DEGREE = 3):

- 0->1
- 1->1
- 2->3

## Example

To illustrate the spec defined above compute the treeRoot of a sample value for `ContainerExample`.

```
treeRoot(value) = merkleize(pack(value))
```

For example, for `ContainerExample` and a value of

```
{
  a: 0xaaaaaaaaaaaaaaaa
  b: 0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
  c: 0xcccccccccccccccccccccccccccccccc
  d: 0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
  e: 0xeeeeeeeeeeeeeeee
  f: 0xffffffffffffffff
}
```

It's is packed into 4 chunks with values (with 2 extra padding zero nodes):

```
0xaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb0000000000000000
0xcccccccccccccccccccccccccccccccc00000000000000000000000000000000
0xdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
0xeeeeeeeeeeeeeeeeffffffffffffffff00000000000000000000000000000000
0x0000000000000000000000000000000000000000000000000000000000000000
0x0000000000000000000000000000000000000000000000000000000000000000
```

which hash to an intermediate layer of roots:

```
0x49a1a674384df6413ca11c56bae33b6bc7590c1bcd9e7225f46e615e1e1246d4
0xe45a4dfc1ffcb25e44beb6c497f251c658a3d0f4454a097d59f7ef69e580c730
0x2ea9ab9198d1638007400cd2c3bef1cc745b864b76011a0e1bc52180ac6452d4
```

_pseudo code example_

```
SHA256.digest(concat([
  fromHex("aaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb0000000000000000"),
  fromHex("cccccccccccccccccccccccccccccccc00000000000000000000000000000000"),
  fromHex("dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"),
])).toHex()
// Returns 49a1a674384df6413ca11c56bae33b6bc7590c1bcd9e7225f46e615e1e1246d4
```

which hash to the tree root

```
0x4278118c38f02679efc01a9075510abe00747b01705c9add495053d88604ce95
```
