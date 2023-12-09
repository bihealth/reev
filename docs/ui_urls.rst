.. _ui_urls:

==============
Front-End URLs
==============

This section describes the stable part of the front-end's URLs (aka web addresses).
It includes a description how the search/lookup works in REEV and the supported query formats.

Overall, the front-end allows to lookup information on:

- sequence variants (``seqvars``, we consider all variants <50bp as small and these are also known as SNVs, SNPs, indels, etc.)
- structural variants (``strucvars``, where we currently support detailed information only on deletions and duplications, aka copy number losses and gains)
- individual genes

This section first describes the representation of the entities that REEV can be queried for.
It then continues with the description of the URLs and the query engine behaviour.

-------------------
Aims and Background
-------------------

The aim of the variant/gene query (or better fitting: resolution) engine is to provide users with an intuitive/natural way to search for variants (and genes).
The user input has to fulfill certain requirements, e.g., not contain too much extra whitespace.
The description below includes a summary of what normalization is performed.

Note that the user generally has to select one of the supported genome releases GRCh37 or GRCh38, even for genes, the default currently is GRCh37.
The reason for this is that reference genome specific information will also be displayed

The start page of REEV contains a number of examples for valid queries that should illustrate the supported formats.

-----------------
Sequence Variants
-----------------

.. note::

    dbSNP and ClinVar accession translation has not been implemented yet.

Sequence variants are supported in the following formats:

HGVS genomic variants (``g.`` format)

    For example: ``NC_000017.10:g.48275363C>A`` or ``NC_000017.11:g.50198002C>A``.
    Note that the sequence identifier are case sensitive must be versioned.
    The genome version will be derived from the sequence identifiers.

HGVS transcript variants (either ``c.`` or ``n.`` format)

    For example: ``NM_000088.4:n.653G>T`` or ``NM_000088.4:c.535G>T``.
    Here, the genome release will be needed to extract the genome reference information.

gnomAD variant identifiers

    For example: ``1-55516888-G-A``.
    Here, we will need explicit genome release information as well.
    You can also provide this, e.g., with ``GRCh37-1-55516888-G-A``.

Canonical SPDI

    This is the format ``SEQUENCE:POSITION:REF:ALT`` where ``SEQUENCE`` is the GenBank sequence name of the GRCh38 release.
    For example: ``GRCh38:17:50198002:C:A`` or ``GRCh37:17:48275363:C:A``.

SPDI with genome release

    You can also use ``RELEASE:CHROM`` for the ``SEQUENCE`` name above.
    Example: ``GRCh38:10:87925523:C:G``.
    If you leave out the release name and just use ``CHROM`` then the genome release from the search field will be used, falling back to GRCh37.

dbSNP Identifier

    This is the format ``rs<NUMBER>`` where ``<NUMBER>`` is the dbSNP identifier.
    This is case insensitive.
    For example: ``rs123456``.

ClinVar identifier

    This is ``RCV<NUMBER>`` and ``VCV<NUMBER>``.
    Optionally, you can specify a ``.<VERSION>`` suffix which is subsequently ignored.

Overall, we support the following genome release identifiers (case insensitive) of the GRCh37 and GRCh38 releases.
``GRCh37``, ``GRCh38``, ``hg19``, ``hg38``.
Only canonical chromosomes ``1..22``, ``X``, ``Y``, ``MT`` are supported.

-------------------
Structural Variants
-------------------

You can specify deletions and duplications as follows:

Colon-separated format

    ``TYPE:SEQUENCE:START`` where ``SEQUENCE`` can be an NCBI identifier, the ``RELEASE:CHROM``, or just ``CHROM`` as for sequence variant SPDI.
    Examples: ``DEL:NC_000017.10:48275363`` or ``DEL:GRCh37:17:48275363`` or ``DUP:17:48275363``.
    Optionally, you can also use a the gnomAD-style variant identifier and use a hyphen rather than a color and, e.g., write ``DEL-GRCh37-17-48275363``

ISCN array format

    These follow the format ``arr[$RELEASE] $CHROM.$CHROME($START_$STOP)x$COPY``.
    ```$RELEASE`` is the genome release, ``$CHROMB`` is the ``CHROM{p,q}BAND`` of the start position, similarly ``$CHROME`` for the end chromosome.
    ``$START`` and ``$STOP`` are the start and stop positions, ``$COPY`` is the copy number.
    Examples: ``arr[GRCh37] 2q12.2q13(107132950_110427254)x1`` for a deletion or or ``arr[hg38] 17q23.1-25.1(chr17:36449220-75053130)x3`` for a duplication.
    You can also just specify ``$RELEASE`` rather than ``arr[$RELEASE]``.

-----
Genes
-----

You can lookup genes by:

- their approved HGNC symbols
- alias symbols as provided by HGNC
- previous symbols registered with HGNC
- the official HGNC identifier

All gene search is case insensitive.

For example, see the `HGNC page on the *VPS13B* gene <https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:2183>`__.
The approved symbol is *VPS13B*, the only alias symbol is *BLTP5B`, previous symbols are *CHS1* and *COH1*, and the HGNC identifier is ``HGNC:2183``
So the following queries would bring you to the gene *VPS13B*:

- ``VPS13B``
- ``VPS13b``
- ``BLTP5B``
- ``CHS1``
- ``COH1``
- ``coh1``
- ``coH1``
- ``HGNC:2183``

----
URLs
----

REEV provides the following stable entrypoint URLs.

``/query?q=${TERM}&genomeRelease=${GENOME}``

    Query endpoint where ``TERM`` can be in any of the supported formats above.
    See below for the documented behaviour.

``/gene/${GENOME}/${SYMBOL}``

    Canonical URLs of genes with the official HGNC symbol.
    When loaded, the symbol will be checked against the HGNC database.
    If we only find a match for an alias or previous symbol, the user will be redirected to the official symbol.

``/seqvar/${GENOME}/${CHROM}-${POS}-${DEL}-${INS}``

    Canonical URLs of sequence variants in gnomAD-style SPDI format.
    Currently, no check is performed whether ``DEL`` sequence is correct in the reference.

``/strucvar/${GENOME}/(DEL|DUP)/${CHROM}-${START}-${STOP}``

    Canonical URLs of deletions and insertions.

-----------------
Resolving Queries
-----------------

The resolution of gene names is done by a backend service, as is the parsing of HGVS variants and projection to gnomic coordinates.
The remaining query formats are directly resolved by the query engine by parsing the data.
The query engine will perform the following steps.

1. Attempt to interpret as one of the known sequence variant formats.

    a. gnomAD variant identifier
    b. SPDI
    c. dbSNP identifier
    d. ClinVar identifier

2. Attempt to interpret as one of the known structural variant formats.

    a. Colon-separated format
    b. ISCN array format

3. Attempt to interpret as HGVS notation with backend service.

4. Attempt to find a perfect case sensitive match for a gene symbol, alias, or previous symbol.

5. Attempt to find a partial match for a gene symbol, alias, or previous symbol.
