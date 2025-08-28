/**
 * Advanced Validation and Constraint Checking Framework
 *
 * Comprehensive validation system for biological entity relationships
 * with rule-based constraints, data integrity checks, business logic
 * validation, and automated error reporting and remediation suggestions.
 */

import {MockEntityRegistry, EntityNode} from './entity-registry.js';
import {DirectRelationshipResolver} from './direct-relationship-resolver.js';
import {BidirectionalConsistencyChecker} from './bidirectional-consistency-checker.js';

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  category:
    | 'data_integrity'
    | 'business_logic'
    | 'performance'
    | 'security'
    | 'compliance';
  severity: 'error' | 'warning' | 'info';
  scope: 'entity' | 'relationship' | 'collection' | 'graph';
  validator: (context: ValidationContext) => ValidationRuleResult;
  autoFix?: (context: ValidationContext) => AutoFixResult;
  dependencies?: string[]; // Other rule IDs that must pass first
}

export interface ValidationContext {
  entity: EntityNode;
  relatedEntities?: EntityNode[];
  relationshipName?: string;
  registry: MockEntityRegistry;
  resolver: DirectRelationshipResolver;
  metadata: Record<string, any>;
  userContext?: {
    permissions: string[];
    role: string;
    preferences: Record<string, any>;
  };
}

export interface ValidationRuleResult {
  passed: boolean;
  violations: ValidationViolation[];
  metrics: {
    executionTime: number;
    entitiesChecked: number;
    rulesEvaluated: number;
  };
  suggestions: string[];
}

export interface ValidationViolation {
  ruleId: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  details: string;
  entityId: string;
  relationshipName?: string;
  expectedValue?: any;
  actualValue?: any;
  fixSuggestion?: string;
  autoFixable: boolean;
}

export interface AutoFixResult {
  applied: boolean;
  actions: AutoFixAction[];
  warnings: string[];
  rollbackInstructions?: string[];
}

export interface AutoFixAction {
  type:
    | 'add_relationship'
    | 'remove_relationship'
    | 'update_field'
    | 'create_entity'
    | 'delete_entity';
  entityId: string;
  fieldName?: string;
  oldValue?: any;
  newValue?: any;
  description: string;
}

export interface ValidationReport {
  summary: {
    totalRules: number;
    passedRules: number;
    failedRules: number;
    totalViolations: number;
    errorViolations: number;
    warningViolations: number;
    autoFixableViolations: number;
  };
  violationsByCategory: Record<string, ValidationViolation[]>;
  violationsBySeverity: Record<string, ValidationViolation[]>;
  entityViolations: Record<string, ValidationViolation[]>;
  recommendations: string[];
  executionMetrics: {
    totalExecutionTime: number;
    averageRuleTime: number;
    entitiesValidated: number;
    relationshipsValidated: number;
  };
}

/**
 * Advanced validation and constraint checking framework
 */
export class ValidationConstraintFramework {
  private validationRules = new Map<string, ValidationRule>();
  private ruleDependencies = new Map<string, string[]>();
  private executionHistory: ValidationReport[] = [];

  constructor(
    private registry: MockEntityRegistry,
    private directResolver: DirectRelationshipResolver,
    private consistencyChecker: BidirectionalConsistencyChecker,
  ) {
    this.initializeStandardRules();
  }

