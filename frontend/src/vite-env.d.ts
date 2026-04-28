/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_WS_URL: string
    readonly VITE_RPC_URL: string
    readonly VITE_CHAIN_ID: string
    readonly VITE_INFT_CONTRACT: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
