import { Response, response2graphqlObjects } from '../intermine.server.js';


// <class name="Publication" is-interface="true" term="http://purl.org/ontology/bibo/Article">
// 	<attribute name="year" type="java.lang.Integer" term="http://purl.org/dc/terms/date"/>
// 	<attribute name="issue" type="java.lang.String" term="http://purl.org/ontology/bibo/issuer"/>
// 	<attribute name="title" type="java.lang.String" term="http://purl.org/dc/terms/title"/>
// 	<attribute name="pages" type="java.lang.String" term="http://purl.org/ontology/bibo/numPages"/>
// 	<attribute name="doi" type="java.lang.String" term="http://purl.org/ontology/bibo/doi"/>
// 	<attribute name="volume" type="java.lang.String" term="http://purl.org/ontology/bibo/volume"/>
// 	<attribute name="journal" type="java.lang.String" term="http://purl.org/dc/terms/publisher"/>
// 	<attribute name="firstAuthor" type="java.lang.String" term="http://purl.org/dc/elements/1.1/creator"/>
// 	<attribute name="month" type="java.lang.String"/>
// 	<attribute name="abstractText" type="java.lang.String" term="http://purl.org/ontology/bibo/abstract"/>
// 	<attribute name="pubMedId" type="java.lang.String" term="http://purl.obolibrary.org/obo/ERO_0000569"/>
// 	<collection name="authors" referenced-type="Author" reverse-reference="publications" term="http://purl.org/ontology/bibo/authorList"/>
// 	<collection name="entities" referenced-type="Annotatable" reverse-reference="publications"/>
// 	<collection name="meshTerms" referenced-type="MeshTerm" reverse-reference="publications"/>
// </class>
export const interminePublicationAttributes = [
    'Publication.id',
    'Publication.year',
    'Publication.issue',
    'Publication.title',
    'Publication.pages',
    'Publication.doi',
    'Publication.volume',
    'Publication.journal',
    'Publication.firstAuthor',
    'Publication.month',
    'Publication.abstractText',
    'Publication.pubMedId',
];
export const interminePublicationSort = 'Publication.doi'; // guaranteed not null
export type InterminePublication = [
  number,
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];


// type Publication {
//   id: ID!
//   year: Int
//   issue: String
//   title: String
//   pages: String
//   doi: String
//   volume: String
//   journal: String
//   firstAuthor: String
//   month: String
//   abstractText: String
//   pubMedId: String
//   authors: [Author]
//   # entities: []
//   # meshTerms: []
// }
export const graphqlPublicationAttributes = [
    'id',
    'year',
    'issue',
    'title',
    'pages',
    'doi',
    'volume',
    'journal',
    'firstAuthor',
    'month',
    'abstractText',
    'pubMedId',
];
export type GraphQLPublication = {
  [prop in typeof graphqlPublicationAttributes[number]]: string;
}


export type InterminePublicationResponse = Response<InterminePublication>;
// converts an Intermine response into an array of GraphQL Publication objects
export function response2publications(response: Response<InterminePublication>): Array<GraphQLPublication> {
    return response2graphqlObjects(response, graphqlPublicationAttributes);
}