  /**
   * Initialize standard biological validation rules
   */
  private initializeStandardRules(): void {
    const standardRules: ValidationRule[] = [
      // Data Integrity Rules
      {
        id: 'gene_organism_required',
        name: 'Gene Must Have Organism',
        description: 'Every gene must be associated with exactly one organism',
        category: 'data_integrity',
        severity: 'error',
        scope: 'entity',
        validator: (context) => this.validateGeneOrganismRequired(context),
        autoFix: (context) => this.autoFixGeneOrganism(context),
      },

      {
        id: 'protein_length_consistency',
        name: 'Protein Length Consistency',
        description:
          'Protein length must match sequence length when sequence is present',
        category: 'data_integrity',
        severity: 'error',
        scope: 'entity',
        validator: (context) => this.validateProteinLengthConsistency(context),
        autoFix: (context) => this.autoFixProteinLength(context),
      },

      {
        id: 'gene_transcript_consistency',
        name: 'Gene-Transcript Bidirectional Consistency',
        description: 'Gene-transcript relationships must be bidirectional',
        category: 'data_integrity',
        severity: 'error',
        scope: 'relationship',
        validator: (context) => this.validateGeneTranscriptConsistency(context),
        dependencies: ['gene_organism_required'],
      },

      // Business Logic Rules
      {
        id: 'qtl_lod_threshold',
        name: 'QTL LOD Score Threshold',
        description:
          'QTL LOD scores must be above minimum threshold (2.0) for significance',
        category: 'business_logic',
        severity: 'warning',
        scope: 'entity',
        validator: (context) => this.validateQTLLodThreshold(context),
      },

      {
        id: 'gene_naming_convention',
        name: 'Gene Naming Convention',
        description:
          'Gene identifiers must follow species-specific naming conventions',
        category: 'business_logic',
        severity: 'warning',
        scope: 'entity',
        validator: (context) => this.validateGeneNamingConvention(context),
        autoFix: (context) => this.autoFixGeneNaming(context),
      },

      // Performance Rules
      {
        id: 'collection_size_limit',
        name: 'Collection Size Reasonable',
        description:
          'Entity collections should not exceed reasonable size limits',
        category: 'performance',
        severity: 'warning',
        scope: 'collection',
        validator: (context) => this.validateCollectionSize(context),
      },

      {
        id: 'circular_reference_detection',
        name: 'Circular Reference Detection',
        description: 'Detect and warn about potential circular references',
        category: 'performance',
        severity: 'info',
        scope: 'graph',
        validator: (context) => this.validateCircularReferences(context),
      },

      // Compliance Rules
      {
        id: 'sequence_checksum_integrity',
        name: 'Sequence Checksum Integrity',
        description: 'Sequence checksums must be valid for data integrity',
        category: 'compliance',
        severity: 'error',
        scope: 'entity',
        validator: (context) => this.validateSequenceChecksum(context),
        autoFix: (context) => this.autoFixSequenceChecksum(context),
      },

      {
        id: 'organism_taxonomy_validation',
        name: 'Organism Taxonomy Validation',
        description:
          'Organism taxonomic information must be consistent and valid',
        category: 'compliance',
        severity: 'warning',
        scope: 'entity',
        validator: (context) => this.validateOrganismTaxonomy(context),
      },
    ];

    // Register all rules
    standardRules.forEach((rule) => {
      this.addValidationRule(rule);
    });

    console.log(
      `Initialized ${standardRules.length} standard validation rules`,
    );
  }

  /**
   * Execute comprehensive validation on an entity
   */
  validateEntity(
    entity: EntityNode,
    options: {
      includeRelationships?: boolean;
      rulesToRun?: string[];
      autoFix?: boolean;
      userContext?: any;
    } = {},
  ): ValidationReport {
    const _startTime = Date.now();
    const {
      includeRelationships = true,
      rulesToRun,
      autoFix = false,
      userContext,
    } = options;

    console.log(`\n=== Validating Entity: ${entity.type} ${entity.id} ===`);

    const allViolations: ValidationViolation[] = [];
    const executionMetrics = {
      totalExecutionTime: 0,
      averageRuleTime: 0,
      entitiesValidated: 1,
      relationshipsValidated: 0,
    };

    // Get applicable rules
    const applicableRules = this.getApplicableRules(entity, rulesToRun);
    const sortedRules = this.sortRulesByDependencies(applicableRules);

    console.log(`Running ${sortedRules.length} applicable rules...`);

    // Execute rules
    for (const rule of sortedRules) {
      const ruleStartTime = Date.now();

      try {
        const context: ValidationContext = {
          entity,
          registry: this.registry,
          resolver: this.directResolver,
          metadata: {includeRelationships, autoFix},
          userContext,
        };

        // Add related entities for relationship validation
        if (includeRelationships && rule.scope === 'relationship') {
          context.relatedEntities = this.getRelatedEntities(entity);
          executionMetrics.relationshipsValidated +=
            context.relatedEntities.length;
        }

        const result = rule.validator(context);
        allViolations.push(...result.violations);

        // Apply auto-fix if requested and available
        if (autoFix && rule.autoFix && !result.passed) {
          const autoFixResult = rule.autoFix(context);
          if (autoFixResult.applied) {
            console.log(
              `  Auto-fixed rule: ${rule.name} (${autoFixResult.actions.length} actions)`,
            );
          }
        }

        const ruleTime = Date.now() - ruleStartTime;
        executionMetrics.totalExecutionTime += ruleTime;

        console.log(
          `  ${rule.name}: ${result.passed ? 'PASS' : 'FAIL'} (${result.violations.length} violations, ${ruleTime}ms)`,
        );
      } catch (error) {
        console.error(`  ${rule.name}: ERROR - ${error}`);
        allViolations.push({
          ruleId: rule.id,
          severity: 'error',
          message: 'Rule execution failed',
          details: String(error),
          entityId: entity.id,
          autoFixable: false,
        });
      }
    }

    executionMetrics.averageRuleTime =
      sortedRules.length > 0
        ? executionMetrics.totalExecutionTime / sortedRules.length
        : 0;

    // Generate comprehensive report
    const report = this.generateValidationReport(
      allViolations,
      sortedRules,
      executionMetrics,
    );

    console.log(
      `\nValidation completed: ${report.summary.passedRules}/${report.summary.totalRules} rules passed, ${report.summary.totalViolations} violations`,
    );

    // Store in history
    this.executionHistory.push(report);

    return report;
  }

