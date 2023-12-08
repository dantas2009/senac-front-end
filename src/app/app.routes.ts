import { Routes } from '@angular/router';
import { HomeComponent } from './layouts/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthComponent } from './layouts/auth/auth.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { CadastroComponent } from './pages/auth/cadastro/cadastro.component';
import { authGuard } from './auth/auth.guard';
import { ConsultarDespesaComponent } from './pages/despesa/consultar-despesa/consultar-despesa.component';
import { AddDespesaComponent } from './pages/despesa/add-despesa/add-despesa.component';
import { RecuperarSenhaComponent } from './pages/auth/recuperar-senha/recuperar-senha.component';
import { NovaSenhaComponent } from './pages/auth/nova-senha/nova-senha.component';
import { FormCategoriaComponent } from './pages/categoria/form-categoria/form-categoria.component';
import { ConsultarCategoriaComponent } from './pages/categoria/consultar-categoria/consultar-categoria.component';
import { ContaComponent } from './pages/conta/conta.component';
import { EditarDespesaComponent } from './pages/despesa/editar-despesa/editar-despesa.component';

export const routes: Routes = [
    {
        path: '', 
        component: HomeComponent,
        children: [
            { path: '', component: DashboardComponent },
            { path: 'conta', component: ContaComponent},
            {
                path: 'despesa',
                children: [
                    { path: 'add', component: AddDespesaComponent },
                    { path: 'editar/:idDespesa', component: EditarDespesaComponent },
                    { path: 'consultar', component: ConsultarDespesaComponent },
                ]
            },
            {
                path: 'categoria',
                children: [
                    { path: 'add', component: FormCategoriaComponent },
                    { path: 'editar/:id_categoria', component: FormCategoriaComponent },
                    { path: 'consultar', component: ConsultarCategoriaComponent },
                ]
            }
        ],
        canActivate: [authGuard],
    },
    {
        path: '', 
        component: AuthComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginComponent },
            { path: 'cadastre-se', component: CadastroComponent},
            { path: 'recuperar-senha', component: RecuperarSenhaComponent},
            { path: 'nova-senha', component: NovaSenhaComponent},
        ]
    }
    
];
