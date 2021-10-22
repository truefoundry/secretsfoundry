import vaultLoader from '../../src/loaders/VaultLoader';

describe('vaultLoader', () => {
  const loader = new vaultLoader();
  it('should return true on canResolve', () => {
    const validValues = [
      'vault:random-name',
      'vault():X90hmm8t_S',
      'vault():oofN2IZcND6xkNZk0/bo6aXK9g0yJYuvvZf7_tMfKSgUDUFKG_sHEH6o4_v7EACDvgkR0Yt1xB-F.vowW0baBjjj-.vX8yB',
      'vault():Sx8pfbbmsOuRIwL2SNYU4Ljf-8619qOX2dvK0hUS2BIBwEtRIzqW_tfI1i6KOKFq-9TET0I-x',
      'vault:HcQ9NEVaZKmwBCopwARLE1fSe3y/phvWX_g87ipy0Omu4OxHaKAnZ9IfB507kAKB167cYZbz/ARS5q4aauuRbts',
      'vault:GDHPC.iXhYfHnUbtoraOH1Kp8tSsEDl9.gibJNtRtDyyc0Wdbmsmv0YWK6jav',
      'vault(Rd,Ev9;D7Hsl):EJ',
      'vault(aeHtO6V9E):DHS7PAoNUUqwUyLnVQgq1QMj-lf9srITldDhUDU5_zv0ickWVW8A264SmX6UmDateuwugk_Gt.7mQAiHwjTgWy.eNTFacXL/Ndf',
      'vault:ln6QgudTKVnKpaSUo.AfXxchiYCR7Qw3XAqz1sercLSmYaEbmFybWUdcTu0',
      'vault():PspdpiPiJco0n.GJjt_rY33noMT7gZw8Z_9HTxsP5CR2rNUR2UDGiARWb-YCxHi69M02pZ',
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
