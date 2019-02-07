import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'

import { PostsService } from '../services/posts.service'
import { AuthService } from 'src/app/auth/auth.service'
import { Post } from '../post.model'

import { environment } from '../../../environments/environment'
import '../../vendor/cloudinary'
declare const cloudinary: any

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  @Output() onCreatePost = new EventEmitter<Post>()

  postContent = ''
  post: Post
  isLoading = false
  form: FormGroup
  imgPreview: string
  myWidget: any
  imgPath: string
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
      this.mode = 'edit'
      if (paramMap.has('postId')) {
        this.postId = paramMap.get('postId')
        this.isLoading = true
        this.postsService.getPost(this.postId).subscribe((postData: any) => {
          this.isLoading = false
          this.post = {
            id: postData.id,
            content: postData.content,
            imgPath: postData.imgPath,
            creator: postData.creator,
            createdAt: postData.createdAt
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

  onSavePost() {
    if (this.form.invalid) return
    this.isLoading = true
    if (this.mode === 'create') {
      this.postsService.addPosts(this.form.value.content, this.imgPath)
      // .subscribe(res => (this.isLoading = false))
    } else {
      this.postsService.updatedPost(
        this.postId,
        this.form.value.content,
        this.imgPath
      )
    }
    this.form.reset()
  }

  onCancelPost(ev) {
    ev.preventDefault()
    this.imgPath = ''
    this.form.reset()
  }

  setForm() {
    this.form = new FormGroup({
      content: new FormControl(null, {
        validators: [Validators.required]
      })
    })
  }

  setUploadWidget() {
    this.myWidget = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinary_cloud_name,
        apiKey: environment.cloudinary_api_key,
        uploadPreset: 'myPreset',
        clientAllowedFormats: ['png', 'gif', 'jpeg', 'jpg']
      },
      (error, result) => {
        console.log(result)
        if (result && result.event === 'success') this.imgPath = result.info.url
      }
    )
    this.myWidget.open()
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe()
  }
}
