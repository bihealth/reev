.. _doc_manual:

======
Manual
======

This section describes the data display in detail.

.. _doc_manual_gene:

-----
Genes
-----

.. _doc_manual_gene_basic_info:

Basic information
=================

.. _doc_manual_gene_pathogenicity:

This card shows the basic information for a gene such as its symbol, name, and a short summary that we took from the NCBI gene overview.
At the bottom of the card, you can find link-outs to other websites describing the gene, such as searching pubmed, ENSEMBK, NCBI, UniProt and MGI. At the very right of this link-outs you find a link to REEV's gene detail view (detailed view of a gene's properties without any specific variant information).

Note that you can also click on "More" on the lower right of the card to show additional information on the gene:

- Alternative identifiers with link-outs, e.g., to ENSEMBL, or RefSeq.
- Further external resources such as DECIPHER, OMIM, etc.
- Link-outs to locus specific databases if available for the respective gene of interest, e.g. LOVD, NIH-BIC database (for BRCA1/2 variants), Leiden Muscular Dystrophy pages (for TTN variants), etc.
- NCBI GeneRIFs

Gene Pathogenicity
==================

.. _doc_manual_gene_conditions:

This card shows the avaible gene pathogenicity scores for a gene such as:
- ClinGen haploinsufficiency and triplosensitivity scores
- gnomAD pLI and LOEUF scores (for loss of function variants) and Z-score (for missense variants)
- DECIPHER haploinsufficiency and triplosensitivity scores as well as sHet (Selection coefficient of heterozygous loss-of-function variants) scores

Associated Conditions
=====================

.. _doc_manual_gene_expression:

This card shows the avaible information on the phenotypes associated to the respective gene as HPO terms and known OMIM phenotypes. Note than you can use the button "numeric terms" in the lower left corner to show or hide the corresponding numeric HPO term and OMIM phenotype IDs; with the button "show links" right next you can activate and deactivate the corresponding link-outs of the displayed HPO terms and OMIM phenotypes.
At the bottom of the card you can also find more link-outs to further websites with gene-phenotype information, such as JAX and Orphanet.
Note that you can also use the "More" button on the lower right of the card to show associated Orphanet disorders and their respective link-outs.

If you have logged in and provided case specific phenotype information with HPO terms you can find the gene-to-phenotype rank (i.e. how well your case's HPO terms fit the gene's associated HPO terms) in the grey box on the right.

Expression
==========

.. _doc_manual_gene_clinvar_information:

This card shows the tissue specific information for a gene as provided by GTEX. Below the plot you also find the corresponding link-out to the GTEX portal. 
Note that you can also use the little "..." button in the upper right corner of the plot to
- save the plot as .svg or .png
- view the corresponding vega source code and open in vega editor

ClinVar Information
===================

.. _doc_manual_gene_impact_counts:

Impact Counts
-------------

.. _doc_manual_gene_impact_frequency:

Impact / Frequency
------------------

.. _doc_manual_gene_variation_landscape:

Variation Landscape
-------------------

.. _doc_manual_seqvar:

-----------------
Sequence Variants
-----------------

.. _doc_manual_seqvar_clinical_significance:

Clinical Significance
=====================

.. _doc_manual_seqvar_consequences:

This card shows the semi-automated pathogenicity prediction based on InterVar. 
Using the buttons on the left you can...
- hide/show the terse mode of ACMG criteria display. On show this will provide you an overview of just the different criteria and their evidence level, on hide you will see the full display also providing a description on every ACMG criterion and how it should be used.
- hide/show failed criteria (not set to "active" by the little switch displayed left to every criterion)

Tipp: you can also see are brief description of every ACMG criterion in the terse mode when moving your curser of the little "i" in the upper right corner of every ACMG criterion box.

On default you will see the automated selection of ACMG criteria. You can individually select and deselect every ACMG criterion using the little switch displayed left to every criterion and also select the respective level of evidence (very strong, strong, moderate, supporting) using the button below the respective ACMG criterion.

Note that you can also clear all selected ACMG criteria or reset them to auto using the respective buttons below the pathogenicity prediction box on the top of the card. Here, you can also find a link-out to the detailed REEV documentation on ACMG criteria.

@Manuel: need your help: ?? Finally, you can save your ACMG rating, load a preexisting one or delete it from the server ??

Consequences
============

.. _doc_manual_seqvar_clinvar:

ClinVar
=======

.. _doc_manual_seqvar_scores:

Scores
======

.. _doc_manual_seqvar_population_frequencies:

Population Frequencies
======================

.. _doc_manual_seqvar_variant_tools:

Variant Tools
=============

.. _doc_manual_seqvar_beacon_network:

Beacon Network
==============

.. _doc_manual_seqvar_variant_validator:

Variant Validator
=================

.. _doc_manual_strucvar:

-------------------
Structural Variants
-------------------

Gene List
=========

...

For the currently selected gene, the information described in the section :ref:`doc_manual_gene` is displayed.

.. _doc_manual_strucvar_clinvar:

ClinVar
=======

.. _doc_manual_strucvar_variant_tools:

Variant Tools
=============

.. _doc_manual_strucvar_clinical_significance:

Clinical Significance
=====================

.. _doc_manual_strucvar_genome_browser:

Genome Browser
==============
