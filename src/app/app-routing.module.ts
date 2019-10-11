import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router, NavigationEnd } from '@angular/router';

import { IntroTextComponent } from './intro-text/intro-text.component';
import { CompoundSearchComponent } from './compound-search/compound-search.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { environment } from '../environments/environment';

const appRoutes: Routes = [
  { path: '', component: IntroTextComponent, pathMatch: 'full' },
  { path: 'search', component: CompoundSearchComponent, pathMatch: 'full' },
  { path: 'about', pathMatch: 'full', loadChildren: () => import('./about/about.module').then(mod => mod.AboutModule) },
  { path: 'assays', pathMatch: 'full',
  loadChildren: () => import('./assays/assays.module').then(mod => mod.AssaysModule)
 },

  { path: 'assays/:aid', pathMatch: 'full',
    loadChildren: () => import('./assay-data/assay-data.module').then(mod => mod.AssayDataModule)
  },

  { path: 'compound_data/:id', runGuardsAndResolvers: 'always',
    loadChildren: () => import('./compound-data/compound-data.module').then(mod => mod.CompoundDataModule)
  },
  { path: 'confirm/:cid', component: ConfirmEmailComponent, pathMatch: 'full' },
  { path: 'reset_pass/:rid', component: ResetPasswordComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' })
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

export const routedComponents = [CompoundSearchComponent, ConfirmEmailComponent, ResetPasswordComponent];
