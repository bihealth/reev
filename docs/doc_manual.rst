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

This card shows the basic information for a gene such as its symbol, name, and a short summary that we took from the NCBI gene overview.
At the bottom of the card, you can find link-outs to other websites describing the gene, such as searching pubmed, ENSEMBL, NCBI, UniProt and MGI.
At the very right of this link-outs you find a link to REEV's gene detail view (detailed view of a gene's properties without any specific variant information).

Note that you can also click on "More" on the lower right of the card to show additional information on the gene:

- Alternative identifiers with link-outs, e.g., to ENSEMBL, or RefSeq.
- Further external resources such as DECIPHER, OMIM, etc.
- Link-outs to locus specific databases if available for the respective gene of interest, e.g. LOVD, NIH-BIC database (for BRCA1/2 variants), Leiden Muscular Dystrophy pages (for TTN variants), etc.
- NCBI GeneRIFs


.. _doc_manual_gene_pathogenicity:

Gene Pathogenicity
==================

This card shows the avaible gene pathogenicity scores for a gene such as:
- ClinGen haploinsufficiency and triplosensitivity scores
- gnomAD pLI and LOEUF scores (for loss of function variants) and Z-score (for missense variants)
- DECIPHER haploinsufficiency and triplosensitivity scores as well as sHet (Selection coefficient of heterozygous loss-of-function variants) scores

.. _doc_manual_gene_conditions:

Associated Conditions
=====================

This card shows the avaible information on the phenotypes associated to the respective gene as HPO terms and known OMIM phenotypes.
Note than you can use the button "numeric terms" in the lower left corner to show or hide the corresponding numeric HPO term and OMIM phenotype IDs; with the button "show links" right next you can activate and deactivate the corresponding link-outs of the displayed HPO terms and OMIM phenotypes.
At the bottom of the card you can also find more link-outs to further websites with gene-phenotype information, such as JAX and Orphanet.
Note that you can also use the "More" button on the lower right of the card to show associated Orphanet disorders and their respective link-outs.

If you have logged in and provided case specific phenotype information with HPO terms you can find the gene-to-phenotype rank (i.e. how well your case's HPO terms fit the gene's associated HPO terms) in the grey box on the right.

.. _doc_manual_literature:

Literature
==========

This card displays the latest ten publications in PubMed related to this gene.
For more genes, follow the link-out to `PubTator <https://www.ncbi.nlm.nih.gov/research/pubtator3>`__.

.. _doc_manual_gene_expression:

Expression
==========

This card shows the tissue specific information for a gene as provided by GTEX. Below the plot you also find the corresponding link-out to the GTEX portal.
Note that you can also use the little "..." button in the upper right corner of the plot to

- save the plot as .svg or .png
- view the corresponding vega source code and open in vega editor

.. _doc_manual_gene_clinvar_information:

ClinVar Information
===================

This card shows aggregate variant information from ClinVar for the current gene.

.. _doc_manual_gene_impact_counts:

Impact Counts
-------------

This table gives summary counts of variants by classification and variant type as found in ClinVar.
The rows are labeled as pathogenic/likely pathogenic (row "pathogenic"), uncertain significance, and benign/likely benign (row "benign") in ClinVar for the current gene.
The columns are labeled as loss of function (Lof), missense/inframe, non-coding, and synonmous.
The marginal rows and columns contain row-/column-wise sums.

The cells have a colored background (red/gray/green in the rows pathogenic/uncertain/benign).
The color intensity is proportional to the column-wise fraction.
The maximal intensity is reached at 20% of the column counts.
For example, if there is a total of 100 variants in the LoF column, with 30 pathogenic, 60 uncertain, and 10 benign, then the color intensity will be full for pathogenic and uncertain, and be at 50% intensity for benign.

Overall, this allows you to quickly gauge the distribution of variant classifications for different variant types in ClinVar.
The mapping from variant type in ClinVar to column label is as follows:

- unknown: not shown
- stop lost: not shown
- no sequence alteration: synonymous
- synonymous variant: synonymous
- 3' UTR variant: non-coding
- 5' UTR variant: non-coding
- downstream transcript variant: non-coding
- intron variant: non-coding
- non-coding transcript variant: non-coding
- upstream transcript variant: non-coding
- inframe indel: missense/inframe
- missense variant: missense/inframe
- frameshift variant: LoF
- start lost: LoF
- stop gained: LoF
- splice acceptor variant: LoF
- splice donor variant: LoF

