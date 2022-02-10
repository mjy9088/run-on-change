import { loadFeature, defineFeature } from 'jest-cucumber';

const feature = loadFeature('test/cucumber/features/basic.feature');

interface Context {
  hasPen: boolean;
  hasApple: boolean;
  hasApplePen: boolean;
}

defineFeature(feature, (test) => {
  let context: Context;

  beforeEach(() => {
    context = {
      hasPen: false,
      hasApple: false,
      hasApplePen: false,
    };
  });

  test('PPAP', ({ given, when, then }) => {
    given('I have a pen', () => {
      context.hasPen = true;
    });

    given('I have an apple', () => {
      context.hasApple = true;
    });

    when('uh', () => {
      context.hasApplePen = context.hasPen && context.hasApple;
    });

    then('Apple pen', () => {
      expect(context.hasApplePen).toBe(true);
    });
  });
});
