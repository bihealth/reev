/**
 * This module contains the client API code for handling ClinVar submissions.
 */
import { API_V1_BASE_PREFIX } from '@/api/common'

/** Interface for reading submitting orgs. */
export interface SubmittingOrgRead {
  /** The internal UUID. */
  id: string
  /** A user-facing label. */
  label: string
  /** Timestamp of creation. */
  created: string
  /** Timestamp of last update. */
  updated: string
}

/** Interface for one page of submitting orgs. */
export interface SubmittingOrgPage {
  /** The payload. */
  items: SubmittingOrgRead[]
  /** Total number of items. */
  total: number | null
  /** Cursor for current page. */
  current_page: string | null
  /** Cursor for previous page. */
  previous_page: string | null
  /** Cursor for next page. */
  next_page: string | null
}

/** Interface for updating/creating submitting orgs. */
export interface SubmittingOrgWrite {
  /** The internal UUID (unset when creating). */
  id?: string
  /** A user-facing label. */
  label: string
  /** The token to set; optional */
  clinvar_api_token?: string
}

/** Interface for reading submission thread. */
export interface SubmissionThreadRead {
  /** The internal UUID (unset when creating). */
  id: string
  /** Submitting organisation to use for submission. */
  submittingorg_id: string
  /** Primary variant description. */
  primary_variant_desc: string
  /** Timestamp of creation. */
  created: string
  /** Timestamp of last update. */
  updated: string
  /** Effective SCV. */
  effective_scv: string | null
  /** Effective presence in ClinVar. */
  effective_presence: VariantPresence | null
  /** Desired presence in ClinVar. */
  desired_presence: VariantPresence | null
  /** Current thread status. */
  status: SubmissionThreadStatus
}

/** Interface for one page of submitting orgs. */
export interface SubmissionThreadPage {
  /** The payload. */
  items: SubmissionThreadRead[]
  /** Total number of items. */
  total: number | null
  /** Cursor for current page. */
  current_page: string | null
  /** Cursor for previous page. */
  previous_page: string | null
  /** Cursor for next page. */
  next_page: string | null
}

/** Enumeration for variant presence. */
export enum VariantPresence {
  /** The variant is present. */
  Present = 'present',
  /** The variant is absent. */
  Absent = 'absent'
}

/** Enumeration for submission thread status. */
export enum SubmissionThreadStatus {
  // Initial state while being edited by the user.
  Initial = 'initial',
  // Waiting in the queue to be picked up by the worker.
  Waiting = 'waiting',
  // At least one activity has been picked up by the worker and
  // there is at least one activity that is not complete yet.
  InProgress = 'in_progress',
  // The submission thread has been processed with final result of success.
  Success = 'success',
  // The submission thread has terminated with final result of failure.
  Error = 'error'
}

/** Interface for updating submission threads. */
export interface SubmissionThreadWrite {
  /** The internal UUID (unset when creating). */
  id?: string
  /** Effective SCV. */
  effective_scv?: string
  /** Effective presence in ClinVar. */
  effective_presence?: VariantPresence
  /** The submitting org (only when creating). */
  submitting_org_id?: string
  /** The variant description (only when creating). */
  primary_variant_desc?: string
}

/** Enum for the submission activity kind. */
export enum SubmissionActivityKind {
  /** Create a new submission. */
  Create = 'create',
  /** Retrieve the information from an ongoing submission. */
  Retrieve = 'retrieve',
  /** Update an existing submission. */
  Update = 'update',
  /** Delete an existing submission. */
  Delete = 'delete'
}

/** Enum for the submission activity status. */
export enum SubmissionActivityStatus {
  /** The submission activity is waiting to be picked up by the worker. */
  Waiting = 'waiting',
  /** The submission activity is in progress. */
  InProgress = 'in_progress',
  /** The submission activity is complete with result success. */
  CompleteSuccess = 'complete_success',
  /** The submission activity is complete with result "submission failure". */
  CompleteFailure = 'complete_failure',
  /** The submission activity is complete with result "submission in progress". */
  CompleteInProgress = 'complete_in_progress',
  /** The submission activity has failed. */
  Failed = 'failed',
  /** The submission activity has failed because of a timeout. */
  Timeout = 'timeout'
}

