import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private _snackBar: MatSnackBar) { }

  showSuccess(message: string, closeText: string = "", duration: number = 3) {
    this._snackBar.open(message, closeText, {
      duration: duration * 1000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [
        "bg-green-100",
        "text-green-800"
      ]
    });
  }

  showError(message: string, closeText: string = "", duration: number = 5) {
    this._snackBar.open(message, closeText, {
      duration: duration * 1000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [
        "bg-red-100",
        "text-red-800"
      ]
    });
  }

  showInfo(message: string, closeText: string = "", duration: number = 5) {
    this._snackBar.open(message, closeText, {
      duration: duration * 1000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [
        "bg-slate-100",
        "text-slate-800"
      ]
    });
  }
}
