import { NgModule } from '@angular/core'
import { PostCreateComponent } from './post-create/post-create.component'
import { PostListComponent } from './post-list/post-list.component'
import { ReactiveFormsModule } from '@angular/forms'
import { AngularMaterialModule } from '../modules/angular-material.module'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TimeAgoPipe } from 'time-ago-pipe'
import { PostPreviewComponent } from './post-preview/post-preview.component'
import { MainFeedComponent } from './feed/main.feed.component'

// import {
//   CloudinaryModule,
//   CloudinaryConfiguration
// } from '@cloudinary/angular-5.x'
// import { Cloudinary } from 'cloudinary-core'
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
    RouterModule,
    // CloudinaryModule.forRoot({ Cloudinary }, {
    //   cloud_name: 'dwjawpmxz'
    // } as CloudinaryConfiguration)
  ],
  exports: [ReactiveFormsModule]
})
export class PostsModule {}
