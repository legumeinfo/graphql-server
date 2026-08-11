import {DataSources, IntermineAPI} from '../../data-sources/index.js';
import {IntermineSequenceRecord} from '../../data-sources/intermine/api/get-gene-sequence.js';
import {KeyOfType} from '../../utils/index.js';
import {SubfieldResolverMap} from '../resolver.js';

// Shape a record onto the GraphQL `Sequence` type. `id` is synthetic (gene+type)
// — a retrieved sequence has no InterMine object id.
const toSequence = (record: IntermineSequenceRecord) => ({
  id: `${record.gene}:${record.type}`,
  length: record.length,
  md5checksum: record.md5checksum,
  residues: record.residues,
});

// `retrievedSequence(type, up, down)` for any type carrying `identifier`
// (spread into Gene); resolves protein/CDS/genomic residues from InterMine.
export const hasRetrievedSequenceFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): SubfieldResolverMap => ({
  retrievedSequence: async (parent, {type, up, down}, {dataSources}) => {
    const {identifier} = parent;
    const record = await dataSources[sourceName].getGeneSequence(
      identifier,
      type,
      up ?? 0,
      down ?? 0,
    );
    return record ? toSequence(record) : null;
  },
});
