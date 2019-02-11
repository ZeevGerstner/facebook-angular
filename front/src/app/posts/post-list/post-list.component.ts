import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core'
import { Post } from '../post.model'
import { RawPostData } from '../models/raw-post-data.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements  OnChanges {
  @Input() posts: Post[] = []
  @Input() userIsAuthenticated: boolean
  @Input() userId: string
  @Output() onDelete = new EventEmitter<string>()
  @Output() likePost = new EventEmitter<string>()
  @Output() postEdited = new EventEmitter<Post>()

  isEditeds: boolean[];

  isLoading = false


  onEditPost(post: Post, rawPostData: RawPostData) {
    const newPost = {
      ...post, ...rawPostData
    }

    this.postEdited.emit(newPost)
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.posts.previousValue !== changes.posts.currentValue) {
      this.isEditeds = this.posts.map(() => false)
    }
  }
}
