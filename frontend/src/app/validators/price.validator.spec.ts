import { FormBuilder } from '@angular/forms';
import { priceValidator } from './price.validator';

describe('priceValidator', () => {
  const fb = new FormBuilder();

  function buildForm(pair: string, side: string, type: string, price: number | null) {
    const form = fb.group({
      pair: [pair],
      side: [side],
      type: [type],
      price: [price, [priceValidator()]],
    });
    return form;
  }

  it('should return null for Limit Buy with price below market', () => {
    const form = buildForm('BTCUSD', 'buy', 'limit', 100000);
    expect(form.get('price')!.errors).toBeNull();
  });

  it('should return null for Limit Sell with price above market', () => {
    const form = buildForm('BTCUSD', 'sell', 'limit', 101000);
    expect(form.get('price')!.errors).toBeNull();
  });

  it('should return null for Stop Buy with price above market', () => {
    const form = buildForm('EURUSD', 'buy', 'stop', 1.05);
    expect(form.get('price')!.errors).toBeNull();
  });

  it('should return null for Stop Sell with price below market', () => {
    const form = buildForm('ETHUSD', 'sell', 'stop', 3200);
    expect(form.get('price')!.errors).toBeNull();
  });

  it('should return null for Market type regardless of price', () => {
    const form = buildForm('BTCUSD', 'buy', 'market', 999999);
    expect(form.get('price')!.errors).toBeNull();
  });

  it('should return null when pair is empty', () => {
    const form = buildForm('', 'buy', 'limit', 50000);
    expect(form.get('price')!.errors).toBeNull();
  });
});
