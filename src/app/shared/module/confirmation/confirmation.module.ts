import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FuseConfirmationDialogComponent } from './dialog/dialog.component';
import { FuseConfirmationService } from './confirmation.service';

@NgModule({
  declarations: [FuseConfirmationDialogComponent],
  imports: [MatButtonModule, MatDialogModule, MatIconModule, CommonModule],
  providers: [FuseConfirmationService],
})
export class ConfirmationModule {
  /**
   * Constructor
   */
  constructor(private _fuseConfirmationService: FuseConfirmationService) { }
}
