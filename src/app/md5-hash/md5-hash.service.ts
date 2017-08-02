import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class Md5HashService {

  constructor() { }

  generateMD5HashForFile(file: File): Observable<any> {
    const hashSubject: Subject<any> = new Subject();
    const hashWorker = new Worker('assets/scripts/md5HashWebWorker.js');

    hashWorker.onmessage = function (event) {
      console.log(event);
    };

    hashWorker.postMessage([file]);
    return hashSubject.asObservable();
  }

}
