import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GuestGuard } from './auth/guest.guard';
import { AuthGuard } from './auth/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { MoviesComponent } from './pages/movies/movies.component';
import { UnderConstructionComponent } from './pages/under-construction/under-construction.component';
import { PeopleComponent } from './pages/people/people.component';
import { CompaniesComponent } from './pages/companies/companies.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { ActivationSuccessComponent } from './pages/activation/activation-success/activation-success.component';
import { ActivationErrorComponent } from './pages/activation/activation-error/activation-error.component';
import { ActivationComponent } from './pages/activation/activation/activation.component';
import { AdminGuard } from './auth/admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
},
  {
    path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [GuestGuard],
  canActivateChild: [GuestGuard],
  },
  {
    path:'companies',
    component:CompaniesComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'wip',
    component:UnderConstructionComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'profile',
    component:ProfileComponent,
    canActivate: [AuthGuard,AdminGuard]
  },
  {
    path:'people',
    component:PeopleComponent,
    canActivate: [AuthGuard,AdminGuard]
  },
  {
    path:'movies',
    component:MoviesComponent
  },
  {
    path:'movies/:id',
    component:MovieDetailsComponent
  },
  {
    path: 'activate',
    component: ActivationComponent
  },
  {
    path:'activation-success',
    component:ActivationSuccessComponent
  },
  {
    path:'activation-error',
    component:ActivationErrorComponent
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
