// utils.ts - Shared utility functions
export function debugLog(context: string, data: any): void {
    console.log(`[${context}]`, typeof data === 'string' ? data : JSON.stringify(data, null, 2));
}