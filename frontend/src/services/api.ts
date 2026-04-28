import axios from 'axios'

export const API_BASE_URL = '/api'

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
})

// Add request interceptor
apiClient.interceptors.request.use(
    (config) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Add response interceptor
apiClient.interceptors.response.use(
    (response) => {
        console.log(`[API] Response status: ${response.status}`)
        return response
    },
    (error) => {
        if (error.response) {
            console.error(`[API] Error: ${error.response.status} - ${error.response.data?.error}`)
        } else {
            console.error('[API] Error:', error.message)
        }
        return Promise.reject(error)
    }
)

export const createDeliberation = (prompt: string, mode: 'simulation' | 'execution') => {
    return apiClient.post('/deliberate', { prompt, mode })
}

export const getSession = (sessionId: string) => {
    return apiClient.get(`/session/${sessionId}`)
}

export const getAgents = () => {
    return apiClient.get('/agents')
}

export const getAgentStats = (name: string) => {
    return apiClient.get(`/agent/${name}/stats`)
}

export const getHealth = () => {
    return apiClient.get('/health')
}

export const getStats = () => {
    return apiClient.get('/stats')
}

export const getKV = (key: string) => {
    return apiClient.get(`/0g/kv/${key}`)
}

export const setKV = (key: string, value: any) => {
    return apiClient.post(`/0g/kv/${key}`, { value })
}

export const getLog = (logName: string) => {
    return apiClient.get(`/0g/log/${logName}`)
}

export const appendLog = (logName: string, entry: any) => {
    return apiClient.post(`/0g/log/${logName}`, { entry })
}

export default apiClient
