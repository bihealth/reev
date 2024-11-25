// This file is auto-generated by @hey-api/openapi-ts

export const ApiAutoACMGSeqVarDataSchema = {
    properties: {
        cds_end: {
            description: 'The CDS end position of the sequence variant',
            title: 'Cds End',
            type: 'integer'
        },
        cds_pos: {
            description: 'The CDS position of the sequence variant',
            title: 'Cds Pos',
            type: 'integer'
        },
        cds_start: {
            description: 'The CDS start position of the sequence variant',
            title: 'Cds Start',
            type: 'integer'
        },
        consequence: {
            '$ref': '#/components/schemas/AutoACMGConsequence',
            description: 'The consequence of the sequence variant'
        },
        gene_symbol: {
            description: 'The gene symbol of the sequence variant',
            title: 'Gene Symbol',
            type: 'string'
        },
        hgnc_id: {
            description: 'The HGNC ID of the sequence variant',
            title: 'Hgnc Id',
            type: 'string'
        },
        pHGVS: {
            description: 'The pHGVS notation of the sequence variant',
            title: 'Phgvs',
            type: 'string'
        },
        prot_length: {
            description: 'The protein length of the sequence variant',
            title: 'Prot Length',
            type: 'integer'
        },
        prot_pos: {
            description: 'The protein position of the sequence variant',
            title: 'Prot Pos',
            type: 'integer'
        },
        scores: {
            '$ref': '#/components/schemas/AutoACMGSeqVarScores',
            description: 'The scores of the sequence variant'
        },
        strand: {
            '$ref': '#/components/schemas/GenomicStrand',
            description: 'The strand of the sequence variant'
        },
        thresholds: {
            '$ref': '#/components/schemas/AutoACMGSeqVarTresholds',
            description: 'The thresholds of the sequence variant'
        },
        transcript_id: {
            description: 'The transcript ID of the sequence variant',
            title: 'Transcript Id',
            type: 'string'
        },
        transcript_tags: {
            description: 'The transcript tags of the sequence variant',
            items: {
                type: 'string'
            },
            title: 'Transcript Tags',
            type: 'array'
        },
        tx_pos_utr: {
            description: 'The transcript position in the UTR of the sequence variant',
            title: 'Tx Pos Utr',
            type: 'integer'
        }
    },
    required: ['consequence', 'gene_symbol', 'hgnc_id', 'transcript_id', 'transcript_tags', 'tx_pos_utr', 'cds_pos', 'prot_pos', 'prot_length', 'pHGVS', 'cds_start', 'cds_end', 'strand', 'scores', 'thresholds'],
    title: 'ApiAutoACMGSeqVarData',
    type: 'object'
} as const;

export const ApiAutoACMGSeqVarResultSchema = {
    properties: {
        criteria: {
            '$ref': '#/components/schemas/AutoACMGCriteriaPred'
        },
        data: {
            '$ref': '#/components/schemas/ApiAutoACMGSeqVarData'
        },
        seqvar: {
            '$ref': '#/components/schemas/SeqVar'
        }
    },
    required: ['seqvar', 'data', 'criteria'],
    title: 'ApiAutoACMGSeqVarResult',
    type: 'object'
} as const;

export const AutoACMGCADDSchema = {
    properties: {
        ada: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Ada'
        },
        gerp: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Gerp'
        },
        phyloP100: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Phylop100'
        },
        rf: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Rf'
        },
        spliceAI_acceptor_gain: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Spliceai Acceptor Gain'
        },
        spliceAI_acceptor_loss: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Spliceai Acceptor Loss'
        },
        spliceAI_donor_gain: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Spliceai Donor Gain'
        },
        spliceAI_donor_loss: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Spliceai Donor Loss'
        }
    },
    title: 'AutoACMGCADD',
    type: 'object'
} as const;

export const AutoACMGConsequenceSchema = {
    properties: {
        cadd: {
            default: '',
            title: 'Cadd',
            type: 'string'
        },
        cadd_consequence: {
            default: '',
            title: 'Cadd Consequence',
            type: 'string'
        },
        mehari: {
            default: [],
            items: {
                type: 'string'
            },
            title: 'Mehari',
            type: 'array'
        }
    },
    title: 'AutoACMGConsequence',
    type: 'object'
} as const;

