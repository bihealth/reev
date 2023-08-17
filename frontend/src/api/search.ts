import axios from 'axios'

const API_BASE_URL = 'http://0.0.0.0:8080/api' // Set your API base URL here

/**
 * Class for searching for gene.
 *
 * @param {string} geneSymbol - The gene symbol to search for.
 * @param {string} genomeRelease - The genome release to search in.
 * @returns {JSON} The gene data.
 */
export const searchGene = async (geneSymbol: string, genomeRelease: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search`, {
      params: { geneSymbol, genomeRelease }
    })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
