import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input
} from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'

import { PostsService } from '../services/posts.service'
import { Post } from '../post.model'

import { environment } from '../../../environments/environment'
import '../../vendor/cloudinary'
import { RawPostData } from '../models/raw-post-data.model';
declare const cloudinary: any

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  @Output() createPost = new EventEmitter<RawPostData>()
  @Input() post: Post

  isLoading = false
  form = new FormGroup({
    content: new FormControl({
      validators: [Validators.required]
    })
  })
  imgPreview: string
  myWidget: any
  imgPath: string

  constructor(
    public postsService: PostsService,
  ) { }

  ngOnInit() {
    if (!this.post) return
    this.imgPath = this.post.imgPath
    this.form.setValue({
      content: this.post.content,
    })

  }

  onSavePost() {
    if (this.form.invalid) return
    this.createPost.emit({
      content: this.form.value.content,
      imgPath: this.imgPath
    })
  }

  onCancelPost(ev) {
    ev.preventDefault()
    this.imgPath = ''
    this.form.reset()
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
}
