.. _acmg_seqvars_rules:

===========================
ACMG Sequence Variant Rules
===========================

This section describes the rules implemented for the automated classification of ACMG sequence variants.

.. _acmg_seqvars_rules-inheritance:

-------------------
Mode of Inheritance
-------------------

The mode of inheritance for a is derived from the following list of sources.
The sources are iterated in the order given below and the first one with a match is used for deriving mode of inheritance.

1. **NHGRI CGD**
   The `National Human Genome Research Institute Clinical Genomic Database <https://research.nhgri.nih.gov/CGD/>`__
2. **ClinGen Disease Validity** `Website <https://clinicalgenome.org/curation-activities/gene-disease-validity/>`__
3. **EBI gene2phenotype** `Website <https://www.ebi.ac.uk/gene2phenotype>`__
4. **ClinGen GenCC** `Website <https://thegencc.org/>`__
5. **Genomics England PanelApp** `Web-App <https://panelapp.genomicsengland.co.uk/>`__
6. **Domino** is a machine learning method for prediction of mode of inheritance and described in `PMID:28985496 <https://pubmed.ncbi.nlm.nih.gov/28985496/>`__.
   We use the thresholds from `PMID:30376034 <https://pubmed.ncbi.nlm.nih.gov/30376034/>`__.

   - dominant: if score >= 0.5934
   - recessive: if score <= 0.3422
   - dominant/recessive: if score is between 0.3422 and 0.5934

.. _acmg_seqvars_rules-inheritance-literature:

Literature
==========

- DiStefano MT, Goehringer S, Babb L, Alkuraya FS, Amberger J, Amin M, Austin-Tse C, Balzotti M, Berg JS, Birney E, Bocchini C.
  *The gene curation coalition: a global effort to harmonize gene-disease evidence resources.*
  Genetics in Medicine. 2022 Aug 1;24(8):1732-42.
- Thormann A, Halachev M, McLaren W, Moore DJ, Svinti V, Campbell A, Kerr SM, Tischkowitz M, Hunt SE, Dunlop MG, Hurles ME.
  *Flexible and scalable diagnostic filtering of genomic variants using G2P with Ensembl VEP. Nature communications.*
  2019 May 30;10(1):2373.
- Martin AR, Williams E, Foulger RE, Leigh S, Daugherty LC, Niblock O, Leong IU, Smith KR, Gerasimenko O, Haraldsdottir E, Thomas E.
  *PanelApp crowdsources expert knowledge to establish consensus diagnostic gene panels.*
  Nature genetics. 2019 Nov;51(11):1560-5.
- Quinodoz M, Royer-Bertrand B, Cisarova K, Di Gioia SA, Superti-Furga A, Rivolta C.
  *DOMINO: using machine learning to predict genes associated with dominant disorders.*
  The American Journal of Human Genetics. 2017 Oct 5;101(4):623-9.
- Kopanos C, Tsiolkas V, Kouris A, Chapple CE, Aguilera MA, Meyer R, Massouras A.
  *VarSome: the human genomic variant search engine.*
  Bioinformatics. 2019 Jun 6;35(11):1978.

.. _acmg_seqvars_rules-frequency:

----------------
Allele Frequency
----------------

.. note::

    We are still lacking coverage data.

The databases gnomAD exomes and genomes will be used to derived allele frequencies.
Both coverage and frequency data are used for quality control of this data.
Frequencies are considered valid if (the thresholds from `PMID:30376034 <https://pubmed.ncbi.nlm.nih.gov/30376034/>`__):

- coverage is >=20
- allele number is >=2000
- gnomAD quality filter is PASS

The rules BA1 and BS1 will consider non-bottlenecked populations and consider whether variants are common in these populations.
The Amish (ami), Ashkenazi Jewish (asj), European Finnish (fin), Middle Eastern (mid), and "Remaining Individuals (rmi) groups" are not considered.

.. _acmg_seqvars_rules-calibration:

-----------
Calibration
-----------

We currently do not have our own calibration yet.

--------------------
Transcript Selection
--------------------

TODO:

