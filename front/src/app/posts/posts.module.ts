import { NgModule } from '@angular/core'
import { PostCreateComponent } from './post-create/post-create.component'
import { PostListComponent } from './post-list/post-list.component'
import { ReactiveFormsModule } from '@angular/forms'
import { AngularMaterialModule } from '../modules/angular-material.module'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { postPreviewComponent } from './post-preview/post-preview.component'

@NgModule({
  declarations: [PostCreateComponent, PostListComponent, postPreviewComponent],
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: []
})
export class PostsModule {}
