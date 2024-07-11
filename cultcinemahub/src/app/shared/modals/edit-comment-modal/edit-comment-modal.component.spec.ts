import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCommentModalComponent } from './edit-comment-modal.component';

describe('EditCommentModalComponent', () => {
  let component: EditCommentModalComponent;
  let fixture: ComponentFixture<EditCommentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCommentModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditCommentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