  /**
   * Validate entire entity graph
   */
  validateGraph(
    options: {
      sampleSize?: number;
      rulesToRun?: string[];
      autoFix?: boolean;
      parallel?: boolean;
    } = {},
  ): ValidationReport {
    const {sampleSize, parallel: _parallel = false} = options;

    console.log('\n=== Graph-Wide Validation ===');

    const entityTypes = this.registry.getAllEntityTypes();
    const allViolations: ValidationViolation[] = [];
    let totalExecutionTime = 0;
    let entitiesValidated = 0;
    let relationshipsValidated = 0;

    for (const entityType of entityTypes) {
      console.log(`\nValidating ${entityType} entities...`);

      let entities = this.registry.getEntitiesByType(entityType);

      // Sample entities if requested
      if (sampleSize && entities.length > sampleSize) {
        entities = entities.slice(0, sampleSize);
        console.log(
          `Sampling ${sampleSize} of ${this.registry.getEntitiesByType(entityType).length} entities`,
        );
      }

      for (const entity of entities) {
        const entityReport = this.validateEntity(entity, options);
        allViolations.push(
          ...Object.values(entityReport.violationsBySeverity).flat(),
        );
        totalExecutionTime += entityReport.executionMetrics.totalExecutionTime;
        entitiesValidated++;
        relationshipsValidated +=
          entityReport.executionMetrics.relationshipsValidated;
      }
    }

    // Generate graph-level report
    const applicableRules = Array.from(this.validationRules.values());
    const executionMetrics = {
      totalExecutionTime,
      averageRuleTime:
        totalExecutionTime / (entitiesValidated * applicableRules.length),
      entitiesValidated,
      relationshipsValidated,
    };

    return this.generateValidationReport(
      allViolations,
      applicableRules,
      executionMetrics,
    );
  }

  // Validation Rule Implementations

  private validateGeneOrganismRequired(
    context: ValidationContext,
  ): ValidationRuleResult {
    const startTime = Date.now();
    const violations: ValidationViolation[] = [];

    if (context.entity.type !== 'Gene') {
      return {
        passed: true,
        violations: [],
        metrics: {executionTime: 0, entitiesChecked: 0, rulesEvaluated: 1},
        suggestions: [],
      };
    }

    const organismRelationship = this.directResolver.resolveDirectRelationship(
      context.entity,
      'organism',
    );

    if (!organismRelationship || organismRelationship.entities.length === 0) {
      violations.push({
        ruleId: 'gene_organism_required',
        severity: 'error',
        message: 'Gene missing required organism relationship',
        details: `Gene ${context.entity.id} must be associated with exactly one organism`,
        entityId: context.entity.id,
        relationshipName: 'organism',
        expectedValue: 'one organism entity',
        actualValue: 'null',
        fixSuggestion: 'Add organism relationship to gene',
        autoFixable: true,
      });
    } else if (organismRelationship.entities.length > 1) {
      violations.push({
        ruleId: 'gene_organism_required',
        severity: 'warning',
        message: 'Gene has multiple organism relationships',
        details: `Gene ${context.entity.id} has ${organismRelationship.entities.length} organism relationships, expected 1`,
        entityId: context.entity.id,
        relationshipName: 'organism',
        expectedValue: 1,
        actualValue: organismRelationship.entities.length,
        fixSuggestion: 'Remove duplicate organism relationships',
        autoFixable: false,
      });
    }

    return {
      passed: violations.length === 0,
      violations,
      metrics: {
        executionTime: Date.now() - startTime,
        entitiesChecked: 1,
        rulesEvaluated: 1,
      },
      suggestions:
        violations.length > 0
          ? ['Ensure all genes have exactly one organism relationship']
          : [],
    };
  }

