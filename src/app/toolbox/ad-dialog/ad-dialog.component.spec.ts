import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdDialogComponent } from './ad-dialog.component';

describe('AdDialogComponent', () => {
  let component: AdDialogComponent;
  let fixture: ComponentFixture<AdDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdDialogComponent]
    });
    fixture = TestBed.createComponent(AdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
