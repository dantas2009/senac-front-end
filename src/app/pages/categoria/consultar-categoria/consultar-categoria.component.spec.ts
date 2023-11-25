import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarCategoriaComponent } from './consultar-categoria.component';

describe('ConsultarCategoriaComponent', () => {
  let component: ConsultarCategoriaComponent;
  let fixture: ComponentFixture<ConsultarCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarCategoriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultarCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
