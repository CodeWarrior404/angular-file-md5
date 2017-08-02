import { TestBed, inject } from '@angular/core/testing';

import { Md5HashService } from './md5-hash.service';

describe('Md5HashService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Md5HashService]
    });
  });

  it('should be created', inject([Md5HashService], (service: Md5HashService) => {
    expect(service).toBeTruthy();
  }));
});
