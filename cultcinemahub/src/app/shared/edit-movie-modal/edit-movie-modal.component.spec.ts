import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMovieModalComponent } from './edit-movie-modal.component';

describe('EditMovieModalComponent', () => {
  let component: EditMovieModalComponent;
  let fixture: ComponentFixture<EditMovieModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditMovieModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditMovieModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
