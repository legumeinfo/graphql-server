// This file contains functions to help work with Intermine's PathQuery API,
// including functions for building queries and parsing their results.


// creates a Path Query constraint XML string
function intermineConstraint(path, op, value) {
  return `<constraint path='${path}' op='${op}' value='${value}'/>`;
}


// creates a Path Query XML string
function interminePathQuery(viewAttributes, sortBy, constraints=[]) {
  const view = viewAttributes.join(' ');
  const constraint = constraints.join('');
  return `<query model='genomic' view='${view}' sortOrder='${sortBy} ASC'>${constraint}</query>`;
}


// create a params object to be sent with an Intermine request
function intermineRequestParams(query, options={}) {
  return {
    query,
    ...options,
    format: 'json',
  };
}


// converts an InterMine result array into a GraphQL type
function result2graphqlObject(result, graphqlAttributes) {
  const entries = graphqlAttributes.map((e, i) => [e, result[i]]);
  return Object.fromEntries(entries);
}


// converts an Intermine response into an array of GraphQL types
function response2graphqlObjects(response, graphqlAttributes) {
  return consolidate(response.results.map((result) => result2graphqlObject(result, graphqlAttributes)));
}


// HACK: finds duplicates and merges 
function consolidate(possibly_duplicated_obj_list) {
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
}


module.exports = {
  intermineConstraint,
  interminePathQuery,
  intermineRequestParams,
  result2graphqlObject,
  response2graphqlObjects,
  consolidate,
};
