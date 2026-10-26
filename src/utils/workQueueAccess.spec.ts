import { describe, expect, it } from 'vitest';
import { seesQueue } from './workQueueAccess';

describe('qué pendientes ve cada área en Inicio', () => {
  it('master ve todo', () => {
    expect(seesQueue('MASTER', 'costs')).toBe(true);
    expect(seesQueue('MASTER', 'cuttingSheet')).toBe(true);
  });

  it('cada área ve los pasos de su menú', () => {
    expect(seesQueue('EXPORT', 'supplies')).toBe(true);
    expect(seesQueue('EXPORT', 'documents')).toBe(true);
    expect(seesQueue('EXPORT', 'costs')).toBe(false);
    expect(seesQueue('QUALITY', 'cuttingSheet')).toBe(true);
    expect(seesQueue('QUALITY', 'supplies')).toBe(false);
    expect(seesQueue('ADMINISTRATIVE', 'clientPayment')).toBe(true);
    expect(seesQueue('LOGISTICS', 'supplies')).toBe(false);
  });
});
