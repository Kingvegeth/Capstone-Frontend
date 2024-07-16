import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationErrorComponent } from './activation-error.component';

describe('ActivationErrorComponent', () => {
  let component: ActivationErrorComponent;
  let fixture: ComponentFixture<ActivationErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivationErrorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivationErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
