.. _acmg_cnvs_details:

================
AMCG CNV Details
================

This section contains detailed information about the ACMG assessment criteria for CNVs.

.. _acmg_cnvs_details-data:

----
Data
----

The following data is used for the classification:

.. list-table:: Tools and datasources used

    * - Data
      - Datasource
    * - Gene Transcripts
      - RefSeq / ENSEMBL
    * - Pathogenic / Benign Regions
      - ClinVar SVs
    * - Population Variants
      - gnomAD SVs, dbVar
    * - Disease Gene Annotation
      - NCBI MedGen mim2gene
    * - HI/TS Regions
      - ClinGen Curation

.. _acmg_cnvs_details-references:

----------
References
----------

Literature with direct ACMG / ACGS / ClinGen relationship

- Riggs ER, Andersen EF, Cherry AM, Kantarci S, Kearney H, Patel A, Raca G, Ritter DI, South ST, Thorland EC, Pineda-Alvarez D, Aradhya S, Martin CL.
  *Technical standards for the interpretation and reporting of constitutional copy-number variants: a joint consensus recommendation of the American College of Medical Genetics and Genomics (ACMG) and the Clinical Genome Resource (ClinGen).*
  Genet Med. 2020 Feb;22(2):245-257. doi: 10.1038/s41436-019-0686-8. Epub 2019 Nov 6. Erratum in: Genet Med. 2021 Nov;23(11):2230. PMID: 31690835; PMCID: PMC7313390.

Further Supporting Literature

- Gurbich TA, Ilinsky VV.
  *ClassifyCNV: a tool for clinical annotation of copy-number variants.*
  Sci Rep. 2020 Nov 23;10(1):20375. doi: 10.1038/s41598-020-76425-3. PMID: 33230148; PMCID: PMC7683568.
- Fan C, Wang Z, Sun Y, Sun J, Liu X, Kang L, Xu Y, Yang M, Dai W, Song L, Wei X, Xiang J, Huang H, Zhou M, Zeng F, Huang L, Xu Z, Peng Z.
  AutoCNV: a semiautomatic CNV interpretation system based on the 2019 ACMG/ClinGen Technical Standards for CNVs.
  BMC Genomics. 2021 Oct 6;22(1):721. doi: 10.1186/s12864-021-08011-4. PMID: 34615484; PMCID: PMC8496072.
- Danis D, Jacobsen JOB, Balachandran P, Zhu Q, Yilmaz F, Reese J, Haimel M, Lyon GJ, Helbig I, Mungall CJ, Beck CR, Lee C, Smedley D, Robinson PN.
  *SvAnna: efficient and accurate pathogenicity prediction of coding and regulatory structural variants in long-read genome sequencing.*
  Genome Med. 2022 Apr 28;14(1):44. doi: 10.1186/s13073-022-01046-6. PMID: 35484572; PMCID: PMC9047340.

----------------
Score Evaluation
----------------

.. list-table::

    * - Level
      - Range
    * - Pathogenic
      - >=0.99
    * - Likely Pathogenic
      - >=0.90, <0.99
    * - Variant of Uncertain Significance
      - >=-0.89, <0.89
    * - Likely Benign
      - >=-0.99, <-0.89
    * - Benign
      - <= -1.00

.. _acmg_cnvs_details-loss:

----------------
Copy Number Loss
----------------

.. _acmg_cnvs_details-loss-1:

Section 1: Genomic Content
==========================

.. _acmg_cnvs_details-loss-2:

- Evidence type: Copy number loss content

Subsections

- 1A. Contains protein-coding or other known functionally important elements
- 1B. Does NOT contain protein-coding or any known functionally important elements

Section 2: Overlapping Genes or Regions
=======================================

(Skip to Section 3 if your copy number loss DOES NOT overlap these types of genes/regions)

- 2A-E: Overlap with ESTABLISHED HI genes or genomic regions and consideration of reason for referral

    - 2A. Complete overlap of an established HI gene/genomic region
    - 2B. Partial overlap of an established HI genomic region

      - The observed CNV does NOT contain the known causative gene or critical region for this established HI genomic region OR
      - Unclear if known causative gene or critical region is affected OR
      - No specific causative gene or critical region has been established for this HI genomic region

    - 2C. Partial overlap with the 5' end of an established HI gene (3' end of the gene not involved)…

        - 2C-1. …and coding sequence is involved
        - 2C-2. …and only the 5' UTR is involved

    - 2D. Partial overlap with the 3' end of an established HI gene (5' end of the gene not involved) …

        - 2D-1 …and only the 3' untranslated region is involved.
        - 2D-2. …and only the last exon is involved.
          Other established pathogenic variants have been reported in this exon.
        - 2D-3. …and only the last exon is involved.
          No other established pathogenic variants have been reported in this exon.
        - 2D-4. …and it includes other exons in addition to the last exon.
          Nonsense-mediated decay is expected to occur.

    - 2E. Both breakpoints are within the same gene (intragenic CNV; gene-level sequence variant)

