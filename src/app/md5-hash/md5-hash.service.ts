import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class Md5HashService {
  hashWorker: Worker;

  constructor() { }

  generateMD5HashForFile(file: File): Observable<any> {
    const hashSubject: Subject<any> = new Subject();
    this.hashWorker = new Worker('assets/scripts/md5HashWebWorker.js');

    this.hashWorker.onmessage = event => {
      switch (event.data.type) {
        case 'status':
          hashSubject.next(event.data);
          break;
        case 'checksum':
          hashSubject.next(event.data);
          hashSubject.complete();
          break;
      }
    };

    this.hashWorker.postMessage([file]);
    return hashSubject.asObservable();
  }

  terminateMD5HashGeneration(): void {
    if (this.hashWorker) {
      this.hashWorker.terminate();
    }
  }
}