- where available, use MANE+Clinical
- describe projection from GRCh37 to GRCh38
- otherwise, use worst case scenario

.. _acmg_seqvars_rules-patho-predictions:

-------------------------
Pathogenicity Predictions
-------------------------

We currently use the thresholds from Pejaver et al. (2022) only.

Literature
==========

- Pejaver V, Byrne AB, Feng BJ, Pagel KA, Mooney SD, Karchin R, O'Donnell-Luria A, Harrison SM, Tavtigian SV, Greenblatt MS, Biesecker LG, Radivojac P, Brenner SE; ClinGen Sequence Variant Interpretation Working Group.
  *Calibration of computational tools for missense variant pathogenicity classification and ClinGen recommendations for PP3/BP4 criteria.*
  Am J Hum Genet. 2022 Dec 1;109(12):2163-2177. doi: 10.1016/j.ajhg.2022.10.013. Epub 2022 Nov 21. PMID: 36413997; PMCID: PMC9748256.

.. _acmg_seqvars_rules-rules:

-----
Rules
-----

.. _acmg_seqvars_rules-pvs1:

PVS1 (null variant)
===================

Original Definition
-------------------

    Null variant (nonsense, frameshift, canonical +/-1 or 2 splice sites, initiation codon, single or multi-exon deletion) in a gene where loss of function (LOF) is a known mechanism of disease.

    Caveats:

    - Beware of genes where LOF is not a known disease mechanism (e.g. GFAP, MYH7)
    - Use caution interpreting LOF variants at the extreme 3' end of a gene
    - Use caution with splice variants that are predicted to lead to exon skipping but leave the remainder of the protein intact
    - Use caution in the presence of multiple transcripts

    -- Richards et al. (2015); Table 4

Preconditions / Precomputations
-------------------------------

- The rule establishes whether LoF is a known mechanism of disease:
    - If at least 2 LoF variants are reported in ClinVar with two or more stars then this rule is triggered.
    - If the gnomAD LOF Observed/Expected is less than 0.7555 then this rule is triggered.
- Rule rule establishes whether a stop_gain variant introduced nonsense mediated decay (NMD) consistent with Abou Youn et al. (2018) and the VEP NMD plugin.
    - If the variant is on chrMT then it cannot be NMD.
    - If the variant is not_stop gain then then it cannot be NMD, else:
    - If the variant is in the last exon of the transcript then it is predicted to escape NMD.
    - If the variant falls 50bp upstream of the penuultimate (second to the last) exon then it is predicted to escape NMD.
    - If the variant falls int the first 100 coding bases in teh transcript then it is predicted to escape NMD.
    - If the variant is in an intronless transcript, meaning only one exon exists in the transcript, then it is predicted to escape NMD.
    - Else, the variant is predicted to be NMD.
- The MANE and MANE+Clinical transcripts are used for "biologically relevant transcripts" in this rule.

Implemented Rule
----------------

TODO: full specification

Literature
----------

- Richards et al. (2015) describes the original rule.
- Abou Tayoun et al. (2018) describe refined rules for PVS1.
- McCormick et al. (2020) describe the ACMG rules for chrMT variants.
- The following are from the VEP NMD plugin:
    - Identifying Genes Whose Mutant Transcripts Cause Dominant Disease Traits by Potential Gain-of-Function Alleles (Coban-Akdemir, 2018)
    - The rules and impact of nonsense-mediated mRNA decay in human cancers (Lindeboom, 2016)


Caveats
-------

- This is currently not implementing the full rule set from Abou Tayoun et al. (2018).
- We currently use the threshold from `PMID:30376034 <https://pubmed.ncbi.nlm.nih.gov/30376034/>`__ and are lacking our own calibration.

Notes
-----

- If this rule is triggered then PP3 and PM4 will be disabled.

.. _acmg_seqvars_rules-ps1:

PS1 (same amino acid)
=====================

Original Definition
-------------------

    Same amino acid change as a previously established pathogenic variant regardless of nucleotide change.

    Caveat: Beware of changes that impact splicing rather than at the amino acid/protein level.

    -- Richards et al. (2015); Table 4

