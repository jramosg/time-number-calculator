import { TestBed } from '@angular/core/testing';

import { ButtonValuesService } from './button-values.service';

describe('ButtonValuesService', () => {
  let service: ButtonValuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ButtonValuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
