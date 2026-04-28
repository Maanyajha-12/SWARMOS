class WebSocketManager {
    private static instance: WebSocketManager
    private ws: WebSocket | null = null
    private url: string
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5
    private reconnectDelay = 3000
    private reconnectTimer: any = null   // ✅ added
    private messageHandlers: Map<string, Function[]> = new Map()
    private connectedCallbacks: Function[] = []
    private disconnectedCallbacks: Function[] = []

    private constructor() {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        const wsProtocol = apiUrl.startsWith('https') ? 'wss:' : 'ws:'
        const wsHost = apiUrl.replace('http://', '').replace('https://', '')
        this.url = `${wsProtocol}//${wsHost}`
    }

    static getInstance(): WebSocketManager {
        if (!WebSocketManager.instance) {
            WebSocketManager.instance = new WebSocketManager()
        }
        return WebSocketManager.instance
    }

    connect(): void {
        // ✅ FIX: handle CONNECTING state also
        if (
            this.ws &&
            (this.ws.readyState === WebSocket.OPEN ||
                this.ws.readyState === WebSocket.CONNECTING)
        ) {
            console.log('WebSocket already connecting/connected')
            return
        }

        try {
            this.ws = new WebSocket(this.url)

            this.ws.onopen = () => {
                console.log('WebSocket connected')
                this.reconnectAttempts = 0
                this.reconnectTimer = null   // ✅ reset timer
                this.connectedCallbacks.forEach((cb) => cb())
            }

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    const handlers = this.messageHandlers.get(data.type) || []
                    handlers.forEach((handler) => handler(data))
                } catch (error) {
                    console.error('Failed to parse WebSocket message:', error)
                }
            }

            this.ws.onclose = () => {
                console.log('WebSocket disconnected')
                this.ws = null   // ✅ IMPORTANT

                this.disconnectedCallbacks.forEach((cb) => cb())
                this.attemptReconnect()
            }

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error)
            }
        } catch (error) {
            console.error('Failed to connect WebSocket:', error)
            this.attemptReconnect()
        }
    }

    private attemptReconnect(): void {
        // ✅ prevent multiple timers
        if (this.reconnectTimer) return

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            console.log(
                `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
            )

            this.reconnectTimer = setTimeout(() => {
                this.reconnectTimer = null
                this.connect()
            }, this.reconnectDelay)
        } else {
            console.error('Max reconnection attempts reached')
        }
    }

    disconnect(): void {
        if (this.ws) {
            this.ws.close()
            this.ws = null
        }
    }

    send(data: any): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data))
        } else {
            console.warn('WebSocket is not connected')
        }
    }

    on(messageType: string, handler: Function): void {
        if (!this.messageHandlers.has(messageType)) {
            this.messageHandlers.set(messageType, [])
        }
        this.messageHandlers.get(messageType)!.push(handler)
    }

    off(messageType: string, handler: Function): void {
        const handlers = this.messageHandlers.get(messageType)
        if (handlers) {
            const index = handlers.indexOf(handler)
            if (index > -1) {
                handlers.splice(index, 1)
            }
        }
    }

    onConnected(callback: Function): void {
        this.connectedCallbacks.push(callback)
    }

    onDisconnected(callback: Function): void {
        this.disconnectedCallbacks.push(callback)
    }

    isConnected(): boolean {
        return this.ws ? this.ws.readyState === WebSocket.OPEN : false
    }
}

export default WebSocketManager