Preconditions / Precomputations
-------------------------------

- If the variant is not a missense variant then this rule is skipped.

Implemented Rule
----------------

- Consider all equivalent missense variants in ClinVar.
- If at least one of the variant then this rule is triggered.
    - If the variant has zero stars in ClinVar then we report PS1_Supporting only
    - If the variant has only one star in ClinVar then we report PS1_Moderate only
    - If the variant has two stars in ClinVar then we report PS1
    - If the variant has three stars or above in ClinVar then we report PS1_VeryStrong

Literature
----------

N/A

Caveats
-------

- The wording of "established pathogenic" variant is not clear so we use any reported ClinVar variant and report the ClinVar accessions for further confirmation by the user.
- Note that this also depends on disease match which the user must confirm manually.

.. _acmg_seqvars_rules-ps2:

PS2 (confirmed *de novo*)
=========================

No automation has been implemented.

Original Definition
-------------------

    De novo (both maternity and paternity confirmed) in a patient with the disease and no family history

    Note: Confirmation of paternity only is insufficient.
    Egg donation, surrogate motherhood, errors in embryo transfer, etc. can contribute to non-maternity.

    -- Richards et al. (2015); Table 4

.. _acmg_seqvars_rules-ps3:

PS3 (functional studies)
========================

No automation has been implemented.

Original Definition
-------------------

    Well-established in vitro or in vivo functional studies supportive of a damaging effect on the gene or gene product.

    Note: Functional studies that have been validated and shown to be reproducible and robust in a clinical diagnostic laboratory setting are considered the most well-established.

    -- Richards et al. (2015); Table 4

.. _acmg_seqvars_rules-ps4:

PS4 (prevalence)
================

No automation has been implemented.

Original Definition
-------------------

    The prevalence of the variant in affected individuals is significantly increased compared to the prevalence in controls

    Note 1: Relative risk (RR) or odds ratio (OR), as obtained from case-control studies, is >5.0 and the confidence interval around the estimate of RR or OR does not include 1.0. See manuscript for detailed guidance.

	Note 2: In instances of very rare variants where case-control studies may not reach statistical significance, the prior observation of the variant in multiple unrelated patients with the same phenotype, and its absence in controls, may be used as moderate level of evidence.

    -- Richards et al. (2015); Table 4

.. _acmg_seqvars_rules-pm1:

PM1 (hotspot)
=============

.. note::

    - We currently do not have proper UniProt annotations.
    - Can / should we upgrade to strong?

Original Definition
-------------------

    Located in a mutational hot spot and/or critical and well-established functional domain (e.g. active site of an enzyme) without benign variation.

    -- Richards et al. (2015); Table 4

Preconditions / Precomputations
-------------------------------

- If the variant is on chrMT then this rule is skipped according to McCormick et al. (2020).

Implemented Rule
----------------

- If the variant is within a hotspot (at least 4 pathogenic missense/in-frame variants within 25bp radius) then this rule is triggered.
- If the variant is within an annotated UniProt domain and the domain contains at least 2 pathogenic variants then this rule is triggered.

Literature
----------

- McCormick et al. (2020) describe the ACMG rules for chrMT variants.

Caveats
-------

- We currently use the threshold from `PMID:30376034 <https://pubmed.ncbi.nlm.nih.gov/30376034/>`__ and are lacking our own calibration.

.. _acmg_seqvars_rules-pm3:

PM3 (recessive in *trans*)
==========================

No automation has been implemented.

Original Definition
-------------------

    For recessive disorders, detected in trans with a pathogenic variant.

	Note: This requires testing of parents (or offspring) to determine phase.

    -- Richards et al. (2015); Table 4

.. _acmg_seqvars_rules-pm4:

PM4 (protein length)
====================

Original Definition
-------------------

    Protein length changes due to in-frame deletions/insertions in a non-repeat region or stop-loss variants.

    -- Richards et al. (2015); Table 4

Preconditions / Precomputations
-------------------------------

- If PVS1 was triggered then this rule is skipped to avoid double counting.
- If the variant is not an in-frame indel and not a stop-loss variant then this rule is skipped.

