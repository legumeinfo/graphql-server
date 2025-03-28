/**
 * An interface that can be used in place of the object type so that string keys can be used when
 * accessing properties using index syntax.
 */
export interface StringKeyObject {
    [key: string]: string|number|boolean|StringKeyObject
}
