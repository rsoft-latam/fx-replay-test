import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Ha ocurrido un error inesperado';

      if (error.error?.message) {
        message = Array.isArray(error.error.message)
          ? error.error.message.join(', ')
          : error.error.message;
      } else if (error.status === 0) {
        message = 'No se pudo conectar con el servidor';
      } else if (error.status === 404) {
        message = 'Recurso no encontrado';
      } else if (error.status === 422) {
        message = 'Datos de entrada inválidos';
      }

      snackBar.open(`Error: ${message}`, 'Cerrar', {
        duration: 5000,
        panelClass: 'snackbar-error',
      });

      return throwError(() => error);
    })
  );
};
