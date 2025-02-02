import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleCardComponent } from './example-card.component';

describe('ExampleCardComponent', () => {
  let component: ExampleCardComponent;
  let fixture: ComponentFixture<ExampleCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExampleCardComponent]
    });
    fixture = TestBed.createComponent(ExampleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
