import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedSettingsComponent } from './feed-settings.component';

describe('FeedSettingsComponent', () => {
  let component: FeedSettingsComponent;
  let fixture: ComponentFixture<FeedSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedSettingsComponent]
    });
    fixture = TestBed.createComponent(FeedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
