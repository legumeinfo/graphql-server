const resolvers = {

    Query: {

        // --------------------
        // SINGLE OBJECTS BY ID
        // --------------------
        
        gene: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGene(id);
        },

        geneFamilyAssignment: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGeneFamilyAssignment(id);
        },

        geneFamily: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGeneFamily(id);
        },

        gwas: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGWAS(id);
        },

        gwasResult: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGWASResult(id);
        },
        
        ontology: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOntology(id);
        },

        ontologyTerm: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOntologyTerm(id);
        },
        
        organism: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOrganism(id);
        },

        phylonode: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getPhylonode(id);
        },

        phylotree: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getPhylotree(id);
        },

        protein: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getProtein(id);
        }, 

        proteinDomain: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getProteinDomain(id);
        }, 

        qtl:  async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getQTL(id);
        },
        
        strain: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getStrain(id);
        },

        trait: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getTrait(id);
        },

        // ----------------
        // LISTS OF OBJECTS
        // ----------------
        
        // organisms: async (_source, { genus, start, size }, { dataSources }) => {
        //     const args = {
        //         genus,
        //         start,
        //         size,
        //     };
        //     return dataSources.lisIntermineAPI.getOrganisms(args);
        // },

        // strains: async (_source, { organismId }, { dataSources }) => {
        //     return dataSources.lisIntermineAPI.getStrains(organismId);
        // },

        // genes: async (_source, { strain, family, description, start, size }, { dataSources }) => {
        //     const args = {
        //         strain,
        //         family,
        //         description,
        //         start,
        //         size,
        //     };
        //     return dataSources.lisIntermineAPI.getGenes(args);
        // },

        // geneFamilies: async (_source, { start, size }, { dataSources }) => {
        //     const args = {
        //         start,
        //         size,
        //     };
        //     return dataSources.lisIntermineAPI.getGeneFamilies(args);
        // },

        // traits: async (_source, { description, start, size }, { dataSources }) => {
        //     const args = {
        //         description,
        //         start,
        //         size,
        //     };
        //     return dataSources.lisIntermineAPI.getTraits(args);
        // },

        // --------
        // SEARCHES
        // --------

        // geneSearch: async (_source, { keyword, start, size }, { dataSources }) => {
        //     const args = {
        //         start,
        //         size,
        //     };
        //     return dataSources.lisIntermineAPI.geneSearch(keyword, args);
        // },

        // traitSearch: async (_source, { keyword, start, size }, { dataSources }) => {
        //     const args = {
        //         start,
        //         size,
        //     };
        //     return dataSources.lisIntermineAPI.traitSearch(keyword, args);
        // },
        
    },

    /////////////////////////
    // DEPENDENT RESOLVERS //
    /////////////////////////

    Gene: {
        organism: async (gene, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOrganism(gene.organismId);
        },
        strain: async (gene, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getStrain(gene.strainId);
        },
        geneFamilyAssignments: async (gene, { start, size }, { dataSources }) => {
            const args = {
                gene: gene,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getGeneFamilyAssignments(args);
        },
        proteinDomains: async (gene, { start, size }, { dataSources }) => {
            const args = {
                gene: gene,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getProteinDomains(args);
        },
    },

    GeneFamily: {
        phylotree: async(geneFamily, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getPhylotree(geneFamily.phylotreeId);
        },
        genes: async (geneFamily, { start, size }, { dataSources }) => {
            const args = {
                geneFamily: geneFamily,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getGenes(args);
        },
        proteinDomains: async (geneFamily, { start, size }, { dataSources }) => {
            const args = {
                geneFamily: geneFamily,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getProteinDomains(args);
        },
    },

    GeneFamilyAssignment: {
        geneFamily: async(geneFamilyAssignment, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGeneFamily(geneFamilyAssignment.geneFamilyId);
        },
    },

    GWAS: {
        organism: async(gwas, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOrganism(gwas.organismId);
        },
        results: async (gwas, { start, size }, { dataSources }) => {
            const args = {
                gwas: gwas,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getGWASResults(args);
        },
    },

    GWASResult: {
        gwas: async(gwasResult, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGWAS(gwasResult.gwasId);
        },
        trait: async(gwasResult, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getTrait(gwasResult.traitId);
        },
    },
    
    OntologyTerm: {
        ontology: async(ontologyTerm, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOntology(ontologyTerm.ontologyId);
        },
    },

    Organism: {
        strains: async (organism, { start, size }, { dataSources }) => {
            const args = {
                organism: organism,
                start,
                size,
            }
            return dataSources.lisIntermineAPI.getStrains(args);
        },
    },

    Phylonode: {
        tree: async(phylonode, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getPhylotree(phylonode.treeId);
        },
        parent: async(phylonode, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getPhylonode(phylonode.parentId);
        },
        children: async (phylonode, { start, size }, { dataSources }) => {
            const args = {
                parent: phylonode,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getPhylonodes(args);
        },
    },

    Phylotree: {
        geneFamily: async(phylotree, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGeneFamily(phylotree.geneFamilyId);
        },
        nodes: async (phylotree, { start, size }, { dataSources }) => {
            const args = {
                phylotree: phylotree,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getPhylonodes(args);
        },
    },

    Protein: {
        organism: async(protein, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOrganism(protein.organismId);
        },
        strain: async(protein, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getStrain(protein.strainId);
        },
        genes: async (protein, { start, size }, { dataSources }) => {
            const args = {
                protein: protein,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getGenes(args);
        },
        geneFamilyAssignments: async (protein, { start, size }, { dataSources }) => {
            const args = {
                protein: protein,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getGeneFamilyAssignments(args);
        },
    },
    
    ProteinDomain: {
        genes: async (proteinDomain, { start, size }, { dataSources }) => {
            const args = {
                proteinDomain: proteinDomain,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getGenes(args);
        },
        geneFamilies: async (proteinDomain, { start, size }, { dataSources }) => {
            const args = {
                proteinDomain: proteinDomain,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getGeneFamilies(args);
        },
    },
    
    Strain: {
        organism: async (strain, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOrganism(strain.organismId);
        },
    },

    Trait: {
        ontologyTerms: async (trait, { start, size }, { dataSources }) => {
            const args = {
                trait: trait,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getOntologyTerms(args);
        },
        gwasResults: async (trait, { start, size }, { dataSources }) => {
            const args = {
                trait: trait,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getGWASResults(args);
        },

    },
};


module.exports = { resolvers };
