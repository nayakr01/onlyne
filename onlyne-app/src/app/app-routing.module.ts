import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { TrendsComponent } from './trends/trends.component';
import { ExplorerComponent } from './explorer/explorer.component';
import { MoviesComponent } from './movies/movies.component';
import { SeriesComponent } from './series/series.component';
import { DetailsComponent } from './details-movies/details-movies.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { AuthGuard } from './guard/auth.guard';
import { DetailsSeriesComponent } from './details-series/details-series.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'trends', component: TrendsComponent },
  { path: 'explorer', component: ExplorerComponent },
  { path: 'movies', component: MoviesComponent },
  { path: 'series', component: SeriesComponent },
  { path: 'details-movie/:id', component: DetailsComponent },
  { path: 'details-serie/:id', component: DetailsSeriesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: UserprofileComponent, canActivate: [AuthGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
