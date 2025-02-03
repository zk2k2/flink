import { TestBed } from '@angular/core/testing';

import { ProfilesServiceService } from './profiles-service.service';

describe('ProfilesServiceService', () => {
  let service: ProfilesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfilesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
