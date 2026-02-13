import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MARKET_PRICES } from '../models/trade.model';

export function priceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const form = control.parent;
    if (!form) return null;

    const type = form.get('type')?.value;
    const side = form.get('side')?.value;
    const pair = form.get('pair')?.value;
    const price = control.value;

    if (type === 'market' || !type || !side || !pair || price == null) {
      return null;
    }

    const marketPrice = MARKET_PRICES[pair];
    if (!marketPrice) return null;

    if (type === 'limit' && side === 'buy' && price >= marketPrice) {
      return {
        priceRule: `Limit Buy: el precio debe ser menor al mercado (${marketPrice})`,
      };
    }

    if (type === 'limit' && side === 'sell' && price <= marketPrice) {
      return {
        priceRule: `Limit Sell: el precio debe ser mayor al mercado (${marketPrice})`,
      };
    }

    if (type === 'stop' && side === 'buy' && price <= marketPrice) {
      return {
        priceRule: `Stop Buy: el precio debe ser mayor al mercado (${marketPrice})`,
      };
    }

    if (type === 'stop' && side === 'sell' && price >= marketPrice) {
      return {
        priceRule: `Stop Sell: el precio debe ser menor al mercado (${marketPrice})`,
      };
    }

    return null;
  };
}