/** Simple error message from ClinVar. */
export interface ResponseMessage {
  /** Error message text. */
  text: string
}

/** Response for successful creation by ClinVar. */
export interface ResponseCreated {
  /** The ClinVar SCV. */
  id: string
}

export interface SubmissionStatusFile {
  url: string
}

export enum ErrorCode {
  Success = '0',
  PartialSuccess = '1',
  AllFailure = '2'
}

export interface SubmissionStatusResponseMessage {
  error_code?: ErrorCode
  severity: string
  text: string
}

export interface SubmissionStatusObjectContent {
  clinvar_processing_status: string
  clinvar_release_status: string
}

export interface SubmissionStatusObject {
  accession?: string
  content: SubmissionStatusObjectContent
  target_db: string
}

export interface SubmissionStatusResponse {
  status: string
  files: SubmissionStatusFile[]
  message?: SubmissionStatusResponseMessage
  objects: SubmissionStatusObject[]
}

/** Submission status actions. */
export interface SubmissionStatusActions {
  id: string
  response: SubmissionStatusResponse[]
  status: string
  target_db: string
  updated: string
}

/** Submission status response. */
export interface SubmissionStatus {
  /** List of actions, one element only by the docs. */
  actions: SubmissionStatusActions[]
}

export enum BatchProcessingStatus {
  InProcessing = 'In processing',
  Success = 'Success',
  Error = 'Error',
  PartialSuccess = 'Partial success'
}

export enum BatchReleaseStatus {
  Released = 'Released',
  PartialReleased = 'Partial released',
  NotReleased = 'Not released'
}

export interface SummaryResponseDeletionIdentifier {
  clinvar_accession: string
  clinvar_local_key?: string
}

export interface SummaryResponseErrorInput {
  value?: string
  field?: string
}

export interface SummaryResponseErrorOutput {
  user_message: string
}

export interface SummaryResponseError {
  input: SummaryResponseErrorInput[]
  output: SummaryResponseErrorOutput
}

export interface SummaryResponseDeletion {
  identifiers: SummaryResponseDeletionIdentifier
  processing_status: string
  delete_date?: string
  delete_status?: string
  errors?: SummaryResponseError[]
}

export interface SummaryResponseSubmissionIdentifiers {
  clinvar_local_key: string
  clinvar_accession?: string
  local_id?: string
  local_key?: string
}

export interface SummaryResponseSubmission {
  identifiers: SummaryResponseSubmissionIdentifiers
  processing_status: string
  clinvar_accession_version?: string
  errors?: SummaryResponseError[]
  release_date?: string
  release_status?: string
}

export interface SummaryResponse {
  batch_processing_status: BatchProcessingStatus
  batch_release_status: BatchReleaseStatus
  submission_date: string
  submission_name: string
  total_count: number
  total_errors: number
  total_public: number
  total_success: number
  deletions?: SummaryResponseDeletion[]
  submissions?: SummaryResponseSubmission[]
  total_delete_count?: number
  total_deleted?: number
  total_delete_errors?: number
  total_delete_success?: number
}

/** Result of a successful status retrieval. */
export interface RetrieveStatusResult {
  /** Submission status. */
  status: SubmissionStatus
  /** Summaries, by file URL. */
  summaries: { [key: string]: SummaryResponse }
}

/** Interface for reading submission activities. */
export interface SubmissionActivityRead {
  /** The internal UUID. */
  id: string
  /** The submission thread's UUID. */
  submissionthread_id: string
  /** The activity kind. */
  kind: SubmissionActivityKind
  /** The activity status. */
  status: SubmissionActivityStatus
  /** The request payload. */
  request_payload?: any
  /** Timestamp of request. */
  request_timestamp?: string
  /** The response payload. */
  response_payload?: ResponseMessage | ResponseCreated | RetrieveStatusResult
  /** Timestamp of response. */
  response_timestamp?: string
}

