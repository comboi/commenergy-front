export function formatPrice(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount);
}
