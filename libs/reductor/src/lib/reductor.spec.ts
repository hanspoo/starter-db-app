import { persistor } from '../lib/app/store';
describe('reductor', () => {
  it('should work', () => {
    expect(persistor).toBeTruthy();
  });
});