export enum CitationDb {
  Pubmed = 'PubMed',
  Bookshelf = 'BookShelf',
  Doi = 'DOI',
  Pmc = 'pmc'
}

export interface SubmissionAssertionCriteria {
  db?: CitationDb
  id?: string
  url?: string
}

export interface SubmissionClinvarDeletionAccessionSet {
  accession: string
  reason?: string
}

export interface SubmissionClinvarDelete {
  accession_set: SubmissionClinvarDeletionAccessionSet[]
}

export enum ClinicalSignificanceDescription {
  Pathogenic = 'Pathogenic',
  LikelyPathogenic = 'Likely pathogenic',
  UncertainSignificance = 'Uncertain significance',
  LikelyBenign = 'Likely benign',
  Benign = 'Benign',
  PathogenicLowPenetrance = 'Pathogenic, low penetrance',
  UncertainRiskAllele = 'Uncertain risk allele',
  LikelyPathogenicLowPenetrance = 'Likely pathogenic, low penetrance',
  EstablishedRiskAllele = 'Established risk allele',
  LikelyRiskAllele = 'Likely risk allele',
  Affects = 'affects',
  Association = 'association',
  DrugResponse = 'drug response',
  ConfersSensitivity = 'confers sensitivity',
  Protective = 'protective',
  Other = 'other',
  NotProvided = 'not provided'
}

export interface SubmissionCitation {
  db?: CitationDb
  id?: string
  url?: string
}

export enum ModeOfInheritance {
  AutosomalDominantInheritance = 'Autosomal dominant inheritance',
  AutosomalRecessiveInheritance = 'Autosomal recessive inheritance',
  MitochondrialInheritance = 'Mitochondrial inheritance',
  SomaticMutation = 'Somatic mutation',
  GeneticAnticipation = 'Genetic anticipation',
  Sporadic = 'Sporadic',
  SexLimitedAutosomalDominant = 'Sex-limited autosomal dominant',
  XLinkedRecessiveInheritance = 'X-linked recessive inheritance',
  XLinkedDominantInheritance = 'X-linked dominant inheritance',
  YLinkedInheritance = 'Y-linked inheritance',
  Other = 'Other',
  XLinkedInheritance = 'X-linked inheritance',
  Codominant = 'Codominant',
  SemidominantInheritance = 'Semidominant inheritance',
  AutosomalUnknown = 'Autosomal unknown',
  AutosomalDominantInheritanceWithMaternalImprinting = 'Autosomal dominant inheritance with maternal imprinting',
  AutosomalDominantInheritanceWithPaternalImprinting = 'Autosomal dominant inheritance with paternal imprinting',
  MultifactorialInheritance = 'Multifactorial inheritance',
  UnknownMechanism = 'Unknown mechanism',
  OligogenicInheritance = 'Oligogenic inheritance'
}

export interface SubmissionClinicalSignificance {
  clinical_significance_description: ClinicalSignificanceDescription
  citation?: SubmissionCitation[]
  comment?: string
  custom_assertion_score?: number
  date_last_evaluated?: string
  explanation_of_drug_response?: string
  explanation_of_other_clinical_significance?: string
  mode_of_inheritance?: ModeOfInheritance
}

export enum ConditionDb {
  Omim = 'OMIM',
  Medgen = 'MedGen',
  Orphanet = 'Orphanet',
  Mesh = 'MeSH',
  Hp = 'HP',
  Mondo = 'MONDO'
}

export interface SubmissionCondition {
  db?: ConditionDb
  id?: string
  name?: string
}

export interface SubmissionConditionSet {
  condition?: SubmissionCondition[]
  // drug_response?: SubmissionDrugResponse[]
  // multiple_condition_explanation?: MultipleConditionexplanation
}

export enum AffectedStatus {
  Yes = 'yes',
  No = 'no',
  Unknown = 'unknown',
  NotProvided = 'not provided',
  NotApplicable = 'not applicable'
}

export enum AlleleOrigin {
  Germline = 'germline',
  Somatic = 'somatic',
  DeNovo = 'de novo',
  Unknown = 'unknown',
  Inherited = 'inherited',
  Maternal = 'maternal',
  Paternal = 'paternal',
  Biparental = 'biparental',
  NotApplicable = 'not applicable'
}

