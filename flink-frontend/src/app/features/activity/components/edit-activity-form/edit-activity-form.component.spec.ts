import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditActivityFormComponent } from './edit-activity-form.component';

describe('EditActivityFormComponent', () => {
  let component: EditActivityFormComponent;
  let fixture: ComponentFixture<EditActivityFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditActivityFormComponent]
    });
    fixture = TestBed.createComponent(EditActivityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
