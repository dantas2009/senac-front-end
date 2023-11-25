import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarSenhaConfirmacaoComponent } from './recuperar-senha-confirmacao.component';

describe('RecuperarSenhaConfirmacaoComponent', () => {
  let component: RecuperarSenhaConfirmacaoComponent;
  let fixture: ComponentFixture<RecuperarSenhaConfirmacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuperarSenhaConfirmacaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecuperarSenhaConfirmacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
