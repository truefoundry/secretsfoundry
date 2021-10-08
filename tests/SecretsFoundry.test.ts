import { SecretsFoundry } from '../src/SecretsFoundry';
import Loader from '../src/loaders/loader';
class DummyLoader extends Loader {
  startKeyWord: string;

  constructor(startKeyWord: string) {
    super();
    this.startKeyWord = startKeyWord
  }

  public async resolve(...args: string[]): Promise<string> {
    return `resolved_by_${this.startKeyWord}`;
  }

  public canResolve(variable: string): boolean {
    return variable.split(':')[0] == this.startKeyWord;
  }
}

// Reusable constants
const foundry = new SecretsFoundry([
  new DummyLoader('sourceA'),
  new DummyLoader('sourceB'),
  new DummyLoader('sourceC'),
  new DummyLoader('HELLOA')
]);

const envVars: Record<string, string> = {
  'SIMPLE': 'HELLO',
  'HELLO_SIMPLE': 'HELLO_WORLD',
  'Nested': 'HELLO_WORLD'
};

const baseRecord: Record<string, string> = {
  'SIMPLE': 'HELLO',
  'HELLO_SIMPLE': '${SIMPLE}_WORLD',
  'Nested': '${${SIMPLE}_SIMPLE}'
}

const completeBaseRecord: Record<string, string> = {
  ...baseRecord,
  'A_Record': '${sourceA:hello_world}',
  'B_Record': '${sourceB:${HELLO_SIMPLE}}',
  'Hello_Record': '${${SIMPLE}A:${A_Record}}'
}

describe('SecretsFoundry', () => {
  it('Should resolve standard vars', async () => {
    const response = await foundry.dotenvExpand(baseRecord);
    expect(response).toStrictEqual(envVars);
  });

  it('Should resolve value for dummy loaders', async () => {
    const response = await Promise.all([
      foundry.resolveVar(
        'sourceA:hello_world',
        envVars
      ),
      foundry.resolveVar(
        'sourceB:hello_world',
        envVars
      ),
      foundry.resolveVar(
        'sourceC:hello_world',
        envVars
      )
    ]);
    expect(response).toStrictEqual([
      'resolved_by_sourceA',
      'resolved_by_sourceB',
      'resolved_by_sourceC'
    ]);
  });

  it('Should resolve vars with both simple and dummy foundry vars', async () => {
    const response = await foundry.dotenvExpand(completeBaseRecord);
    expect(response).toStrictEqual({
      ...envVars,
      'A_Record': 'resolved_by_sourceA',
      'B_Record': 'resolved_by_sourceB',
      'Hello_Record': 'resolved_by_HELLOA'
    });
  }); 
  
});


