import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './guard/auth.interceptor';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { TrendsComponent } from './trends/trends.component';
import { ExplorerComponent } from './explorer/explorer.component';
import { MoviesComponent } from './movies/movies.component';
import { SeriesComponent } from './series/series.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { UserdetailComponent } from './userprofile/userdetail/userdetail.component';
import { DetailsComponent } from './details-movies/details-movies.component';
import { AuthGuard } from './guard/auth.guard';
import { DetailsSeriesComponent } from './details-series/details-series.component';
import { ModalComponent } from './userprofile/modal/modal.component';
import { SearchComponent } from './search/search.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    HomeComponent,
    TrendsComponent,
    ExplorerComponent,
    MoviesComponent,
    SeriesComponent,
    UserprofileComponent,
    UserdetailComponent,
    DetailsComponent,
    DetailsSeriesComponent,
    ModalComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
