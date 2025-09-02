import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VedioPageComponent } from './vedio-page.component';

describe('VedioPageComponent', () => {
  let component: VedioPageComponent;
  let fixture: ComponentFixture<VedioPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VedioPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VedioPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
