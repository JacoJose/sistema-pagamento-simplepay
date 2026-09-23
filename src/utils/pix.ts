// simular geração do payload do pix, tipo copia e colar -Samuel
export function generatePixCopiaECola(txid: string, amount: number, pixKeyValue: string): string {
    return `00020126PIXSIMULADO${pixKeyValue}5204000053039865406${amount.toFixed(2)}5802BR6304${txid}`;
}

export function generateQrCodeUrl(pixCopiaECola: string): string {
    const encomanda = encodeURIComponent(pixCopiaECola);
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encomanda}`;
}

export function isValidPixKey(type: string, value: string): boolean {
    switch (type.toUpperCase()) {
        case "CNPJ":
            return /^\d{14}$/.test(value);
        case "EMAIL":
            return /[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        case "PHONE":
            return /^\+?\d{10,13}$/.test(value);
        case "RANDOM":
            return /^[0-9a-fA-F-]{36}$/.test(value);
        default:
            return false;
    }
}