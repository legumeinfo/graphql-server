// This file contains functions to help work with Intermine's PathQuery API,
// including functions for building queries and parsing their results.


// creates a Path Query constraint XML string
export const intermineConstraint = (path, op, value): string => {
  return `<constraint path='${path}' op='${op}' value='${value}'/>`;
};


// creates a Path Query XML string
export const interminePathQuery = (viewAttributes, sortBy, constraints=[]): string => {
  const view = viewAttributes.join(' ');
  const constraint = constraints.join('');
  return `<query model='genomic' view='${view}' sortOrder='${sortBy}'>${constraint}</query>`;
};


// converts an InterMine result array into a GraphQL type
export const result2graphqlObject = (result, graphqlAttributes): Object => {
  const entries = graphqlAttributes.map((e, i) => [e, result[i]]);
  return Object.fromEntries(entries);
};


// converts an Intermine response into an array of GraphQL types
export const response2graphqlObjects = (response, graphqlAttributes): Array<any> => {
  return consolidate(response.results.map((result) => result2graphqlObject(result, graphqlAttributes)));
};


// HACK: finds duplicates and merges 
export const consolidate = (possibly_duplicated_obj_list): Array<any> => {
  const lookup = new Map();
  for (const obj of possibly_duplicated_obj_list) {
   const urobj = lookup.get(obj.id);
   if (urobj) {
     //HACK:
     if (obj.hasOwnProperty('proteinDomains')) {
       urobj.proteinDomains.push({name: obj.proteinDomains});
     }
   }
   else {
     if (obj.hasOwnProperty('proteinDomains')) {
       obj.proteinDomains = [{name : obj.proteinDomains}];
     }
     lookup.set(obj.id, obj);
   }
  }
  return Array.from(lookup.values());
};