Implemented Rule
----------------

- If the variant is an in-frame indel
    - If the variant is inside a repeat masked region then it is skipped
    - If the variant is inside a repeat as annotated by UniProt then it is skipped
    - Otherwise, this rule is triggered.
- If the variant is a stop-loss variant then this rule is triggered.

Literature
----------

N/A

Caveats
-------

- Richards et al. (2015) state that the size of the indel and amount of change in amino acids should influence the classification.
  We currently do not have this implemented.

.. _acmg_seqvars_rules-pm5:

PM5 (overlapping missense)
==========================

Original Definition
-------------------

    Novel missense change at an amino acid residue where a different missense change determined to be pathogenic has been seen before.

    Caveat: Beware of changes that impact splicing rather than at the amino acid/protein level.

    -- Richards et al. (2015); Table 4

Preconditions / Precomputations
-------------------------------

- If the variant is on a nuclear chromosome
    - If it is not a missense variant then this rule is skipped.
- If the variant is on chrMT and not missense and not on a tRNA gene then this rule is skipped.

Implemented Rule
----------------

- If the variant is on a nuclear chromosome:
    - If the variant is at the same position as a pathogenic missense variant then this rule is triggered.
- If the variant is on chrMT:
    - If the variant is a missense variant and at the same position as a pathogenic one then the rule is triggered.
    - If the variant is on a tRNA gene and at the same position as a pathogenic one then the rule is triggered as PM5_Supporting.

Literature
----------

- Richards et al. (2018) describes the rule for nuclear chromosomes.
- McCormick et al. (2020) describes the rule for chrMT.

Caveats
-------

N/A

.. _acmg_seqvars_rules-pm6:

PM6 (assumed *de novo*)
=======================

No automation has been implemented.

Original Definition
-------------------

    Assumed de novo, but without confirmation of paternity and maternity.

    -- Richards et al. (2015); Table 4

.. _acmg_seqvars_rules-pm2:

PM2_Supporting (absent from controls)
=====================================

Original Definition
-------------------

    Absent from controls (or at extremely low frequency if recessive) in Exome Sequencing Project, 1000 Genomes or ExAC.

    -- Richards et al. (2015); Table 4

Preconditions / Precomputations
-------------------------------

- Determine :ref:`acmg_seqvars_rules-inheritance` for the gene.
- Determine :ref:`acmg_seqvars_rules-frequency`.
- If the allele frequency is invalid then this rule is skipped.

Implemented Rule
----------------

- If the variant is on a nuclear chromosome:
    - If the gene is marked as recessive or X-linked:
        - If the variant allele count is <=4 then this rule is triggered.
    - If the gene is marked as dominant:
        - If the homozygous allele count is <=1 then this rule is triggered.
        - If the allele frequency is less than 0.0001 then this rule is triggered.
- If the variant is on chrMT:
    If the variant frequency is below 0.00002=0.002%=1/50,000 then this rule is triggered.

Literature
----------

- Richards et al. (2015) describes the original rule.
- ClinGen Sequence Variant Interpretation Work Group (2020): SVI Recommendation for Absence/Rarity (PM2) - Version 1.0 describes the downgrade to supporting.
- McCormick et al. (2020) describe the ACMG rules for chrMT variants.

Caveats
-------

- We currently use the threshold from `PMID:30376034 <https://pubmed.ncbi.nlm.nih.gov/30376034/>`__ and are lacking our own calibration.
- This rule has been downgraded by default to supporting from strong in accordance to ClinGen Sequence Variant Interpretation Work Group (2020): *SVI Recommendation for Absence/Rarity (PM2) - Version 1.0*

.. _acmg_seqvars_rules-pp1:

PP1 (cosegregation)
===================

No automation has been implemented.

PP2 (missense)
==============

Original Definition
-------------------

    Missense variant in a gene that has a low rate of benign missense variation and where missense variants are a common mechanism of disease.

    -- Richards et al. (2015); Table 4

Preconditions / Precomputations
-------------------------------

- If the variant is on chrMT then this rule is skipped according to McCormick et al. (2020).
- If the variant is not a missense variant then this rule is skipped.

