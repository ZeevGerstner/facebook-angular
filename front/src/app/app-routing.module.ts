import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AuthGuard } from './auth/auth.guard'

import { PostListComponent } from './posts/post-list/post-list.component'
import { PostCreateComponent } from './posts/post-create/post-create.component'
import { ProfileComponent } from './profile/profile.component'

const routes: Routes = [
  {
    path: '',
    component: PostListComponent
  },
  {
    path: 'create',
    component: PostCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit/:postId',
    component: PostCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/:userId',
    component: ProfileComponent,
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule',
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
