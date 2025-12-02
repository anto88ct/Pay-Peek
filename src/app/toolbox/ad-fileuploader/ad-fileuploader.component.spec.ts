import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdFileuploaderComponent } from './ad-fileuploader.component';

describe('AdFileuploaderComponent', () => {
  let component: AdFileuploaderComponent;
  let fixture: ComponentFixture<AdFileuploaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdFileuploaderComponent]
    });
    fixture = TestBed.createComponent(AdFileuploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
