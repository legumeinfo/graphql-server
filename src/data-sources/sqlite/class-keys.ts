// class-keys.ts — parses service/classkeys and exposes, per class, the ATTRIBUTE
// key fields used by InterMine LOOKUP (e.g. Gene -> [primaryIdentifier, name]).
// Reference-typed keys (e.g. Strain.organism) are dropped: LOOKUP on those needs
// object resolution, which isn't in the current query surface.
import {Model} from './model.js';

export type ClassKeyMap = Record<string, string[]>;

export function buildClassKeys(model: Model, raw: any): ClassKeyMap {
  const classes = raw?.classes ?? raw ?? {};
  const out: ClassKeyMap = {};
  for (const [cls, keys] of Object.entries<string[]>(classes)) {
    const fields: string[] = [];
    for (const k of keys) {
      const field = k.includes('.') ? k.split('.').slice(1).join('.') : k;
      // keep only single-segment attribute keys
      if (!field.includes('.') && model.field(cls, field)?.kind === 'attr') {
        fields.push(field);
      }
    }
    if (fields.length) out[cls] = fields;
  }
  return out;
}