export const AutoACMGCriteriaSchema = {
    description: 'Criteria prediction.',
    properties: {
        description: {
            default: '',
            title: 'Description',
            type: 'string'
        },
        name: {
            title: 'Name',
            type: 'string'
        },
        prediction: {
            '$ref': '#/components/schemas/AutoACMGPrediction',
            default: 'not_set'
        },
        strength: {
            '$ref': '#/components/schemas/AutoACMGStrength',
            default: 'not_set'
        },
        summary: {
            default: '',
            title: 'Summary',
            type: 'string'
        }
    },
    required: ['name'],
    title: 'AutoACMGCriteria',
    type: 'object'
} as const;

export const AutoACMGCriteriaPredSchema = {
    description: 'ACMG criteria prediction.',
    properties: {
        ba1: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'BA1',
                prediction: 'not_set',
                strength: 'benign_stand_alone',
                summary: ''
            }
        },
        bp1: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'BP1',
                prediction: 'not_set',
                strength: 'benign_supporting',
                summary: ''
            }
        },
        bp2: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'BP2',
                prediction: 'not_automated',
                strength: 'benign_supporting',
                summary: ''
            }
        },
        bp3: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'BP3',
                prediction: 'not_set',
                strength: 'benign_supporting',
                summary: ''
            }
        },
        bp4: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'BP4',
                prediction: 'not_set',
                strength: 'benign_supporting',
                summary: ''
            }
        },
        bp5: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'BP5',
                prediction: 'not_automated',
                strength: 'benign_supporting',
                summary: ''
            }
        },
        bp6: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'BP6',
                prediction: 'deprecated',
                strength: 'benign_supporting',
                summary: ''
            }
        },
        bp7: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'BP7',
                prediction: 'not_set',
                strength: 'benign_supporting',
                summary: ''
            }
        },
        bs1: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'BS1',
                prediction: 'not_set',
                strength: 'benign_strong',
                summary: ''
            }
        },
        bs2: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'BS2',
                prediction: 'not_set',
                strength: 'benign_strong',
                summary: ''
            }
        },
        bs3: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'BS3',
                prediction: 'not_automated',
                strength: 'benign_strong',
                summary: ''
            }
        },
        bs4: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'BS4',
                prediction: 'not_automated',
                strength: 'benign_strong',
                summary: ''
            }
        },
        pm1: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'PM1',
                prediction: 'not_set',
                strength: 'pathogenic_moderate',
                summary: ''
            }
        },
        pm2: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'PM2',
                prediction: 'not_set',
                strength: 'pathogenic_moderate',
                summary: ''
            }
        },
        pm3: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'PM3',
                prediction: 'not_automated',
                strength: 'pathogenic_moderate',
                summary: ''
            }
        },
        pm4: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'PM4',
                prediction: 'not_set',
                strength: 'pathogenic_moderate',
                summary: ''
            }
        },
        pm5: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'PM5',
                prediction: 'not_set',
                strength: 'pathogenic_moderate',
                summary: ''
            }
        },
        pm6: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'PM6',
                prediction: 'not_automated',
                strength: 'pathogenic_moderate',
                summary: ''
            }
        },
        pp1: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'PP1',
                prediction: 'not_automated',
                strength: 'pathogenic_supporting',
                summary: ''
            }
        },
        pp2: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'PP2',
                prediction: 'not_set',
                strength: 'pathogenic_supporting',
                summary: ''
            }
        },
        pp3: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'PP3',
                prediction: 'not_set',
                strength: 'pathogenic_supporting',
                summary: ''
            }
        },
        pp4: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'PP4',
                prediction: 'not_automated',
                strength: 'pathogenic_supporting',
                summary: ''
            }
        },
        pp5: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'PP5',
                prediction: 'deprecated',
                strength: 'pathogenic_supporting',
                summary: ''
            }
        },
        ps1: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'PS1',
                prediction: 'not_set',
                strength: 'pathogenic_strong',
                summary: ''
            }
        },
        ps2: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'PS2',
                prediction: 'not_automated',
                strength: 'pathogenic_strong',
                summary: ''
            }
        },
        ps3: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'PS3',
                prediction: 'not_automated',
                strength: 'pathogenic_strong',
                summary: ''
            }
        },
        ps4: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'PS4',
                prediction: 'not_automated',
                strength: 'pathogenic_strong',
                summary: ''
            }
        },
        pvs1: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'PVS1',
                prediction: 'not_set',
                strength: 'pathogenic_very_strong',
                summary: ''
            }
        }
    },
    title: 'AutoACMGCriteriaPred',
    type: 'object'
} as const;

