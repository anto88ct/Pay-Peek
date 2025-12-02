import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestComponentsComponent } from './test-components.component';

describe('TestComponentsComponent', () => {
  let component: TestComponentsComponent;
  let fixture: ComponentFixture<TestComponentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponentsComponent]
    });
    fixture = TestBed.createComponent(TestComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