  private validateProteinLengthConsistency(
    context: ValidationContext,
  ): ValidationRuleResult {
    const startTime = Date.now();
    const violations: ValidationViolation[] = [];

    if (context.entity.type !== 'Protein') {
      return {
        passed: true,
        violations: [],
        metrics: {executionTime: 0, entitiesChecked: 0, rulesEvaluated: 1},
        suggestions: [],
      };
    }

    const protein = context.entity;
    const proteinLength = protein.data.length;

    const sequenceRelationship = this.directResolver.resolveDirectRelationship(
      protein,
      'sequence',
    );

    if (sequenceRelationship && sequenceRelationship.entities.length > 0) {
      const sequence = sequenceRelationship.entities[0];
      const sequenceLength = sequence.data.length;

      if (proteinLength && sequenceLength && proteinLength !== sequenceLength) {
        violations.push({
          ruleId: 'protein_length_consistency',
          severity: 'error',
          message: 'Protein length inconsistent with sequence length',
          details: `Protein ${protein.id} has length ${proteinLength} but sequence has length ${sequenceLength}`,
          entityId: protein.id,
          relationshipName: 'sequence',
          expectedValue: sequenceLength,
          actualValue: proteinLength,
          fixSuggestion: 'Update protein length to match sequence length',
          autoFixable: true,
        });
      }
    }

    return {
      passed: violations.length === 0,
      violations,
      metrics: {
        executionTime: Date.now() - startTime,
        entitiesChecked: 1,
        rulesEvaluated: 1,
      },
      suggestions:
        violations.length > 0
          ? [
              'Ensure protein lengths match sequence lengths when sequences are present',
            ]
          : [],
    };
  }

  private validateGeneTranscriptConsistency(
    context: ValidationContext,
  ): ValidationRuleResult {
    const startTime = Date.now();
    const violations: ValidationViolation[] = [];

    if (context.entity.type !== 'Gene') {
      return {
        passed: true,
        violations: [],
        metrics: {executionTime: 0, entitiesChecked: 0, rulesEvaluated: 1},
        suggestions: [],
      };
    }

    const gene = context.entity;
    const transcriptsRelationship =
      this.directResolver.resolveDirectRelationship(gene, 'transcripts');

    if (
      transcriptsRelationship &&
      transcriptsRelationship.entities.length > 0
    ) {
      for (const transcript of transcriptsRelationship.entities) {
        const geneBackRef = this.directResolver.resolveDirectRelationship(
          transcript,
          'gene',
        );

        if (!geneBackRef || geneBackRef.entities.length === 0) {
          violations.push({
            ruleId: 'gene_transcript_consistency',
            severity: 'error',
            message: 'Transcript missing gene back-reference',
            details: `Transcript ${transcript.id} is referenced by gene ${gene.id} but doesn't reference back`,
            entityId: gene.id,
            relationshipName: 'transcripts',
            fixSuggestion: 'Add gene back-reference to transcript',
            autoFixable: true,
          });
        } else if (!geneBackRef.entities.some((g) => g.id === gene.id)) {
          violations.push({
            ruleId: 'gene_transcript_consistency',
            severity: 'error',
            message: 'Transcript gene back-reference incorrect',
            details: `Transcript ${transcript.id} doesn't reference back to correct gene ${gene.id}`,
            entityId: gene.id,
            relationshipName: 'transcripts',
            fixSuggestion: 'Fix gene back-reference in transcript',
            autoFixable: true,
          });
        }
      }
    }

    return {
      passed: violations.length === 0,
      violations,
      metrics: {
        executionTime: Date.now() - startTime,
        entitiesChecked: 1 + (transcriptsRelationship?.entities.length || 0),
        rulesEvaluated: 1,
      },
      suggestions:
        violations.length > 0
          ? [
              'Ensure bidirectional consistency for gene-transcript relationships',
            ]
          : [],
    };
  }