export const AutoACMGDbnsfpSchema = {
    properties: {
        alpha_missense: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Alpha Missense'
        },
        bayesDel_noAF: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Bayesdel Noaf'
        },
        fathmm: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Fathmm'
        },
        metaRNN: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Metarnn'
        },
        mutationTaster: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Mutationtaster'
        },
        mutpred: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Mutpred'
        },
        phyloP100: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Phylop100'
        },
        polyphen2: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Polyphen2'
        },
        primateAI: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Primateai'
        },
        provean: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Provean'
        },
        revel: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Revel'
        },
        sift: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Sift'
        },
        vest4: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Vest4'
        }
    },
    title: 'AutoACMGDbnsfp',
    type: 'object'
} as const;

export const AutoACMGDbscsnvSchema = {
    properties: {
        ada: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Ada'
        },
        rf: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Rf'
        }
    },
    title: 'AutoACMGDbscsnv',
    type: 'object'
} as const;

export const AutoACMGPredictionSchema = {
    description: 'ACMG criteria prediction enumeration.',
    enum: ['not_set', 'applicable', 'not_applicable', 'not_automated', 'deprecated', 'failed'],
    title: 'AutoACMGPrediction',
    type: 'string'
} as const;

export const AutoACMGSeqVarScoresSchema = {
    description: 'ACMG scores.',
    properties: {
        cadd: {
            '$ref': '#/components/schemas/AutoACMGCADD',
            default: {}
        },
        dbnsfp: {
            '$ref': '#/components/schemas/AutoACMGDbnsfp',
            default: {}
        },
        dbscsnv: {
            '$ref': '#/components/schemas/AutoACMGDbscsnv',
            default: {}
        },
        misZ: {
            anyOf: [
                {
                    type: 'number'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Misz'
        }
    },
    title: 'AutoACMGSeqVarScores',
    type: 'object'
} as const;

export const AutoACMGSeqVarTresholdsSchema = {
    description: 'ACMG thresholds.',
    properties: {
        ada: {
            default: 0.957813,
            title: 'Ada',
            type: 'number'
        },
        an_min: {
            default: 2000,
            title: 'An Min',
            type: 'integer'
        },
        ba1_benign: {
            default: 0.05,
            title: 'Ba1 Benign',
            type: 'number'
        },
        bayesDel_noAF_benign: {
            default: -0.476,
            title: 'Bayesdel Noaf Benign',
            type: 'number'
        },
        bayesDel_noAF_pathogenic: {
            default: 0.521,
            title: 'Bayesdel Noaf Pathogenic',
            type: 'number'
        },
        bp7_acceptor: {
            default: 2,
            title: 'Bp7 Acceptor',
            type: 'integer'
        },
        bp7_donor: {
            default: 1,
            title: 'Bp7 Donor',
            type: 'integer'
        },
        bs1_benign: {
            default: 0.00015,
            title: 'Bs1 Benign',
            type: 'number'
        },
        cadd_benign: {
            default: 10,
            title: 'Cadd Benign',
            type: 'number'
        },
        cadd_pathogenic: {
            default: 20,
            title: 'Cadd Pathogenic',
            type: 'number'
        },
        gerp: {
            default: 0,
            title: 'Gerp',
            type: 'number'
        },
        metaRNN_benign: {
            default: 0.267,
            title: 'Metarnn Benign',
            type: 'number'
        },
        metaRNN_pathogenic: {
            default: 0.841,
            title: 'Metarnn Pathogenic',
            type: 'number'
        },
        phyloP100: {
            default: 3.58,
            title: 'Phylop100',
            type: 'number'
        },
        pm1_pathogenic: {
            default: 8,
            title: 'Pm1 Pathogenic',
            type: 'number'
        },
        pm2_pathogenic: {
            default: 0.0001,
            title: 'Pm2 Pathogenic',
            type: 'number'
        },
        pp2bp1_benign: {
            default: 0.569,
            title: 'Pp2Bp1 Benign',
            type: 'number'
        },
        pp2bp1_pathogenic: {
            default: 0.808,
            title: 'Pp2Bp1 Pathogenic',
            type: 'number'
        },
        pp3bp4_strategy: {
            default: 'default',
            title: 'Pp3Bp4 Strategy',
            type: 'string'
        },
        revel_benign: {
            default: 0.016,
            title: 'Revel Benign',
            type: 'number'
        },
        revel_pathogenic: {
            default: 0.773,
            title: 'Revel Pathogenic',
            type: 'number'
        },
        rf: {
            default: 0.584,
            title: 'Rf',
            type: 'number'
        },
        spliceAI_acceptor_gain: {
            default: 0.1,
            title: 'Spliceai Acceptor Gain',
            type: 'number'
        },
        spliceAI_acceptor_loss: {
            default: 0.1,
            title: 'Spliceai Acceptor Loss',
            type: 'number'
        },
        spliceAI_donor_gain: {
            default: 0.1,
            title: 'Spliceai Donor Gain',
            type: 'number'
        },
        spliceAI_donor_loss: {
            default: 0.1,
            title: 'Spliceai Donor Loss',
            type: 'number'
        }
    },
    title: 'AutoACMGSeqVarTresholds',
    type: 'object'
} as const;

export const AutoACMGStrengthSchema = {
    description: 'ACMG criteria strength enumeration.',
    enum: ['not_set', 'pathogenic_very_strong', 'pathogenic_strong', 'pathogenic_moderate', 'pathogenic_supporting', 'benign_stand_alone', 'benign_strong', 'benign_supporting'],
    title: 'AutoACMGStrength',
    type: 'string'
} as const;

export const AutoACMGStrucVarDataSchema = {
    properties: {
        exons: {
            default: [],
            items: {
                '$ref': '#/components/schemas/Exon'
            },
            title: 'Exons',
            type: 'array'
        },
        gene_symbol: {
            default: '',
            title: 'Gene Symbol',
            type: 'string'
        },
        hgnc_id: {
            default: '',
            title: 'Hgnc Id',
            type: 'string'
        },
        start_cdn: {
            default: 0,
            title: 'Start Cdn',
            type: 'integer'
        },
        stop_cdn: {
            default: 0,
            title: 'Stop Cdn',
            type: 'integer'
        },
        strand: {
            '$ref': '#/components/schemas/GenomicStrand',
            default: 'not_set'
        },
        transcript_id: {
            default: '',
            title: 'Transcript Id',
            type: 'string'
        },
        transcript_tags: {
            default: [],
            items: {
                type: 'string'
            },
            title: 'Transcript Tags',
            type: 'array'
        }
    },
    title: 'AutoACMGStrucVarData',
    type: 'object'
} as const;

export const AutoACMGStrucVarPredSchema = {
    properties: {
        pvs1: {
            '$ref': '#/components/schemas/AutoACMGCriteria',
            default: {
                description: '',
                name: 'PVS1',
                prediction: 'not_set',
                strength: 'pathogenic_very_strong',
                summary: ''
            }
        }
    },
    title: 'AutoACMGStrucVarPred',
    type: 'object'
} as const;

export const AutoACMGStrucVarResultSchema = {
    description: 'Response of the ACMG criteria prediction for structural variants.',
    properties: {
        criteria: {
            '$ref': '#/components/schemas/AutoACMGStrucVarPred',
            default: {
                pvs1: {
                    description: '',
                    name: 'PVS1',
                    prediction: 'not_set',
                    strength: 'pathogenic_very_strong',
                    summary: ''
                }
            }
        },
        data: {
            '$ref': '#/components/schemas/AutoACMGStrucVarData',
            default: {
                exons: [],
                gene_symbol: '',
                hgnc_id: '',
                start_cdn: 0,
                stop_cdn: 0,
                strand: 'not_set',
                transcript_id: '',
                transcript_tags: []
            }
        },
        strucvar: {
            anyOf: [
                {
                    '$ref': '#/components/schemas/StrucVar'
                },
                {
                    type: 'null'
                }
            ]
        }
    },
    title: 'AutoACMGStrucVarResult',
    type: 'object'
} as const;

export const ExonSchema = {
    properties: {
        altCdsEndI: {
            title: 'Altcdsendi',
            type: 'integer'
        },
        altCdsStartI: {
            title: 'Altcdsstarti',
            type: 'integer'
        },
        altEndI: {
            title: 'Altendi',
            type: 'integer'
        },
        altStartI: {
            title: 'Altstarti',
            type: 'integer'
        },
        cigar: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Cigar'
        },
        ord: {
            anyOf: [
                {
                    type: 'integer'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Ord'
        }
    },
    required: ['altStartI', 'altEndI', 'altCdsStartI', 'altCdsEndI'],
    title: 'Exon',
    type: 'object'
} as const;

export const GenomeReleaseSchema = {
    description: 'Enumeration for allowed genome release values.',
    enum: ['GRCh37', 'GRCh38'],
    title: 'GenomeRelease',
    type: 'string'
} as const;

export const GenomicStrandSchema = {
    description: 'Genomic strand enumeration.',
    enum: ['plus', 'minus', 'not_set'],
    title: 'GenomicStrand',
    type: 'string'
} as const;

export const HTTPValidationErrorSchema = {
    properties: {
        detail: {
            items: {
                '$ref': '#/components/schemas/ValidationError'
            },
            title: 'Detail',
            type: 'array'
        }
    },
    title: 'HTTPValidationError',
    type: 'object'
} as const;

export const SeqVarSchema = {
    properties: {
        chrom: {
            title: 'Chrom',
            type: 'string'
        },
        delete: {
            title: 'Delete',
            type: 'string'
        },
        genome_release: {
            '$ref': '#/components/schemas/GenomeRelease'
        },
        insert: {
            title: 'Insert',
            type: 'string'
        },
        pos: {
            title: 'Pos',
            type: 'integer'
        },
        user_repr: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'User Repr'
        }
    },
    required: ['genome_release', 'chrom', 'pos', 'delete', 'insert'],
    title: 'SeqVar',
    type: 'object'
} as const;

export const SeqVarPredictionResponseSchema = {
    properties: {
        prediction: {
            '$ref': '#/components/schemas/ApiAutoACMGSeqVarResult',
            description: 'The prediction result for the sequence variant'
        }
    },
    required: ['prediction'],
    title: 'SeqVarPredictionResponse',
    type: 'object'
} as const;

export const StrucVarSchema = {
    properties: {
        chrom: {
            title: 'Chrom',
            type: 'string'
        },
        genome_release: {
            '$ref': '#/components/schemas/GenomeRelease'
        },
        start: {
            title: 'Start',
            type: 'integer'
        },
        stop: {
            title: 'Stop',
            type: 'integer'
        },
        sv_type: {
            '$ref': '#/components/schemas/StrucVarType'
        },
        user_repr: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'User Repr'
        }
    },
    required: ['sv_type', 'genome_release', 'chrom', 'start', 'stop'],
    title: 'StrucVar',
    type: 'object'
} as const;

export const StrucVarPredictionResponseSchema = {
    properties: {
        prediction: {
            '$ref': '#/components/schemas/AutoACMGStrucVarResult',
            description: 'The prediction result for the structural variant'
        }
    },
    required: ['prediction'],
    title: 'StrucVarPredictionResponse',
    type: 'object'
} as const;

export const StrucVarTypeSchema = {
    description: 'Enumeration for structural variant type.',
    enum: [1, 2],
    title: 'StrucVarType',
    type: 'integer'
} as const;

export const ValidationErrorSchema = {
    properties: {
        loc: {
            items: {
                anyOf: [
                    {
                        type: 'string'
                    },
                    {
                        type: 'integer'
                    }
                ]
            },
            title: 'Location',
            type: 'array'
        },
        msg: {
            title: 'Message',
            type: 'string'
        },
        type: {
            title: 'Error Type',
            type: 'string'
        }
    },
    required: ['loc', 'msg', 'type'],
    title: 'ValidationError',
    type: 'object'
} as const;

export const VariantResolveResponseSchema = {
    properties: {
        resolved_variant: {
            anyOf: [
                {
                    '$ref': '#/components/schemas/SeqVar'
                },
                {
                    '$ref': '#/components/schemas/StrucVar'
                }
            ],
            description: 'The resolved variant',
            title: 'Resolved Variant'
        },
        variant_type: {
            description: 'The type of the variant (sequence or structural)',
            title: 'Variant Type',
            type: 'string'
        }
    },
    required: ['variant_type', 'resolved_variant'],
    title: 'VariantResolveResponse',
    type: 'object'
} as const;