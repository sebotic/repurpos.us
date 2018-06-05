import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router, NavigationEnd } from '@angular/router';

import { CompoundSearchComponent } from './compound-search/compound-search.component'
import { CompoundDataComponent } from './compound-data/compound-data.component';
import { AboutComponent } from './about/about.component';
import { AssaysComponent } from './assays/assays.component';
import { AssayDataComponent } from './assay-data/assay-data.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { environment } from '../environments/environment';

const appRoutes: Routes = [
  { path: '', component: CompoundSearchComponent, pathMatch: 'full' },
  { path: 'search', component: CompoundSearchComponent, pathMatch: 'full' },
  { path: 'about', component: AboutComponent, pathMatch: 'full' },
  { path: 'assays', component: AssaysComponent, pathMatch: 'full' },
  { path: 'assays/:aid', component: AssayDataComponent, pathMatch: 'full' },
  { path: 'compound_data/:id', component: CompoundDataComponent, pathMatch: 'full' },
  { path: 'confirm/:cid', component: ConfirmEmailComponent, pathMatch: 'full' },
  { path: 'reset_pass/:rid', component: ResetPasswordComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router) {
    // Send page change event to google analytics
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        (<any>window).ga('set', 'page', event.urlAfterRedirects);
        (<any>window).ga('send', 'pageview');
      }
    });
  }
}

export const routedComponents = [CompoundSearchComponent, AboutComponent, AssaysComponent, AssayDataComponent, CompoundDataComponent, ConfirmEmailComponent, ResetPasswordComponent];
