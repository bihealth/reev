.. _acmg_seqvars_rules:

===========================
ACMG Sequence Variant Rules
===========================

This section describes the rules implemented for the automated classification of ACMG sequence variants.

.. _acmg_seqvars_rules-inheritance:

-------------------
Mode of Inheritance
-------------------

The mode of inheritance is derived from the following list.
The sources are iterated in the order given below and the first one with a match is used for deriving mode of inheritance.

1. **NHGRI CGD**
   The `National Human Genome Research Institute Clinical Genomic Database <https://research.nhgri.nih.gov/CGD/>`__
2. **ClinGen Disease Validity** TODO
3. **ClinGen gene2phen** TODO
4. **ClinGen GenCC** TODO
5. **Genomics England PanelApp** TODO
6. **Domino** is a machine learning method for prediction of mode of inheritance and described in `PMID:28985496 <https://pubmed.ncbi.nlm.nih.gov/28985496/>`__.
   We use the thresholds from `PMID:30376034 <https://pubmed.ncbi.nlm.nih.gov/30376034/>`__.

   - dominant: if score >= 0.5934
   - recessive: if score <= 0.3422
   - dominant/recessive: if score is between 0.3422 and 0.5934

.. _acmg_seqvars_rules-rules:

Literature
==========

TODO

-----
Rules
-----

.. _acmg_seqvars_rules-pvs1:

PVS1 (null variant)
===================

PS1 (same amino acid)
=====================

PS2 (confirmed *de novo*)
=========================

No automation has been implemented.

PS3 (functional studies)
========================

No automation has been implemented.

PS4 (prevalence)
================

No automation has been implemented.

PM1 (hotspot)
=============

PM3 (recessive in *trans*)
==========================

No automation has been implemented.

PM4 (protein length)
====================

PM5 (overlapping missense)
==========================

PM6 (assumed *de novo*)
=======================

PM2_Supporting (absent from controls)
=====================================

PP1 (cosegregation)
===================

No automation has been implemented.

PP2 (missense)
==============

PP3 (*in silico* predictions)
=============================

PP4 (monogenetic)
=================

No automation has been implemented.

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

Data Sources
------------

- gnomAD (GRCh37: v2, GRCh38: v3)

BS1 (expected frequency)
========================

No automation has been implemented (yet).

This would require the user to give a maximal credible disease frequency.

Original Definition
-------------------

    Allele frequency greater than expected for disorder.

    -- Richards et al. (2015); Table 4

BS2 (healthy adult)
===================

Original Definition
-------------------

    Observed in a healthy adult individual for a recessive (homozygous), dominant (heterozygous), or X-linked (hemizygous) disorder, with full penetrance expected at an early age.

    -- Richards et al. (2015); Table 4

Preconditions / Precomputations
-------------------------------

- Determine :ref:acmg_seqvars_rules-inheritance for the gene.

Implemented Rule
----------------

TODO

Literature
----------

TODO

Caveats
-------

- The conditions of "full penetrance" and "expected at an early age" need to be checked by the user.

BS3 (functional studies)
========================

No automation has been implemented.

BS4 (lack of segregation)
=========================

No automation has been implemented.

BP1 (missense)
==============

BP2 (recessive in *trans*)
==========================

No automation has been implemented.

BP3 (in-frame repetitive)
========================

BP4 (*in silico* predictions)
=============================

BP5 (found in solved)
=====================

No automation has been implemented.

BP7 (synonymous)
================
