import { TestBed } from '@angular/core/testing';

import { LoarderInterceptor } from './loarder.interceptor';

describe('LoarderInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LoarderInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: LoarderInterceptor = TestBed.inject(LoarderInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
