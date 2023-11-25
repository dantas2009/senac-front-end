import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarDespesaComponent } from './consultar-despesa.component';

describe('ConsultarDespesaComponent', () => {
  let component: ConsultarDespesaComponent;
  let fixture: ComponentFixture<ConsultarDespesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarDespesaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultarDespesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
