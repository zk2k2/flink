import { TestBed } from '@angular/core/testing';

import { MockUserProfileService } from './mock-user-profile.service';

describe('MockUserProfileService', () => {
  let service: MockUserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockUserProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