- 2F-G: Overlap with ESTABLISHED benign genes or genomic regions

    - 2F. Completely contained within an established benign CNV region
    - 2G. Overlaps an established benign CNV, but includes additional genomic material

- 2H: Haploinsufficiency Predictors

    - 2H. Two or more HI predictors suggest that AT LEAST ONE gene in the interval is haploinsufficient (HI)

.. _acmg_cnvs_details-loss-3:

Section 3: Evaluation of Gene Number
====================================

- Evidence type: Number of protein-coding RefSeq genes wholly or partially included in the copy number loss

Subsections:

- 3A. 0-24 genes
- 3B. 25-34 genes
- 3C. 35+ genes

.. _acmg_cnvs_details-loss-4:

Section 4: Evaluation of Case Data
==================================

- 4A-C: Individual case evidence - de novo occurrences.

  Reported proband (from literature, public databases, or internal lab data) has either:

    - A complete deletion of or a LOF variant within gene encompassed by the observed copy number loss OR
    - an overlapping copy number loss similar in genomic content to the observed copy number loss AND…

  Subsections:

    - 4A. …the reported phenotype is highly specific and relatively unique to the gene or genomic region
    - 4B. …the reported phenotype is consistent with the gene/genomic region, is highly specific, but not necessarily unique to the gene/genomic region
    - 4C. …the reported phenotype is consistent with the gene/genomic region, but not highly specific and/or with high genetic heterogeneity

- 4D: Individual case evidence - inconsistent phenotype

    - 4D.…the reported phenotype is NOT consistent with what is expected for the gene/genomic region or not consistent in general

- 4E: Individual case evidence - unknown inheritance

    - 4E. Reported proband has a highly specific phenotype consistent with the gene/genomic region, but the inheritance of the variant is unknown.

- 4F-H: Individual case evidence - segregation among similarly affected family members

    - 4F. 3-4 observed segregations
    - 4G. 5-6 observed segregations
    - 4H. 7 or more observed segregations

- 4I-K: Individual case evidence - Non-Segregations

    - 4I. Variant is NOT found in another individual in the proband's family AFFECTED with a consistent, specific, well-defined phenotype (no known phenocopies)
    - 4J. Variant IS found in another individual in the proband's family UNAFFECTED with the specific, well-defined phenotype observed in the proband
    - 4K. Variant IS found in another individual in the proband's family UNAFFECTED with the non-specific phenotype observed in the proband

- 4L-O: Case-control and population evidence

    - 4L. Statistically significant increase amongst observations in cases (with a consistent, specific, well-defined phenotype) compared to controls
    - 4M. Statistically significant increase amongst observations in cases (without a consistent, non-specific phenotype OR unknown phenotype) compared to controls
    - 4N. No statistically significant difference between observations in cases and controls
    - 4O. Overlap with common population variation

.. _acmg_cnvs_details-loss-5:

Section 5: Inheritance / Family History
=======================================

- 5A: Observed copy number loss is DE NOVO

    - 5A. Use appropriate category from de novo scoring section in Section 4.

- 5D: Observed copy number loss is INHERITED

    - 5B. Patient with specific, well-defined phenotype and no family history.
      CNV is inherited from an apparently unaffected parent.
    - 5C. Patient with non-specific phenotype and no family history.
      CNV is inherited from an apparently unaffected parent.
    - 5D. CNV segregates with a consistent phenotype observed in the patient's family.

- 5E: Observed copy number loss - NON-SEGREGATIONS

    - 5E. Use appropriate category from non-segregation section in Section 4.

- 5F-H: Other

    - 5F. Inheritance information is unavailable or uninformative.
    - 5G. Inheritance information is unavailable or uninformative.
      The patient phenotype is non-specific, but is consistent with what has been described in similar cases.
    - 5H. Inheritance information is unavailable or uninformative.
      The patient phenotype is highly specific and consistent with what has been described in similar cases.

.. _acmg_cnvs_details-gain:

----------------
Copy Number Gain
----------------

.. _acmg_cnvs_details-gain-1:

Section 1: Genomic Content
==========================

- Evidence type: Copy Number Gain Content

Subsections:

- 1A: Contains protein-coding or other known functionally important elements
- 2B: Does NOT contain protein-coding or any known functionally important elements

.. _acmg_cnvs_details-gain-2:

Section 2: Overlapping Genes or Regions
=======================================

- 2A-B: Overlap with ESTABLISHED TS genes or genomic regions

    - 2A: Complete overlap; the TS gene or minimal critical region is fully contained within the observed copy number gain
    - 2B: artial overlap of an established TS region

        - The observed CNV does NOT contain the known causative gene or critical region for this established TS genomic region OR
        - Unclear if the known causative gene or critical region is affected OR
        - No specific causative gene or critical region has been established for this TS genomic region

