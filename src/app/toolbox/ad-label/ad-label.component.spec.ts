import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdLabelComponent } from './ad-label.component';

describe('AdLabelComponent', () => {
  let component: AdLabelComponent;
  let fixture: ComponentFixture<AdLabelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdLabelComponent]
    });
    fixture = TestBed.createComponent(AdLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
