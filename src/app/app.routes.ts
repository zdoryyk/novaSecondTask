import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SummaryPageComponent } from './pages/summary-page/summary-page.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo:'login'
    },
    {
        path: 'login',
        component: LoginPageComponent,
    },
    {
        path: 'summary',
        component: SummaryPageComponent,
    },

];
