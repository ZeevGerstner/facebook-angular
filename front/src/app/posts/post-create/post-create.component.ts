import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'

import { PostsService } from '../services/posts.service'
import { AuthService } from 'src/app/auth/auth.service'
import { Post } from '../post.model'
import { mimeType } from './mime-type.validator'

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  postContent = ''
  post: Post
  isLoading = false
  form: FormGroup
  imgPreview: string

  private mode = 'create'
  private postId: string
  private authStatusSub: Subscription

  constructor(
    public route: ActivatedRoute,
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => (this.isLoading = false))
    this.setForm()
    this.route.paramMap.subscribe(paramMap => {
      if (paramMap.has('postId')) {
        this.mode = 'edit'
        this.postId = paramMap.get('postId')
        this.isLoading = true
        this.postsService.getPost(this.postId).subscribe((postData: any) => {
          this.isLoading = false
          this.post = {
            id: postData.id,
            content: postData.content,
            imgPath: postData.imgPath,
            creator: postData.creator
          }
          this.form.setValue({
            content: this.post.content,
            img: this.post.imgPath
          })
        })
      } else {
        this.mode = 'create'
        this.postId = null
      }
    })
  }

  onImgPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0]
    this.form.patchValue({ img: file })
    this.form.get('img').updateValueAndValidity()
    const reader = new FileReader()
    reader.onload = () => ((this.imgPreview as any) = reader.result)
    reader.readAsDataURL(file)
  }

  onSavePost() {
    if (this.form.invalid) return
    this.isLoading = true
    if (this.mode === 'create') {
      this.postsService.addPosts(
        this.form.value.content,
        this.form.value.img
      )
    } else {
      this.postsService.updatedPost(
        this.postId,
        this.form.value.content,
        this.form.value.img
      )
    }
    this.form.reset()
  }

  setForm() {
    this.form = new FormGroup({
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      img: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    })
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe()
  }
}
