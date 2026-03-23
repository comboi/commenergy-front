import {
  createEmptyContractForm,
  mapContractFormToCreateDto,
  mapContractToFormValues,
} from '@/app/platform/contracts/mappers/contract-form';
import { Contract } from '@/app/platform/contracts/types/contract';

describe('contract form mapping', () => {
  it('creates an empty form seeded with the current user VAT', () => {
    const form = createEmptyContractForm('ES123');

    expect(form.userVat).toBe('ES123');
    expect(form.contractType).toBe('CONSUMPTION');
    expect(form.state).toBe('Active');
  });

  it('maps an enriched contract into editable form values', () => {
    const contract = {
      id: 'contract-1',
      name: 'Main contract',
      provider: { id: 'provider-1', name: 'Provider' },
      contractCode: 'ES0189100000020135ZM0F',
      contractType: 'CONSUMPTION',
      state: 'Active',
      contractPower: 4.6,
      fullAddress: 'Example street',
      userVat: 'VAT-1',
    } as Contract;

    expect(mapContractToFormValues(contract)).toMatchObject({
      id: 'contract-1',
      name: 'Main contract',
      providerId: 'provider-1',
      contractCode: 'ES0189100000020135ZM0F',
      contractType: 'CONSUMPTION',
      state: 'Active',
      contractPower: 4.6,
      fullAddress: 'Example street',
      userVat: 'VAT-1',
    });
  });

  it('maps form values into the API create dto', () => {
    const dto = mapContractFormToCreateDto({
      id: 'contract-2',
      name: 'Secondary contract',
      providerId: 'provider-2',
      contractCode: 'ES0189100000020135ZM0F',
      contractType: 'CONSUMPTION',
      state: 'Inactive',
      contractPower: '5.75',
      fullAddress: 'Another address',
      userVat: 'VAT-2',
    });

    expect(dto).toMatchObject({
      id: 'contract-2',
      name: 'Secondary contract',
      providerId: 'provider-2',
      contractCode: 'ES0189100000020135ZM0F',
      contractType: 'CONSUMPTION',
      state: 'Inactive',
      contractPower: 5.75,
      fullAddress: 'Another address',
      userVat: 'VAT-2',
    });
  });
});