.. _doc_manual_gene_impact_frequency:

Impact / Frequency
------------------

This plot shows the number of variants with the coarse clinical significances pathogenic (pathogenic/likely pathogenic), uncertain significance, and benign (benign/likely benign) in ClinVar for the current gene.
These are shown in buckets of population frequency (gnomAD AF) as provided by ClinVar.
The bucket boundaries are 0.00025, 0.0005, 0.001, 0.0025, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0.

Overall, this allows you to quickly see the frequency distribution of variants in ClinVar for the current gene.

.. _doc_manual_gene_variation_landscape:

Variation Landscape
-------------------

This plot shows the distribution of pathogenic, likely pathogenic, uncertain significance, likely benign, and benign variants in ClinVar along the current gene.
The line "gene" displays the exons of the gene.
You can use this to see whether there are any hotspots of pathogenic variants in ClinVar for the current gene.

.. _doc_manual_seqvar:

-----------------
Sequence Variants
-----------------

.. _doc_manual_seqvar_clinical_significance:

Clinical Significance
=====================

This card shows the semi-automated pathogenicity prediction based on InterVar.
Using the buttons on the left you can...
- Hide/show the terse mode of ACMG criteria display.
  On show this will provide you an overview of just the different criteria and their evidence level, on hide you will see the full display also providing a description on every ACMG criterion and how it should be used.
- hide/show failed criteria (not set to "active" by the little switch displayed left to every criterion)

Tipp: you can also see are brief description of every ACMG criterion in the terse mode when moving your curser of the little "i" in the upper right corner of every ACMG criterion box.

On default you will see the automated selection of ACMG criteria. You can individually select and deselect every ACMG criterion using the little switch displayed left to every criterion and also select the respective level of evidence (very strong, strong, moderate, supporting) using the button below the respective ACMG criterion.

Note that you can also clear all selected ACMG criteria or reset them to auto using the respective buttons below the pathogenicity prediction box on the top of the card. Here, you can also find a link-out to the detailed REEV documentation on ACMG criteria.

@Manuel: need your help: ?? Finally, you can save your ACMG rating, load a preexisting one or delete it from the server ??


.. _doc_manual_seqvar_consequences:

Consequences
============

This cards shows the consequences of your variant of interest by providing information on

- the gene affected
- the different transcript variants (RefSeq)
- the respective consequence as type of the variant (missense, nonsense, frameshift, splice, etc.) and the change on cDNA an protein level in the corresponding transcript
- which of how many exons is affected by this variant in the corresponding transcript


.. _doc_manual_seqvar_clinvar:

ClinVar
=======

This card shows information on the variant available in the ClinVar database such as the annotated interpretation (benign, likely benign, uncertain significance, likely pathogenic, pathogenic), the evidence level / review status (1 to 5 stars) and a link-out to this entry in ClinVar.
Using the button in the lower right corner of the card you can expand this ClinVar information, e.g. to the associated condition linked to this variant.


.. _doc_manual_seqvar_scores:

Scores
======

This card shows a variety of precomputed sequence variant scores, e.g. CADD, PolyPhen2, SIFT, REVEL etc.
Note that REEV also provides the precomputed splice predictions scores MMSplice and SpliceAI for the assessment of potential splice site variants.
By default the most pathogenic prediction is displayed. Using the button next to the tool on the left you can also expand both predictions to all the different splice site change scores calculated (e.g. acceptor-gain, acceptor-loss, donor-gain, ...).

REEV provides not only the raw scores but also an interpretation of the respective score.
To this end, a color visualization of each score is shown with green color indicating a benign and red color indicating a pathogenic prediction.
On the right REEV provides you with the respective evidence level you can use on the ACMG PP3 criterion according to recent ClinGen recommendations by :footcite:t:`pejaver:2022` who advise that "For missense variants, to determine evidence for codes PP3 and BP4, we recommend that, for most situations, clinical laboratories use a single tool, genome-wide, that can reach the strong level of evidence for pathogenicity and moderate for benignity (BayesDel, MutPred2, REVEL, or VEST4)"
The interpretation given by REEV follows the respective thresholds for each score published in these guidelines (Table 2).