Implemented Rule
----------------

- If the ratio of pathogenic missense variants over all non-VUS missense variants is greater than 0.808 then this rule is triggered.

Literature
----------

- McCormick et al. (2020) describe the ACMG rules for chrMT variants.

Caveats
-------

- We currently use the threshold from `PMID:30376034 <https://pubmed.ncbi.nlm.nih.gov/30376034/>`__ and are lacking our own calibration.

Notes
-----

- This rule is similar to :ref:`acmg_seqvars_rules-bp1`

.. _acmg_seqvars_rules-pp3:

PP3 (*in silico* predictions)
=============================

Original Definition
-------------------

    Multiple lines of computational evidence support a deleterious effect on the gene or gene product (conservation, evolutionary, splicing impact, etc).

    Caveats:

    - As many in silico algorithms use the same or very similar input for their predictions, each algorithm should not be counted as an independent criterion.
    - PP3 can be used only once in any evaluation of a variant.

    -- Richards et al. (2015); Table 4

Preconditions / Precomputations
-------------------------------

- If the rule PVS1 was triggered then this rule is skipped.
- If the variant is on chrMT then it is skipped, as we don't have calibration for chrMT yet.
- If the variant is not found in dbNSFP or CADD precomputed scores then it is skipped as we don't have calibration for chrMT yet.

Implemented Rule
----------------

An initial prediction is fist done using the general purpose pathogenicity predictors.

- If we have a score from the following, then the prediction is used (in descending order of priority):
    - REVEL, MutPred2, CADD, BayesDel, VEST4, ..., PhyloP
    - we will use the modifiers from Pejaver et al. (2022)
- If predictions are missing then then PhyloP of the position of the variant is used as a fallback.

Then, for splicing the following is done.

- If a SpliceAI prediction is performed then it is interpreted according to Walker et al. (2023).

The highest-scoring variant is used for the final prediction.


Literature
----------

- Pejaver et al. (2022) has our thresholds for general variants
- Walker et al. (2023) has the threshold for splicing

Caveats
-------

- As described in :ref:`acmg_seqvars_rules-patho-predictions`, we are currently limited to the precomputed threshold from the literature.
  This hinders us in adopting AlphaMissense effectively, for example.
- We need to compute accuracy to rank the implemented methods.
- We need our own calibration for chrMT.

Notes
-----

- This rule is similar to :ref:`acmg_seqvars_rules-bp4`

.. _acmg_seqvars_rules-pp4:

PP4 (monogenetic)
=================

No automation has been implemented.

.. _acmg_seqvars_rules-ba1:

BA1 (5% frequency)
==================

Original Definition
-------------------

    Allele frequency is >5% in Exome Sequencing Project, 1000 Genomes Project, or Exome Aggregation Consortium

    -- Richards et al. (2015); Table 4

Preconditions / Precomputations
-------------------------------

- The variant is absent from the exception list from Ghosh et al. (2018).
  If the variant is present on this list, then this rule is skipped.

Implemented Rule
----------------

- If the variant is nuclear (not on chrMT)
    - If the allele frequency is above 0.05 in gnomAD global population then this rule is triggered.
- else (the variant is on chrMT)
    - If the allele frequency is above 0.01 in gnomAD-mtDNA global population then this rule is triggered.

Literature
----------

- Richards et al. (2015) describes the 5% allele frequency threshold.
- Ghosh et al. (2018) introduce the exception list and ClinGen maintains it.
- McCormick et al. (2020) describe the 1% allele frequency threshold as appropriate for chrMT variants.

Caveats
-------

- The exception *"However, there must be no additional conflicting evidence to support pathogenicity, such as a novel occurrence in a certain haplogroup" from McCormick et al. (2020)* is not implemented yet.

.. _acmg_seqvars_rules-bs1:

BS1 (expected frequency)
========================

Original Definition
-------------------

    Allele frequency greater than expected for disorder.

    -- Richards et al. (2015); Table 4

Preconditions / Precomputations
-------------------------------

