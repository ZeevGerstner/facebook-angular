import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { AngularMaterialModule } from '../modules/angular-material.module'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

import { MainFeedComponent } from './feed/main.feed.component'
import { PostCreateComponent } from './post-create/post-create.component'
import { PostListComponent } from './post-list/post-list.component'
import { PostPreviewComponent } from './post-preview/post-preview.component'

import { TimeAgoPipe } from 'time-ago-pipe'

@NgModule({
  declarations: [
    MainFeedComponent,
    PostCreateComponent,
    PostListComponent,
    PostPreviewComponent,
    TimeAgoPipe
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [ReactiveFormsModule]
})
export class PostsModule {}