On the bottom of this card you can also find information on conservation (UCSC 100 vertebrate vonservation) for the position affected by the variant of interest.

Note, that if there are more than one transcript variant for gene, on the bottom right of this card you can choose and switch between the different transcript variants and the corresponding predictions for this respective transcript variant will be provided above.


.. _doc_manual_seqvar_population_frequencies:

Population Frequencies
======================

This card shows the variant's occurence in the control database gnomAD and also provides the respective link-out to gnomAD.

.. _doc_manual_seqvar_variant_tools:


Variant Tools
=============

This card provides useful further link-outs on variant level to the genome browesers ENSEMBL and UCSC as well as to further resources such as MutationTaster, Varsome, etc.
By clicking on the “Jump in local IGV” button on the bottom, you can also look at the variant in IGV when you have the respective bam-file opened in your local IGV.


.. _doc_manual_seqvar_beacon_network:

Beacon Network
==============

In this card you can connect to others users via the beacon network to search for your variant of interest and associated information at other sites.


.. _doc_manual_seqvar_variant_validator:

Variant Validator
=================

In this last card you can submit the variant to VariantValidator to obtain gold standard HGVS description to make short to report the variant correctly in your lab report or paper.


.. _doc_manual_strucvar:

-------------------
Structural Variants
-------------------

Gene List
=========

In this first card you find an overiew in the form of a gene list of all genes overlapping and contained in the region affected by you structural variant of interest.
In this overview you find the Gene symbol, RefSeq MANE transcript ID as well as important scores on haploinsufficiency and triplosensitivity of the respective gene (see also :ref:`doc_manual_gene`)
For the currently selected gene, the information described in the section :ref:`doc_manual_gene` is displayed.

Note, that if you investigate a larger SV affecting multiple genes, REEV can help you prioritize that larger set of genes by sorting by different criteria using the "sort by" selection box on the upper right corner of the card to sort the gene list by different (e.g. haploinsufficiency or triplosensitivity) scores.


.. _doc_manual_strucvar_clinvar:

ClinVar
=======

This card shows information on overlapping variants listed in the ClinVar database, their annotated interpretation (benign, likely benign, uncertain significance, likely pathogenic, pathogenic), the evidence level / review status (1 to 5 stars), the associated condition linked to this variant and the size of the respective overlap of this ClinVar variant with your SV of interest.
Note, that you can expand every row to show more information on the respective ClinVar variant and that you can sort the list of ClinVar variants by size of their overlap to your SV.


.. _doc_manual_strucvar_variant_tools:

Variant Tools
=============

This card provides useful further link-outs on variant level to the genome browesers ENSEMBL and UCSC as well as to further resources such as MutationTaster, Varsome, etc.
By clicking on the “Jump in local IGV” button on the bottom, you can also look at the variant in IGV when you have the respective bam-file opened in your local IGV.


.. _doc_manual_strucvar_clinical_significance:

Clinical Significance
=====================

This card shows the semi-automated pathogenicity prediction based on AutoCNV.
Using the buttons to the left of each criterion you can select or deselect every ACMG CNV criterion.
The semi-automated prediction is providing an automated scoring for criteria 1-3 while you always have to select criteria 4 and 5 manually based on your clinical information on the case.
On default you will see the automated selection of ACMG criteria.
You can individually select and deselect every ACMG CNV criterion using the little switch displayed left to every criterion and also select the individual points you score on this criterion.

To help you with your manual ACMG assessment, you find a description next to every ACMG CNV criterion and a summary of the points suggested to use for this criterion as well as the maximum score allowed for this criterion.

Note, that you can also reset all selected ACMG criteria  to auto using the respective button below the pathogenicity prediction box on the top of the card.
Here, you can also find a link-out to the detailed REEV documentation on ACMG criteria.


.. _doc_manual_strucvar_genome_browser:

Genome Browser
==============

This card provides an internal genome browser with useful tracks for interpreting the variant.
You see the genomic location of the variant along with useful tracks from UCSC (e.g. Repeat Masker), RefSeq Genes as well as gnomAD and DGV SVs, ExAC CNVs.
