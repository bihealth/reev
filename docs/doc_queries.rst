.. _doc_queries:

=================
Supported Queries
=================

This section describes the queries that are supported by REEV.

.. _doc_queries_gene:

-----
Genes
-----

Gene queries in REEV allow users to search by HGNC symbol or NCBI/ENSEMBL/HGNC ID. Examples of gene queries include:

- `BRCA1`: Search by HGNC symbol.
- `HGNC:1100`: This refers to the BRCA1 gene.
- `7273`: This is the NCBI ID for the TTN gene.

.. _doc_queries_seqvar:

-----------------
Sequence Variants
-----------------

Sequence variant queries in REEV can be provided in HGVS notation, gnomAD style, or SPDI-style. Examples include:

Development Environment Examples:
- `NM_007294.4(BRCA1):c.5123C>A`: HGVS transcript SNV.
- `NM_000179.3:c.4082del`: HGVS transcript deletion.
- `NC_000017.10:g.41197728G>T`: HGVS genomic SNV.
- `GRCh37-chr17-41197751-G-T`: gnomAD style variant.
- `NC_000017.11:43039470:G:A`: Canonical SPDI.

.. _doc_queries_strucvar:

-------------------
Structural Variants
-------------------

Structural variant queries in REEV can be provided in various formats including ISCN notation, colon-separated, or hyphen-separated formats. Examples include:

- `DEL:chr17:41176312:41277500`: Deletion on chromosome 17.
- `DUP-chrX-73565114-73956354`: Duplication on chromosome X.
- `arr[GRCh37] 7q11(72,650,120_74,154,209)x1`: ISCN notation.
- `GRCh37 7q11(72,650,120_74,154,209)x1`: Shorter form of ISCN notation.
