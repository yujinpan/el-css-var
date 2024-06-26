import { helloWorld } from './index';

describe('helloWorld', () => {
  it('should say', function () {
    expect(helloWorld({ msg: 'Hello, World!' })).toBe('Hello, World!');
  });
});
