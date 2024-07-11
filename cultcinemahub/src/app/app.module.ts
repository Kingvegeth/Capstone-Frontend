import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './main-components/header/header.component';
import { FooterComponent } from './main-components/footer/footer.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthService } from './auth/auth.service';
import { UsersService } from './users.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MoviesComponent } from './pages/movies/movies.component';
import { UnderConstructionComponent } from './pages/under-construction/under-construction.component';
import { AddMovieModalComponent } from './shared/modals/add-movie-modal/add-movie-modal.component';
import { EditMovieModalComponent } from './shared/modals/edit-movie-modal/edit-movie-modal.component';
import { PeopleComponent } from './pages/people/people.component';
import { EditPersonModalComponent } from './shared/modals/edit-person-modal/edit-person-modal.component';
import { AddPersonModalComponent } from './shared/modals/add-person-modal/add-person-modal.component';
import { CompaniesComponent } from './pages/companies/companies.component';
import { AddCompanyModalComponent } from './shared/modals/add-company-modal/add-company-modal.component';
import { EditCompanyModalComponent } from './shared/modals/edit-company-modal/edit-company-modal.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { MomentModule, NGX_MOMENT_OPTIONS } from 'ngx-moment';
import moment from 'moment';
import 'moment/locale/it';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { ReviewComponent } from './shared/components/review/review.component';
import { CommentComponent } from './shared/components/comment/comment.component';
import { AddReviewModalComponent } from './shared/modals/add-review-modal/add-review-modal.component';
import { EditReviewModalComponent } from './shared/modals/edit-review-modal/edit-review-modal.component';
import { AddCommentModalComponent } from './shared/modals/add-comment-modal/add-comment-modal.component';
import { EditCommentModalComponent } from './shared/modals/edit-comment-modal/edit-comment-modal.component';

registerLocaleData(localeIt);
moment.locale('it');


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ProfileComponent,
    MoviesComponent,
    UnderConstructionComponent,
    AddMovieModalComponent,
    EditMovieModalComponent,
    PeopleComponent,
    EditPersonModalComponent,
    AddPersonModalComponent,
    CompaniesComponent,
    AddCompanyModalComponent,
    EditCompanyModalComponent,
    MovieDetailsComponent,
    ReviewComponent,
    CommentComponent,
    AddReviewModalComponent,
    EditReviewModalComponent,
    AddCommentModalComponent,
    EditCommentModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    MomentModule
  ],
  providers: [
    AuthService,
    UsersService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: 'it'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
