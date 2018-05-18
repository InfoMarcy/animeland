import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
@Injectable()
export class SnackbarService {

    constructor(private snackbar: MatSnackBar) {

    }
    // launch the snack bar dialog
    launch(message: string, action: string, durationTime: number) {
            //set the time for the snackbar dialog

            // open the dialog and show the message
            this.snackbar.open(message, action, {
                duration: durationTime,
              });

    }
}
