import { ErrorHandler } from '@angular/core';

export class AppErrorHandler implements ErrorHandler {


    // to handlers the errors globally
    handleError(error) {
// alert('un error inesperado ha ocurrido.');
console.log(error);

    }


}
