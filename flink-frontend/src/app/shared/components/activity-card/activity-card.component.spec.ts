import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCardComponent } from './activity-card.component';

describe('ActivityCardComponent', () => {
  let component: ActivityCardComponent;
  let fixture: ComponentFixture<ActivityCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityCardComponent]
    });
    fixture = TestBed.createComponent(ActivityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
