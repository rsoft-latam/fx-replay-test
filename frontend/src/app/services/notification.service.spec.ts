import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBarSpy: jest.Mocked<MatSnackBar>;

  beforeEach(() => {
    snackBarSpy = { open: jest.fn() } as unknown as jest.Mocked<MatSnackBar>;

    TestBed.configureTestingModule({
      providers: [{ provide: MatSnackBar, useValue: snackBarSpy }],
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('success should open snackbar with success class', () => {
    service.success('Orden creada');

    expect(snackBarSpy.open).toHaveBeenCalledWith('Orden creada', 'Cerrar', {
      duration: 3000,
      panelClass: 'snackbar-success',
    });
  });

  it('error should open snackbar with error class', () => {
    service.error('Algo falló');

    expect(snackBarSpy.open).toHaveBeenCalledWith('Algo falló', 'Cerrar', {
      duration: 5000,
      panelClass: 'snackbar-error',
    });
  });
});
