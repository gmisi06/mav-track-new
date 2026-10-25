import { describe, expect, it } from 'vitest';
import { isThemePreference, nextPreference, resolveTheme } from '../theme';

describe('theme', () => {
  it('a rendszer választást a böngésző beállítására oldja fel', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
  });

  it('a kézi választás felülírja a rendszer beállítását', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('a kapcsoló körbejár: rendszer → világos → sötét → rendszer', () => {
    expect(nextPreference('system')).toBe('light');
    expect(nextPreference('light')).toBe('dark');
    expect(nextPreference('dark')).toBe('system');
  });

  it('csak érvényes tárolt értéket fogad el', () => {
    expect(isThemePreference('dark')).toBe(true);
    expect(isThemePreference('blue')).toBe(false);
    expect(isThemePreference(null)).toBe(false);
  });
});
