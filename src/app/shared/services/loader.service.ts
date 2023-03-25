import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoaderComponent } from '../components/loader/loader.component';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  dialogRef: any;

  constructor(private dialog: MatDialog) { }

  open() {
    this.dialogRef = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });
  }

  close() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
