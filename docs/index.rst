.. _index:

====
REEV
====

REEV (REEV: Explanation and Evaluation of Variants) is a web-based tool for clinicians and researchers in rare disease genetics.
See below for a list of features.
A good place to start learning about REEV is the :ref:`quickstart <doc_quickstart>` or :ref:`tutorial <doc_tutorial>`.

--------
Features
--------

It provides the following features as a central resource:

- gene-related information and functionality:
    - basic information, including gene summaries
    - gene pathogenicity information, such as pLI and LOEUF constraints, DECIPHER Haploinsufficiency, ...
    - condition/disease-related information
    - aggregated variant information from ClinVar
    - gene-phenotype similarity information and ranking

- sequence variant-related functionality:
    - consequences on transcripts and proteins sequences
    - ClinVar variant information
    - gnomAD population frequency
    - UCSC 100 vertebrate conservation
    - semi-automated ACMG classification from InterVar
    - link-out to external resources and tools
    - query the GA4GH beacon network for the variant
    - query the VariantValidator API for the variant

- structural variant (currently copy number loss/gain only)-related functionality:
    - consequences on overlapping genes
    - information on overlapping structural variants in ClinVar
    - semi-automated ACMG classification from AutoCNV
    - link-out to external resources and tools
    - integrated genome browser with useful tracks for interpreting the variant

.. toctree::
    :hidden:
    :maxdepth: 1
    :caption: User's Manual

    doc_quickstart
    doc_tutorial
    doc_queries
    doc_urls
    doc_manual
    doc_clinvarsub

.. toctree::
    :hidden:
    :maxdepth: 1
    :caption: Contents

    acmg_seqvars_criteria
    acmg_seqvars_details
    acmg_cnvs_criteria
    acmg_cnvs_details

.. toctree::
    :hidden:
    :maxdepth: 1
    :caption: Developer's Manual

    dev_quickstart
    dev_makefiles
    dev_frontend
    dev_backend
    dev_ci
    dev_deployment
    dev_docs
    dev_tests
    dev_tf

.. toctree::
    :hidden:
    :maxdepth: 1
    :caption: API Documentation

    api_models
    api_api_v1
    api_internal
