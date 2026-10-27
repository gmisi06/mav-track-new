import { describe, expect, it } from 'vitest';
import { getVehicleType } from '../vehicles/vehicleType';

describe('getVehicleType', () => {
  it('felismeri a Traxxot, a Vectront és a Taurust', () => {
    expect(getVehicleType('1:915504800078')).toBe('Bombardier Traxx');
    expect(getVehicleType('1:918071936382')).toBe('Siemens Vectron');
    expect(getVehicleType('1:918111162205')).toBe('Siemens Taurus (ÖBB 1116)');
  });

  it('ismeretlen sorozatnál az általános leírást adja', () => {
    expect(getVehicleType('1:915504900118')).toBe('490 sorozatú villamos mozdony');
    expect(getVehicleType('1:945514150669')).toBe('Stadler FLIRT');
    expect(getVehicleType('1:945504180076')).toBe('418 sorozatú villamos motorvonat');
    expect(getVehicleType('1:955504460001')).toBe('446 sorozatú dízel motorvonat');
  });

  it('felismeri a motorvonatokat', () => {
    expect(getVehicleType('1:945518150186')).toBe('Stadler KISS');
    expect(getVehicleType('1:955514260269')).toBe('Siemens Desiro');
    expect(getVehicleType('1:955501171644')).toBe('Tatra Bzmot');
  });

  it('kocsinál és érvénytelen azonosítónál nem ad típust', () => {
    expect(getVehicleType('1:505580054342')).toBeUndefined();
    expect(getVehicleType('x')).toBeUndefined();
    expect(getVehicleType(undefined)).toBeUndefined();
  });
});