- 2C-G: Overlap with ESTABLISHED benign copy number gain genes or genomic regions

- 2C: Identical in gene content to the established benign copy number gain

    - 2D: Smaller than established benign copy number gain, breakpoint(s) does not interrupt protein-coding genes
    - 2E: Smaller than established benign copy number gain, breakpoint(s) potentially interrupts protein-coding gene
    - 2F: Larger than known benign copy number gain, does not include additional protein-coding genes
    - 2G: Overlaps a benign copy number gain but includes additional genomic material

- 2H: Overlap with ESTABLISHED HI gene(s)

    - 2H: HI gene fully contained within observed copy number gain

- 2I-K: Breakpoint(s) within ESTABLISHED HI genes

    - 2I: Both breakpoints are within the same gene (gene-level sequence variant, possibly resulting in loss of function (LOF))
    - 2J: One breakpoint is within an established HI gene, patient's phenotype is either inconsistent with what is expected for LOF of that gene OR unknown
    - 2K: One breakpoint is within an established HI gene, patient's phenotype is highly specific and consistent with what is expected for LOF of that gene

- 2L: Breakpoints within other gene(s)
    - 2L: One or both breakpoints are within gene(s) of no established clinical significance

(Skip to Section 3 if your copy number loss DOES NOT overlap these types of genes/regions)

.. _acmg_cnvs_details-gain-3:

Section 3: Evaluation of Gene Number
====================================

- Evidence type: Number of protein-coding RefSeq genes wholly or partially included in the copy number gain

Subsections:

- 3A: 0-34 genes
- 3B: 35-49 genes
- 3C: 50 or more genes

.. _acmg_cnvs_details-gain-4:

Section 4: Evaluation of Case Data
==================================

- 4A-C: Individual case evidence - de novo occurrences

    - 4A. …the reported phenotype is highly specific and relatively unique to the gene or genomic region.
    - 4B. …the reported phenotype is consistent with the gene/genomic region, is highly specific, but is not necessarily unique to the gene/genomic region
    - 4C. …the reported phenotype is consistent with the gene/genomic region, but not highly specific and/or with high genetic heterogeneity

- 4D: Individual case evidence - inconsistent phenotype

    - 4D. …the reported phenotype is NOT consistent with the gene/genomic region or not consistent in general

- 4E: Individual case evidence - unknown inheritance

    - 4E. Reported proband has a highly specific phenotype consistent with the gene/genomic region, but the inheritance of the variant is unknown

- 4F-H: Individual case evidence - segregation among similarly affected family members

    - 4F. 3-4 observed segregations
    - 4G. 5-6 observed segregations
    - 4H. 7 or more observed segregations

- 4I-K: Individual case evidence - Non-Segregations

    - 4I. Variant is NOT found in another individual in the proband's family AFFECTED with a consistent, specific, well-defined phenotype (no known phenocopies)
    - 4J. Variant IS found in another individual in the proband's family UNAFFECTED with the specific, well-defined phenotype observed in the proband
    - 4K. Variant IS found in another individual in the proband's family UNAFFECTED with the non-specific phenotype observed in the proband

- 4L-O: Case-Control and Population Evidence

    - 4L. Statistically significant increase amongst observations in cases (with a consistent, specific, well-defined phenotype) compared to controls
    - 4M. Statistically significant increase amongst observations in cases (with a consistent, non-specific phenotype or unknown phenotype) compared to controls
    - 4N. No statistically significant difference between observations in cases and controls
    - 4O. Overlap with common population variation

.. _acmg_cnvs_details-gain-5:

Section 5: Inheritance / Family History
=======================================

- 5A: Observed copy number gain is DE NOVO

    - 5A. Use appropriate category from de novo scoring section in Section 4.

- 5B-D: Observed copy number gain is INHERITED

    - 5B. Patient with a specific, well-defined phenotype and no family history.
      Copy number gain is inherited from an apparently unaffected parent.
    - 5C. Patient with non-specific phenotype and no family history.
      Copy number gain is inherited from an apparently unaffected parent.
    - 5D. CNV segregates with consistent phenotype observed in the patient's family.

- 5E: Observed copy number gain - Non-SEGREGATIONS

    - 5E. Use appropriate category from non-segregation section in Section 4.

- 5F-H: Other:

    - 5F. Inheritance information is unavailable or uninformative
    - 5G. Inheritance information is unavailable or uninformative.
      The patient phenotype is non-specific, but is consistent with what has been described in similar cases.
    - 5H. Inheritance information is unavailable or uninformative.
      The patient phenotype is highly specific and consistent with what has been described in similar cases.