  private validateQTLLodThreshold(
    context: ValidationContext,
  ): ValidationRuleResult {
    const startTime = Date.now();
    const violations: ValidationViolation[] = [];

    if (context.entity.type !== 'QTL') {
      return {
        passed: true,
        violations: [],
        metrics: {executionTime: 0, entitiesChecked: 0, rulesEvaluated: 1},
        suggestions: [],
      };
    }

    const qtl = context.entity;
    const lodScore = qtl.data.lod;
    const threshold = 2.0;

    if (lodScore !== null && lodScore !== undefined && lodScore < threshold) {
      violations.push({
        ruleId: 'qtl_lod_threshold',
        severity: 'warning',
        message: 'QTL LOD score below significance threshold',
        details: `QTL ${qtl.id} has LOD score ${lodScore}, which is below the significance threshold of ${threshold}`,
        entityId: qtl.id,
        expectedValue: `>= ${threshold}`,
        actualValue: lodScore,
        fixSuggestion: 'Review QTL significance or adjust threshold',
        autoFixable: false,
      });
    }

    return {
      passed: violations.length === 0,
      violations,
      metrics: {
        executionTime: Date.now() - startTime,
        entitiesChecked: 1,
        rulesEvaluated: 1,
      },
      suggestions:
        violations.length > 0
          ? ['Consider filtering QTLs by LOD score significance']
          : [],
    };
  }

  private validateGeneNamingConvention(
    context: ValidationContext,
  ): ValidationRuleResult {
    const _startTime = Date.now();
    const violations: ValidationViolation[] = [];

    if (context.entity.type !== 'Gene') {
      return {
        passed: true,
        violations: [],
        metrics: {executionTime: 0, entitiesChecked: 0, rulesEvaluated: 1},
        suggestions: [],
      };
    }

    const gene = context.entity;
    const identifier = gene.data.primaryIdentifier || gene.data.identifier;

    // Arabidopsis naming convention check
    const arabidopsisPattern = /^AT[1-5CM]G\d{5}$/;

    if (identifier && !arabidopsisPattern.test(identifier)) {
      violations.push({
        ruleId: 'gene_naming_convention',
        severity: 'warning',
        message: 'Gene identifier does not follow naming convention',
        details: `Gene ${gene.id} identifier "${identifier}" doesn't match Arabidopsis pattern AT[1-5CM]G#####`,
        entityId: gene.id,
        expectedValue: 'AT[1-5CM]G##### format',
        actualValue: identifier,
        fixSuggestion:
          'Update gene identifier to follow species naming convention',
        autoFixable: false,
      });
    }

    return {
      passed: violations.length === 0,
      violations,
      metrics: {
        executionTime: Date.now() - startTime,
        entitiesChecked: 1,
        rulesEvaluated: 1,
      },
      suggestions:
        violations.length > 0
          ? ['Standardize gene identifiers according to species conventions']
          : [],
    };
  }

  private validateCollectionSize(
    context: ValidationContext,
  ): ValidationRuleResult {
    const startTime = Date.now();
    const violations: ValidationViolation[] = [];

    const maxCollectionSize = 1000; // Reasonable limit for most collections
    const relationships = ['genes', 'proteins', 'transcripts'];

    for (const relationshipName of relationships) {
      const relationship = this.directResolver.resolveDirectRelationship(
        context.entity,
        relationshipName,
      );

      if (relationship && relationship.entities.length > maxCollectionSize) {
        violations.push({
          ruleId: 'collection_size_limit',
          severity: 'warning',
          message: 'Collection size exceeds reasonable limit',
          details: `Entity ${context.entity.id} has ${relationship.entities.length} ${relationshipName}, exceeding limit of ${maxCollectionSize}`,
          entityId: context.entity.id,
          relationshipName,
          expectedValue: `<= ${maxCollectionSize}`,
          actualValue: relationship.entities.length,
          fixSuggestion:
            'Consider pagination or filtering for large collections',
          autoFixable: false,
        });
      }
    }

    return {
      passed: violations.length === 0,
      violations,
      metrics: {
        executionTime: Date.now() - startTime,
        entitiesChecked: 1,
        rulesEvaluated: relationships.length,
      },
      suggestions:
        violations.length > 0
          ? ['Implement pagination for large collections']
          : [],
    };
  }

