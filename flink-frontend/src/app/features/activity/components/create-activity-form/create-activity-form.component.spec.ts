import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateActivityFormComponent } from './create-activity-form.component';

describe('CreateActivityFormComponent', () => {
  let component: CreateActivityFormComponent;
  let fixture: ComponentFixture<CreateActivityFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateActivityFormComponent]
    });
    fixture = TestBed.createComponent(CreateActivityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