export enum CollectionMethod {
  Curation = 'curation',
  LiteratureOnly = 'literature only',
  ReferencePopulation = 'reference population',
  ProviderInterpretation = 'provider interpretation',
  PhenotypingOnly = 'phenotyping only',
  CaseControl = 'case-control',
  ClinicalTesting = 'clinical testing',
  InVitro = 'in vitro',
  InVivo = 'in vivo',
  Research = 'research',
  NotProvided = 'not provided'
}

export enum ClinicalFeaturesAffectedStatus {
  Present = 'present',
  Absent = 'absent',
  NotTested = 'not tested'
}

export enum ClinicalFeaturesDb {
  Hp = 'HP'
}

export interface SubmissionClinicalFeature {
  clinical_features_affected_status: ClinicalFeaturesAffectedStatus
  db?: ClinicalFeaturesDb
  id?: string
  name?: string
}

export enum StructVarMethodType {
  SnpArray = 'SNP array',
  OligoArray = 'Oligo array',
  ReadDepth = 'Read depth',
  PairedEndMapping = 'Paired-end mapping',
  OneEndAnchoredAssembly = 'One end anchored assembly',
  SequenceAlignment = 'Sequence alignment',
  OpticalMapping = 'Optical mapping',
  CuratedPcr = 'Curated,PCR'
}

export interface SubmissionObservedIn {
  affected_status: AffectedStatus
  allele_origin: AlleleOrigin
  collection_method: CollectionMethod
  clinical_features?: SubmissionClinicalFeature[]
  clinical_features_comment?: string
  number_of_individuals?: number
  struct_var_method?: StructVarMethodType
}

export enum RecordStatus {
  Novel = 'novel',
  Update = 'update'
}

export enum Assembly {
  Grch38 = 'GRCh38',
  Hg38 = 'hg38',
  Grch37 = 'GRCh37',
  Hg19 = 'hg19',
  Ncbi36 = 'NCBI36',
  Hg18 = 'hg18'
}

export enum Chromosome {
  Chr1 = '1',
  Chr2 = '2',
  Chr3 = '3',
  Chr4 = '4',
  Chr5 = '5',
  Chr6 = '6',
  Chr7 = '7',
  Chr8 = '8',
  Chr9 = '9',
  Chr10 = '10',
  Chr11 = '11',
  Chr12 = '12',
  Chr13 = '13',
  Chr14 = '14',
  Chr15 = '15',
  Chr16 = '16',
  Chr17 = '17',
  Chr18 = '18',
  Chr19 = '19',
  Chr20 = '20',
  Chr21 = '21',
  Chr22 = '22',
  ChrX = 'X',
  ChrY = 'Y',
  ChrM = 'MT'
}

export interface SubmissionChromosomeCoordinates {
  accession?: string
  alternate_allele?: string
  assembly?: Assembly
  chromosome?: string
  inner_start?: number
  inner_stop?: number
  outer_start?: number
  outer_stop?: number
  reference_allele?: string
  start?: number
  stop?: number
  variant_length?: number
}

export interface SubmissionVariantGene {
  gene_id?: number
  gene_symbol?: string
}

export enum VariantType {
  Insertion = 'Insertion',
  Deletion = 'Deletion',
  Duplication = 'Duplication',
  TandemDuplication = 'Tandem duplication',
  CopyNumberLoss = 'copy number loss',
  CopyNumberGain = 'copy number gain',
  Inversion = 'Inversion',
  Translocation = 'Translocation',
  Complex = 'Complex'
}

export interface SubmissionVariant {
  chromosome_coordinates?: SubmissionChromosomeCoordinates
  copy_number?: string
  gene?: SubmissionVariantGene[]
  hgvs?: string
  reference_copy_number?: number
  variant_type?: VariantType
}

export interface SubmissionVariantSet {
  variant: SubmissionVariant[]
}

/**
 * ClinVar submission data.
 *
 * Note that we only added the data structures that we need to for REEV.
 */