  private validateCircularReferences(
    context: ValidationContext,
  ): ValidationRuleResult {
    const startTime = Date.now();
    const violations: ValidationViolation[] = [];

    // Simple circular reference detection for common patterns
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const detectCircular = (entity: EntityNode, depth: number): boolean => {
      if (depth > 10) return true; // Depth limit to prevent infinite recursion
      if (visiting.has(entity.id)) return true; // Found circular reference
      if (visited.has(entity.id)) return false; // Already checked this branch

      visiting.add(entity.id);

      // Check common relationship patterns
      const relationships = ['gene', 'protein', 'transcript', 'organism'];

      for (const relName of relationships) {
        const related = this.directResolver.resolveDirectRelationship(
          entity,
          relName,
        );
        if (related) {
          for (const relatedEntity of related.entities) {
            if (detectCircular(relatedEntity, depth + 1)) {
              visiting.delete(entity.id);
              return true;
            }
          }
        }
      }

      visiting.delete(entity.id);
      visited.add(entity.id);
      return false;
    };

    if (detectCircular(context.entity, 0)) {
      violations.push({
        ruleId: 'circular_reference_detection',
        severity: 'info',
        message: 'Potential circular reference detected',
        details: `Entity ${context.entity.id} may be part of a circular reference chain`,
        entityId: context.entity.id,
        fixSuggestion:
          'Review relationship structure for circular dependencies',
        autoFixable: false,
      });
    }

    return {
      passed: violations.length === 0,
      violations,
      metrics: {
        executionTime: Date.now() - startTime,
        entitiesChecked: visited.size,
        rulesEvaluated: 1,
      },
      suggestions:
        violations.length > 0
          ? ['Review entity relationship graphs for circular dependencies']
          : [],
    };
  }

  private validateSequenceChecksum(
    context: ValidationContext,
  ): ValidationRuleResult {
    const startTime = Date.now();
    const violations: ValidationViolation[] = [];

    if (context.entity.type !== 'Sequence') {
      return {
        passed: true,
        violations: [],
        metrics: {executionTime: 0, entitiesChecked: 0, rulesEvaluated: 1},
        suggestions: [],
      };
    }

    const sequence = context.entity;
    const checksum = sequence.data.md5checksum;
    const residues = sequence.data.residues;

    if (checksum && residues) {
      // Simple checksum validation (would use actual MD5 in real implementation)
      const expectedChecksum = this.calculateSimpleMD5(residues);

      if (checksum !== expectedChecksum) {
        violations.push({
          ruleId: 'sequence_checksum_integrity',
          severity: 'error',
          message: 'Sequence checksum integrity violation',
          details: `Sequence ${sequence.id} checksum doesn't match content`,
          entityId: sequence.id,
          expectedValue: expectedChecksum,
          actualValue: checksum,
          fixSuggestion: 'Recalculate sequence checksum',
          autoFixable: true,
        });
      }
    }

    return {
      passed: violations.length === 0,
      violations,
      metrics: {
        executionTime: Date.now() - startTime,
        entitiesChecked: 1,
        rulesEvaluated: 1,
      },
      suggestions:
        violations.length > 0
          ? ['Verify sequence integrity with proper checksums']
          : [],
    };
  }

  private validateOrganismTaxonomy(
    context: ValidationContext,
  ): ValidationRuleResult {
    const startTime = Date.now();
    const violations: ValidationViolation[] = [];

    if (context.entity.type !== 'Organism') {
      return {
        passed: true,
        violations: [],
        metrics: {executionTime: 0, entitiesChecked: 0, rulesEvaluated: 1},
        suggestions: [],
      };
    }

    const organism = context.entity;
    const taxonId = organism.data.taxonId;
    const genus = organism.data.genus;
    const species = organism.data.species;
    const name = organism.data.name;

    // Basic taxonomy validation
    if (!taxonId || !genus || !species) {
      violations.push({
        ruleId: 'organism_taxonomy_validation',
        severity: 'warning',
        message: 'Incomplete taxonomic information',
        details: `Organism ${organism.id} missing required taxonomic fields`,
        entityId: organism.id,
        expectedValue: 'taxonId, genus, species',
        actualValue: {taxonId, genus, species},
        fixSuggestion: 'Complete taxonomic information',
        autoFixable: false,
      });
    }

    // Check name consistency
    if (
      name &&
      genus &&
      species &&
      !name.includes(genus) &&
      !name.includes(species)
    ) {
      violations.push({
        ruleId: 'organism_taxonomy_validation',
        severity: 'info',
        message: 'Organism name inconsistent with taxonomy',
        details: `Organism ${organism.id} name "${name}" doesn't contain genus/species`,
        entityId: organism.id,
        expectedValue: `Name containing ${genus} ${species}`,
        actualValue: name,
        fixSuggestion: 'Align organism name with taxonomic classification',
        autoFixable: false,
      });
    }

    return {
      passed: violations.length === 0,
      violations,
      metrics: {
        executionTime: Date.now() - startTime,
        entitiesChecked: 1,
        rulesEvaluated: 1,
      },
      suggestions:
        violations.length > 0
          ? ['Ensure complete and consistent taxonomic information']
          : [],
    };
  }

