// model.ts — loads/indexes the InterMine data model (service/model?format=json).
// Single source of truth for path -> SQL translation.
export type IMAttribute = {name: string; type: string};
export type IMReference = {name: string; referencedType: string};
export type IMCollection = {
  name: string;
  referencedType: string;
  reverseReference?: string;
};
export type IMClass = {
  name: string;
  extends?: string[];
  attributes?: Record<string, IMAttribute>;
  references?: Record<string, IMReference>;
  collections?: Record<string, IMCollection>;
  count?: number;
};
export type ResolvedField =
  | {kind: 'attr'; def: IMAttribute}
  | {kind: 'ref'; def: IMReference}
  | {kind: 'col'; def: IMCollection};
export type CollectionKind =
  | {kind: 'o2m'; referencedType: string; reverseReference: string}
  | {kind: 'm2m'; referencedType: string; reverseReference?: string};

export class Model {
  readonly classes: Record<string, IMClass>;
  constructor(classes: Record<string, IMClass>) {
    this.classes = classes;
  }
  static fromJSON(json: any): Model {
    return new Model(json?.model?.classes ?? json?.classes ?? json);
  }
  has(cls: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.classes, cls);
  }
  // model already flattens inherited fields, so no need to climb `extends`.
  field(cls: string, name: string): ResolvedField | null {
    const c = this.classes[cls];
    if (!c) return null;
    if (c.attributes?.[name]) return {kind: 'attr', def: c.attributes[name]};
    if (c.references?.[name]) return {kind: 'ref', def: c.references[name]};
    if (c.collections?.[name]) return {kind: 'col', def: c.collections[name]};
    return null;
  }
  collectionKind(col: IMCollection): CollectionKind {
    const rr = col.reverseReference;
    if (rr) {
      const far = this.classes[col.referencedType];
      if (far?.references?.[rr])
        return {
          kind: 'o2m',
          referencedType: col.referencedType,
          reverseReference: rr,
        };
    }
    return {
      kind: 'm2m',
      referencedType: col.referencedType,
      reverseReference: rr,
    };
  }
}