- Determine :ref:`acmg_seqvars_rules-frequency`.
- If the allele frequency is invalid then this rule is skipped.

Implemented Rule
----------------

- If the variant is on a nuclear chromosome and the user provided a maximal credible population frequency:
    - If the FAF from gnomAD is above the maximal credible population frequency then this rule is triggered.
- If the variant is on chrMT:
    - If the population frequency is above 0.5% then this rule is triggered in accordance to McCormick et al. (2020).

Literature
----------

- Richards et al. (2015) describes the original rule without thresholds.
- Gudmundsson et al. (2022) describe the FAF threshold provided by gnomAD.
- McCormick et al. (2020) describe the ACMG rules for chrMT variants.

.. _acmg_seqvars_rules-bs2:

BS2 (healthy adult)
===================

Original Definition
-------------------

    Observed in a healthy adult individual for a recessive (homozygous), dominant (heterozygous), or X-linked (hemizygous) disorder, with full penetrance expected at an early age.

    -- Richards et al. (2015); Table 4

Preconditions / Precomputations
-------------------------------

- If the rule BA1 triggered then this rule is skipped.
- Determine :ref:`acmg_seqvars_rules-inheritance` for the gene.
- Determine :ref:`acmg_seqvars_rules-frequency`.
- If the allele frequency is invalid then this rule is skipped.
- If the rule BA1 was triggered then this rule is skipped.

Implemented Rule
----------------

- If the gene is marked as recessive or X-linked:
    - If the variant allele count is above 2 then this rule is triggered.
- If the gene is marked as dominant:
    - If the variant allele count is above 5 then this rule is triggered.

Literature
----------

- Chen et al. (2022), Karczewski et al. (2020), etc. describe gnomAD.
- The modes of inheritance for the genes are taken from different sources as described in :ref:`acmg_seqvars_rules-inheritance`.

Caveats
-------

- The conditions of "full penetrance" and "expected at an early age" need to be checked by the user.

Notes
-----

- Genes can be marked as both recessive and dominant.
- We use the thresholds from `PMID:30376034 <https://pubmed.ncbi.nlm.nih.gov/30376034/>`__.

.. _acmg_seqvars_rules-bs3:

BS3 (functional studies)
========================

No automation has been implemented.

Original Definition
-------------------

    Well-established in vitro or in vivo functional studies shows no damaging effect on protein function or splicing.

    -- Richards et al. (2015); Table 4

.. _acmg_seqvars_rules-bs4:

BS4 (lack of segregation)
=========================

No automation has been implemented.

Original Definition
-------------------

    Lack of segregation in affected members of a family

    Caveats:

    - The presence of phenocopies for common phenotypes (i.e. cancer, epilepsy) can mimic lack of segregation among affected individuals.
    - Also, families may have more than one pathogenic variant contributing to an autosomal dominant disorder, further confounding an apparent lack of segregation.

    -- Richards et al. (2015); Table 4

.. _acmg_seqvars_rules-bp1:

BP1 (missense)
==============

Original Definition
-------------------

    Missense variant in a gene for which primarily truncating variants are known to cause disease

    -- Richards et al. (2015); Table 4

Preconditions / Precomputations
-------------------------------

- If the rule BA1 triggered then this rule is skipped.
- If the variant is on chrMT then this rule is skipped according to McCormick et al. (2020).
- If the variant is not a missense variant then this rule is skipped.

Implemented Rule
----------------

- If the ratio of benign missense variants over all non-VUS missense variants is greater than 0.569 then this rule is triggered.

Literature
----------

- McCormick et al. (2020) describe the ACMG rules for chrMT variants.

Caveats
-------

- We currently use the threshold from `PMID:30376034 <https://pubmed.ncbi.nlm.nih.gov/30376034/>`__ and are lacking our own calibration.

Notes
-----

- This rule is similar to :ref:`acmg_seqvars_rules-pp2`

.. _acmg_seqvars_rules-bp2:

BP2 (recessive in *trans*)
==========================

No automation has been implemented.

