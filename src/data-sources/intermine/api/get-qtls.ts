import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLGeneticMarker,
  GraphQLLinkageGroup,
  GraphQLTrait,
  GraphQLQTL,
  IntermineQTLResponse,
  intermineQTLAttributes,
  intermineQTLSort,
  response2qtls,
} from '../models/index.js';


export type SearchQTLsOptions = {
  linkageGroup?: GraphQLLinkageGroup;
  trait?: GraphQLTrait;
  geneticMarker?: GraphQLGeneticMarker;
};


// get QTLs for a LinkageGroup, Trait, GeneticMarker
export async function getQTLs(
  {linkageGroup, trait, geneticMarker}: SearchQTLsOptions,
): Promise<GraphQLQTL[]> {
    const constraints = [];
    if (linkageGroup) {
        const linkageGroupConstraint = intermineConstraint('QTL.linkageGroup.id', '=', linkageGroup.id);
        constraints.push(linkageGroupConstraint);
    }
    if (trait) {
        const traitConstraint = intermineConstraint('QTL.trait.id', '=', trait.id);
        constraints.push(traitConstraint);
    }
    if (geneticMarker) {
        const geneticMarkerConstraint = intermineConstraint('QTL.markers.id', '=', geneticMarker.id);
        constraints.push(geneticMarkerConstraint);
    }
    const query = interminePathQuery(
        intermineQTLAttributes,
        intermineQTLSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineQTLResponse) => response2qtls(response));
}
