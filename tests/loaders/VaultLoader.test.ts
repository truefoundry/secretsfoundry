import vaultLoader from '../../src/loaders/VaultLoader';

describe('vaultLoader', () => {
  const loader = new vaultLoader();
  it('should return true on canResolve', () => {
    const validValues = [
      'vault:random-name',
      'vault():X90hmm8t_S',
      'vault(Rd,Ev9;D7Hsl):ra1-tes_asdfa.823nja.naiur3/Ndf',
    ];
    for (const value of validValues) {
      const isResolved = loader.canResolve(value);
      expect(isResolved).toBeTruthy();
    }
  });

  it('should return false on canResolve', () => {
    const invalidValues = [
      'vaut:random-name',
      'vault(Rd,Ev9;D7@Hsl):EJ',
      'vault:{ln6QgudTKVnKpaSUo.}AfXxchiYCR7Qw3XAqz1sercLSmYaEbmFybWUdcTu0',
      'vault():%PspdpiPiJco0n.GJjt_rY33noMT7gZw8Z_9HTxsP5CR2rNUR2UDGiARWb-YCxHi69M02pZ',
      'vault(aeHtO6V9&E):DHS7PAoNUUqwUyLnVQgq1QMj-',
    ];
    for (const value of invalidValues) {
      const isResolved = loader.canResolve(value);
      expect(isResolved).not.toBeTruthy();
    }
  });
});
