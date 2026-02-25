import { Routes } from '@angular/router';
import { managerGuard } from './guards/manager-guard';
import { Home } from './component/home/home';
import { PrizeComponent } from './component/prize/prize';
import { Login } from './component/auth/login/login';
import { Register } from './component/auth/register/register';
import { Lottery } from './component/lottery/lottery';
import { AdminPrize } from './component/admin/admin-prize/admin-prize';
import { AdminLayout } from './component/admin/admin-layout/admin-layout';
import { AdminCategory } from './component/admin/admin-category/admin-category';
import { AdminUser } from './component/admin/admin-user/admin-user';
import { AdminDonor } from './component/admin/admin-donor/admin-donor';
import { PaymentPageComponent } from './component/checkout/payment-page.component';
import { CartComponent } from './component/cart/cart';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    {
        path: 'admin', component: AdminLayout, canActivate: [managerGuard],
        children: [
            { path: 'prizes', component: AdminPrize },
            { path: 'categories', component: AdminCategory },
            { path: 'donors', component: AdminDonor },
            { path: 'users', component: AdminUser },
        ]
    },
    { path: 'prizes/category/:id', component: PrizeComponent },
    { path: 'login', component: Login },
    { path: 'cart', component: CartComponent },
    { path: 'register', component: Register },
    { path: 'getAllPrizes', component: PrizeComponent },
    { path: 'checkout', component: PaymentPageComponent },
    // { path: 'car', component:PrizeComponent.loadByCategory() },

];