  // Auto-fix implementations

  private autoFixGeneOrganism(_context: ValidationContext): AutoFixResult {
    // In a real implementation, this would find appropriate organism and create relationship
    return {
      applied: false,
      actions: [],
      warnings: ['Auto-fix not implemented for missing organism relationship'],
      rollbackInstructions: [],
    };
  }

  private autoFixProteinLength(context: ValidationContext): AutoFixResult {
    const protein = context.entity;
    const sequenceRelationship = this.directResolver.resolveDirectRelationship(
      protein,
      'sequence',
    );

    if (sequenceRelationship && sequenceRelationship.entities.length > 0) {
      const sequence = sequenceRelationship.entities[0];
      const correctLength = sequence.data.length;

      // Update protein length
      protein.data.length = correctLength;

      return {
        applied: true,
        actions: [
          {
            type: 'update_field',
            entityId: protein.id,
            fieldName: 'length',
            oldValue: protein.data.length,
            newValue: correctLength,
            description: `Updated protein length to match sequence length`,
          },
        ],
        warnings: [],
        rollbackInstructions: [
          `Restore protein ${protein.id} length to original value`,
        ],
      };
    }

    return {
      applied: false,
      actions: [],
      warnings: ['No sequence available to determine correct length'],
      rollbackInstructions: [],
    };
  }

  private autoFixGeneNaming(_context: ValidationContext): AutoFixResult {
    // Gene naming auto-fix would require complex logic based on genomic location
    return {
      applied: false,
      actions: [],
      warnings: ['Gene naming auto-fix requires manual review'],
      rollbackInstructions: [],
    };
  }

  private autoFixSequenceChecksum(context: ValidationContext): AutoFixResult {
    const sequence = context.entity;
    const residues = sequence.data.residues;

    if (residues) {
      const correctChecksum = this.calculateSimpleMD5(residues);
      sequence.data.md5checksum = correctChecksum;

      return {
        applied: true,
        actions: [
          {
            type: 'update_field',
            entityId: sequence.id,
            fieldName: 'md5checksum',
            oldValue: sequence.data.md5checksum,
            newValue: correctChecksum,
            description: 'Recalculated sequence checksum',
          },
        ],
        warnings: [],
        rollbackInstructions: [
          `Restore sequence ${sequence.id} checksum to original value`,
        ],
      };
    }

    return {
      applied: false,
      actions: [],
      warnings: ['No residues available to calculate checksum'],
      rollbackInstructions: [],
    };
  }

  // Helper methods

  private getApplicableRules(
    entity: EntityNode,
    rulesToRun?: string[],
  ): ValidationRule[] {
    const allRules = Array.from(this.validationRules.values());

    if (rulesToRun) {
      return allRules.filter((rule) => rulesToRun.includes(rule.id));
    }

    // Return all rules that apply to this entity type
    return allRules.filter(
      (rule) =>
        rule.scope === 'entity' ||
        rule.scope === 'relationship' ||
        rule.scope === 'collection' ||
        rule.scope === 'graph',
    );
  }

