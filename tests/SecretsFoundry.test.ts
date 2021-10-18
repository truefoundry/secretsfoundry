import { SecretsFoundry } from '../src/SecretsFoundry';
import Loader from '../src/loaders/loader';
class DummyLoader extends Loader {
  startKeyWord: string;

  constructor(startKeyWord: string) {
    super();
    this.startKeyWord = startKeyWord;
  }

  public async resolve(...args: string[]): Promise<string> {
    return `resolved_by_${this.startKeyWord}`;
  }

  public canResolve(variable: string): boolean {
    if (!variable) return false;
    return variable.split(':')[0] == this.startKeyWord;
  }
}

// Reusable constants
const foundry = new SecretsFoundry([
  new DummyLoader('sourceA'),
  new DummyLoader('sourceB'),
  new DummyLoader('sourceC'),
  new DummyLoader('HELLOA'),
]);

const envVars: Record<string, string> = {
  SIMPLE: 'HELLO',
  HELLO_SIMPLE: 'HELLO_WORLD',
  Nested: 'HELLO_WORLD',
};

const baseRecord: Record<string, string> = {
  SIMPLE: 'HELLO',
  HELLO_SIMPLE: '${SIMPLE}_WORLD',
  Nested: '${${SIMPLE}_SIMPLE}',
};

const completeBaseRecord: Record<string, string> = {
  ...baseRecord,
  A_Record: '${sourceA:hello_world}',
  B_Record: '${sourceB:${HELLO_SIMPLE}}',
  Hello_Record: '${${SIMPLE}A:${A_Record}}',
};

const obscureVarNames = [
  ':azAZ09_;(=),\\.-/',
  '=',
  '\\',
  '()',
  ')())))',
  'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUxXyYzZ',
  '0123456789',
  'return',
  'undefined',
  'throw',
  'console.log(2);',
  ';',
];

const invalidVarNames = [
  '?',
  '+',
  '$',
  '${???}',
  'H?ll?',
  '{',
  '{}',
  'WITH SPACE',
  ' ',
  'Ø',
  '我',
  'يَّة',
];

describe('SecretsFoundry', () => {
  it('Should resolve standard vars', async () => {
    const response = await foundry.resolveVariables(baseRecord);
    expect(response).toStrictEqual(envVars);
  });

  it('Should resolve value for dummy loaders', async () => {
    const response = await Promise.all([
      foundry.resolveVar('sourceA:hello_world', envVars),
      foundry.resolveVar('sourceB:hello_world', envVars),
      foundry.resolveVar('sourceC:hello_world', envVars),
    ]);
    expect(response).toStrictEqual([
      'resolved_by_sourceA',
      'resolved_by_sourceB',
      'resolved_by_sourceC',
    ]);
  });

  it('Should resolve vars with both simple and dummy foundry vars', async () => {
    const response = await foundry.resolveVariables(completeBaseRecord);
    expect(response).toStrictEqual({
      ...envVars,
      A_Record: 'resolved_by_sourceA',
      B_Record: 'resolved_by_sourceB',
      Hello_Record: 'resolved_by_HELLOA',
    });
  });

  it('Should parse obscure var names', async () => {
    for (const envVar of obscureVarNames) {
      const record: Record<string, string> = {
        [envVar]: 'HELLO_WORLD',
        RESULT: `\${${envVar}}`,
      };
      const response = await foundry.resolveVariables(record);
      expect(response).toStrictEqual({
        [envVar]: 'HELLO_WORLD',
        RESULT: 'HELLO_WORLD',
      });
    }
  });

  it('Should not parse invalid var names', async () => {
    for (const envVar of invalidVarNames) {
      const record: Record<string, string> = {
        [envVar]: 'HELLO_WORLD',
        RESULT: `\${${envVar}}`,
      };
      const response = await foundry.resolveVariables(record);
      expect(response).toStrictEqual({
        [envVar]: 'HELLO_WORLD',
        RESULT: `\${${envVar}}`,
      });
    }
  });
});
