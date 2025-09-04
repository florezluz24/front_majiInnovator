import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarEncuestas } from './visualizar-encuestas';

describe('VisualizarEncuestas', () => {
  let component: VisualizarEncuestas;
  let fixture: ComponentFixture<VisualizarEncuestas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarEncuestas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarEncuestas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
