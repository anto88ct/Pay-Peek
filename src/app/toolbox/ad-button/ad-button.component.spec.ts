import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdButtonComponent } from './ad-button.component';

describe('AdButtonComponent', () => {
  let component: AdButtonComponent;
  let fixture: ComponentFixture<AdButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdButtonComponent]
    });
    fixture = TestBed.createComponent(AdButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