  private sortRulesByDependencies(rules: ValidationRule[]): ValidationRule[] {
    const sorted: ValidationRule[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (rule: ValidationRule) => {
      if (visiting.has(rule.id)) {
        throw new Error(
          `Circular dependency detected in validation rules: ${rule.id}`,
        );
      }

      if (visited.has(rule.id)) {
        return;
      }

      visiting.add(rule.id);

      // Visit dependencies first
      if (rule.dependencies) {
        rule.dependencies.forEach((depId) => {
          const depRule = this.validationRules.get(depId);
          if (depRule && rules.includes(depRule)) {
            visit(depRule);
          }
        });
      }

      visiting.delete(rule.id);
      visited.add(rule.id);
      sorted.push(rule);
    };

    rules.forEach((rule) => {
      if (!visited.has(rule.id)) {
        visit(rule);
      }
    });

    return sorted;
  }

  private getRelatedEntities(entity: EntityNode): EntityNode[] {
    const relatedEntities: EntityNode[] = [];
    const relationshipNames = [
      'organism',
      'gene',
      'proteins',
      'transcripts',
      'sequence',
    ];

    relationshipNames.forEach((relName) => {
      const relationship = this.directResolver.resolveDirectRelationship(
        entity,
        relName,
      );
      if (relationship) {
        relatedEntities.push(...relationship.entities);
      }
    });

    return relatedEntities;
  }

  private generateValidationReport(
    violations: ValidationViolation[],
    rules: ValidationRule[],
    executionMetrics: any,
  ): ValidationReport {
    const violationsByCategory: Record<string, ValidationViolation[]> = {};
    const violationsBySeverity: Record<string, ValidationViolation[]> = {};
    const entityViolations: Record<string, ValidationViolation[]> = {};

    violations.forEach((violation) => {
      // Group by category
      const category =
        rules.find((r) => r.id === violation.ruleId)?.category || 'unknown';
      if (!violationsByCategory[category]) {
        violationsByCategory[category] = [];
      }
      violationsByCategory[category].push(violation);

      // Group by severity
      if (!violationsBySeverity[violation.severity]) {
        violationsBySeverity[violation.severity] = [];
      }
      violationsBySeverity[violation.severity].push(violation);

      // Group by entity
      if (!entityViolations[violation.entityId]) {
        entityViolations[violation.entityId] = [];
      }
      entityViolations[violation.entityId].push(violation);
    });

    const failedRules = new Set(violations.map((v) => v.ruleId)).size;
    const passedRules = rules.length - failedRules;

    return {
      summary: {
        totalRules: rules.length,
        passedRules,
        failedRules,
        totalViolations: violations.length,
        errorViolations: violationsBySeverity.error?.length || 0,
        warningViolations: violationsBySeverity.warning?.length || 0,
        autoFixableViolations: violations.filter((v) => v.autoFixable).length,
      },
      violationsByCategory,
      violationsBySeverity,
      entityViolations,
      recommendations: this.generateRecommendations(violations),
      executionMetrics,
    };
  }

  private generateRecommendations(violations: ValidationViolation[]): string[] {
    const recommendations: string[] = [];

    const errorCount = violations.filter((v) => v.severity === 'error').length;
    const warningCount = violations.filter(
      (v) => v.severity === 'warning',
    ).length;
    const autoFixableCount = violations.filter((v) => v.autoFixable).length;

    if (errorCount > 0) {
      recommendations.push(
        `Address ${errorCount} critical error(s) to ensure data integrity`,
      );
    }

    if (warningCount > 5) {
      recommendations.push(
        `Consider reviewing ${warningCount} warning(s) for data quality improvements`,
      );
    }

    if (autoFixableCount > 0) {
      recommendations.push(
        `${autoFixableCount} violation(s) can be automatically fixed`,
      );
    }

    return recommendations;
  }

  private calculateSimpleMD5(text: string): string {
    // Simplified checksum for demo purposes
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Add custom validation rule
   */
  addValidationRule(rule: ValidationRule): void {
    this.validationRules.set(rule.id, rule);

    if (rule.dependencies) {
      this.ruleDependencies.set(rule.id, rule.dependencies);
    }
  }

  /**
   * Remove validation rule
   */
  removeValidationRule(ruleId: string): void {
    this.validationRules.delete(ruleId);
    this.ruleDependencies.delete(ruleId);
  }

  /**
   * Get validation statistics
   */
  getValidationStatistics(): {
    totalRules: number;
    rulesByCategory: Record<string, number>;
    rulesBySeverity: Record<string, number>;
    executionHistory: number;
    averageViolationsPerRun: number;
  } {
    const rules = Array.from(this.validationRules.values());
    const rulesByCategory: Record<string, number> = {};
    const rulesBySeverity: Record<string, number> = {};

    rules.forEach((rule) => {
      rulesByCategory[rule.category] =
        (rulesByCategory[rule.category] || 0) + 1;
      rulesBySeverity[rule.severity] =
        (rulesBySeverity[rule.severity] || 0) + 1;
    });

    const averageViolationsPerRun =
      this.executionHistory.length > 0
        ? this.executionHistory.reduce(
            (sum, report) => sum + report.summary.totalViolations,
            0,
          ) / this.executionHistory.length
        : 0;

    return {
      totalRules: rules.length,
      rulesByCategory,
      rulesBySeverity,
      executionHistory: this.executionHistory.length,
      averageViolationsPerRun,
    };
  }

  /**
   * Clear execution history
   */
  clearHistory(): void {
    this.executionHistory = [];
  }
}

/**
 * Factory function to create validation constraint framework
 */
export function createValidationConstraintFramework(
  registry: MockEntityRegistry,
  directResolver: DirectRelationshipResolver,
  consistencyChecker: BidirectionalConsistencyChecker,
): ValidationConstraintFramework {
  return new ValidationConstraintFramework(
    registry,
    directResolver,
    consistencyChecker,
  );
}
