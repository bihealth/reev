import axios from 'axios'

const API_BASE_URL = 'http://0.0.0.0:8080/api' // Set your API base URL here

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
