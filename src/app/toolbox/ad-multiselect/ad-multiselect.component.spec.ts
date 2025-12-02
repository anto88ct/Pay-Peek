import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdMultiselectComponent } from './ad-multiselect.component';

describe('AdMultiselectComponent', () => {
  let component: AdMultiselectComponent;
  let fixture: ComponentFixture<AdMultiselectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdMultiselectComponent]
    });
    fixture = TestBed.createComponent(AdMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
