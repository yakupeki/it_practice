import { describe, expect, it } from 'vitest';
import { applyTemplate, detectRiskyContent, extractVariables } from './utils';

describe('utils', () => {
  it('extract variables', () => {
    expect(extractVariables('Hi {name} {product}')).toEqual(['name', 'product']);
  });
  it('apply template', () => {
    expect(applyTemplate('{name}さん', { name: '太郎' })).toBe('太郎さん');
  });
  it('detect risky', () => {
    expect(detectRiskyContent('絶対に100%')).toEqual(['絶対', '100%']);
  });
});
