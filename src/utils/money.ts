const MONEY = /^\d+(\.\d{1,2})?$/;

export function isMoney(text: string | undefined): boolean {
  return !!text && MONEY.test(text.trim()) && Number(text) > 0;
}
