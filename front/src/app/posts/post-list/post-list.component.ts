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
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {
  @Input() posts: Post[] = []
  @Input() userIsAuthenticated: boolean
  @Input() userId: string
  @Output() onDelete = new EventEmitter<string>()

  isLoading = false
}
