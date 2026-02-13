import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'trades',
    pathMatch: 'full',
  },
  {
    path: 'trades',
    loadComponent: () =>
      import('./components/trade-list/trade-list.component').then(
        (m) => m.TradeListComponent
      ),
  },
  {
    path: 'trades/new',
    loadComponent: () =>
      import('./components/trade-form/trade-form.component').then(
        (m) => m.TradeFormComponent
      ),
  },
  {
    path: 'trades/:id',
    loadComponent: () =>
      import('./components/trade-form/trade-form.component').then(
        (m) => m.TradeFormComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'trades',
  },
];
