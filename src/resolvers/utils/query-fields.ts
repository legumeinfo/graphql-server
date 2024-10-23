import { GraphQLResolveInfoWithCacheControl } from '@apollo/cache-control-types';
import { FieldNode } from 'graphql';

function getSelections(node: FieldNode) {
    if (node &&
        node.selectionSet &&
        node.selectionSet.selections &&
        node.selectionSet.selections.length) {
        return node.selectionSet.selections;
    }
    return [];
}

// gets the list of subfields specified in the query from the client
export function getQueryFields(info: GraphQLResolveInfoWithCacheControl) {
    const {fieldName} = info;
    const [modelNode] = info.fieldNodes.filter(({kind, name}) => kind === "Field" && name.value === fieldName);
    const selections = getSelections(modelNode).filter(({kind}) => kind === "Field") as FieldNode[];
    const nameNodes = selections.map(({name}) => name);
    const fieldNames = nameNodes.map(({value}) => value);
    return fieldNames;
};
