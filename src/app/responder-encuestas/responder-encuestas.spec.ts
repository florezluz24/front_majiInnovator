import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponderEncuestas } from './responder-encuestas';

describe('ResponderEncuestas', () => {
  let component: ResponderEncuestas;
  let fixture: ComponentFixture<ResponderEncuestas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponderEncuestas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponderEncuestas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
