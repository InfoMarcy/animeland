import { Observable } from 'rxjs/Rx';

import { Injectable } from '@angular/core';
import 'rxjs/observable/of';
@Injectable()
export class AppService {

    loading$: Observable<boolean> = Observable.of(false);
    constructor () {}

    fireloader() {
        this.loading$ = Observable.of(true);
    }
    stopLoader() {
        this.loading$ = Observable.of(false);
    }
}