export interface SubmissionClinvarSubmission {
  clinical_significance: SubmissionClinicalSignificance
  condition_set: SubmissionConditionSet
  observed_in: SubmissionObservedIn[]
  record_status: RecordStatus
  clinvar_accession?: string
  variant_set?: SubmissionVariantSet
}

export enum ReleaseStatus {
  Public = 'public',
  HoldUntilPublished = 'hold until published'
}

export interface SubmissionContainer {
  assertion_criteria?: SubmissionAssertionCriteria
  behalf_org_id?: number
  clinvar_deletion?: SubmissionClinvarDelete
  clinvar_submission?: SubmissionClinvarSubmission
  clinvar_submission_release_status?: ReleaseStatus
  submission_name?: string
}

/** Interface for updating submission activities. */
export interface SubmissionActivityWrite {
  /** The submission thread's UUID. */
  submissionthread_id: string
  /** The activity kind. */
  kind: SubmissionActivityKind
  /** The activity status. */
  status: SubmissionActivityStatus
  /** The request payload. */
  request_payload?: SubmissionContainer
}

export class ClinvarsubClient {
  private apiBaseUrl: string
  private csrfToken?: string

  constructor(apiBaseUrl?: string, csrfToken?: string) {
    this.apiBaseUrl = apiBaseUrl ?? API_V1_BASE_PREFIX
    this.csrfToken = csrfToken ?? undefined
  }

  /**
   * Fetch one page of submitting organizations.
   *
   * @param cursor The optional cursor to use for fetching.
   * @param pageSize The page size to use for enumerating.
   * @returns One page of submitting organizations.
   */
  async fetchSubmittingOrgs(
    cursor?: string | undefined,
    pageSize: number = 50
  ): Promise<SubmittingOrgPage> {
    let query: string
    if (cursor) {
      query = `cursor=${cursor}&size=${pageSize}`
    } else {
      query = `size=${pageSize}`
    }
    const response = await fetch(`${this.apiBaseUrl}clinvarsub/submittingorgs?${query}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    return await response.json()
  }

  /**
   * Create a new submitting organization.
   *
   * @param submittingOrg The submitting organization to create.
   * @returns The created submitting organization.
   */
  async createSubmittingOrg(submittingOrg: SubmittingOrgWrite): Promise<SubmittingOrgRead> {
    const response = await fetch(`${this.apiBaseUrl}clinvarsub/submittingorgs`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(submittingOrg)
    })
    return await response.json()
  }

  /**
   * Update a submitting organization.
   *
   * @param submittingOrg The submitting organization to update.
   * @returns The updated submitting organization.
   */
  async updateSubmittingOrg(submittingOrg: SubmittingOrgWrite): Promise<SubmittingOrgRead> {
    const response = await fetch(
      `${this.apiBaseUrl}clinvarsub/submittingorgs/${submittingOrg.id}`,
      {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submittingOrg)
      }
    )
    return await response.json()
  }

  /**
   * Delete a submitting organization.
   *
   * @param id The UUID of the submitting organization to delete.
   */
  async deleteSubmittingOrg(id: string): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}clinvarsub/submittingorgs/${id}`, {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error(`Failed to delete submitting org ${id}`)
    }
  }

  /**
   * Fetch submission threads for the given variant owned by the current user.
   *
   * @param primaryVariantDesc Primary description of variant to fetch for.
   * @param cursor The optional cursor to use for fetching.
   * @param pageSize The page size to use for enumerating.
   * @returns One page of submission threads.
   */
  async fetchSubmissionThreads(
    primaryVariantDesc: string,
    cursor?: string | undefined,
    pageSize: number = 50
  ): Promise<SubmissionThreadPage> {
    let query: string
    if (cursor) {
      query = `primary_variant_desc=${primaryVariantDesc}&cursor=${cursor}&size=${pageSize}`
    } else {
      query = `primary_variant_desc=${primaryVariantDesc}&size=${pageSize}`
    }
    const response = await fetch(`${this.apiBaseUrl}clinvarsub/submissionthreads?${query}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    return await response.json()
  }
}