Original Definition
-------------------

    Observed in trans with a pathogenic variant for a fully penetrant dominant gene/disorder; or observed in cis with a pathogenic variant in any inheritance pattern

    -- Richards et al. (2015); Table 4

.. _acmg_seqvars_rules-bp3:

BP3 (in-frame repetitive)
=========================

.. note::

    - We do not have proper Uniprot data yet (domain / repeat)
    - Similar to repeat masker.
    - Probably same for phylop100way?

Original Definition
-------------------

    In-frame deletions/insertions in a repetitive region without a known function.

    -- Richards et al. (2015); Table 4

Preconditions / Precomputations
-------------------------------

- If the rule BA1 triggered then this rule is skipped.
- If the variant is on chrMT then this rule is skipped.

Implemented Rule
----------------

- If the variant is in a known functional domain according to UniProt then this rule is skipped.
- If the variant is in a repeat region according to UniProt repeat annotation genome repeat masker then this rule is skipped.
- If the variant is in a region of low conservation (PhyloP100Way less than 3.58, same as `PMID:30376034 <https://pubmed.ncbi.nlm.nih.gov/30376034/>`__) then this rule is skipped.
- If all conditions above fail then this rule is triggered.

Literature
----------

- McCormick et al. (2020) describe the ACMG rules for chrMT variants.

Caveats
-------

- We currently use the conservation threshold from `PMID:30376034 <https://pubmed.ncbi.nlm.nih.gov/30376034/>`__ and are lacking our own calibration.
- Different from `PMID:30376034 <https://pubmed.ncbi.nlm.nih.gov/30376034/>`__, we do not check whether there are known pathogenic variants in the region.

.. _acmg_seqvars_rules-bp4:

BP4 (*in silico* predictions)
=============================

.. note::

    - we have not implemented MitoTip or MitImpact yet
    - we are lacking phylop scores yet
    - we don't have live CADD scores yet

Original Definition
-------------------

    Multiple lines of computational evidence suggest no impact on gene or gene product (conservation, evolutionary, splicing impact, etc).

    Caveat: As many in silico algorithms use the same or very similar input for their predictions, each algorithm cannot be counted as an independent criterion.
    BP4 can be used only once in any evaluation of a variant.

    -- Richards et al. (2015); Table 4

Preconditions / Precomputations
-------------------------------

- If the rule BA1 triggered then this rule is skipped.
- If the variant is on chrMT then it is skipped, as we don't have calibration for chrMT yet.
- If the variant is not found in dbNSFP or CADD precomputed scores then it is skipped as we don't have calibration for chrMT yet.

Implemented Rule
----------------

See :ref:`acmg_seqvars_rules-pp3` for details.

Literature
----------

See :ref:`acmg_seqvars_rules-pp3` for details.

Caveats
-------

See :ref:`acmg_seqvars_rules-pp3` for details.

Notes
-----

- This rule is similar to :ref:`acmg_seqvars_rules-pp3`

.. _acmg_seqvars_rules-bp5:

BP5 (found in solved)
=====================

No automation has been implemented.

Original Definition
-------------------

    Variant found in a case with an alternate molecular basis for disease.

    -- Richards et al. (2015); Table 4

.. _acmg_seqvars_rules-bp7:

BP7 (synonymous)
================

Original Definition
-------------------

    A synonymous (silent) variant for which splicing prediction algorithms predict no impact to the splice consensus sequence nor the creation of a new splice site AND the nucleotide is not highly conserved.

    -- Richards et al. (2015); Table 4

Preconditions / Precomputations
-------------------------------

- If the variant is on chrMT then this rule is skipped according to McCormick et al. (2020).

Implemented Rule
----------------

- If there is a pathogenic variant +/- 2bp of the position in ClinVar then the rule is skipped.
- If the variant is closer than 2bp to a splice site then the rule is skipped.
- If the variant is not predicted to alter the splice site using SpliceAI then the rule is triggered.

Literature
----------

- McCormick et al. (2020) describe the ACMG rules for chrMT variants.

Caveats
-------

N/A

Notes
-----

- We use the thresholds from `PMID:30376034 <https://pubmed.ncbi.nlm.nih.gov/30376034/>`__.
