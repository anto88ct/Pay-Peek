import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdInputComponent } from './ad-input.component';

describe('AdInputComponent', () => {
  let component: AdInputComponent;
  let fixture: ComponentFixture<AdInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdInputComponent]
    });
    fixture = TestBed.createComponent(AdInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
