import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core'
import { Post } from '../post.model'

@Component({
  selector: 'app-post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.scss']
})
export class PostPreviewComponent {
  @Input() post: Post
  @Input() userIsAuthenticated: boolean
  @Input() userId: string
  @Output() onDelete = new EventEmitter<string>()
  @Output() likePost = new EventEmitter<string>()
  @Output() editPost = new EventEmitter<void>()


}
