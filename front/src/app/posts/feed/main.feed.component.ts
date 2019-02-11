import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription, BehaviorSubject, Observable } from 'rxjs'
import { PageEvent } from '@angular/material'

import { PostsService } from '../services/posts.service'
import { AuthService } from 'src/app/auth/auth.service'
import { Post } from '../post.model'
import { RawPostData } from '../models/raw-post-data.model';

@Component({
  selector: 'app-main-feed',
  templateUrl: './main.feed.component.html'
})
export class MainFeedComponent implements OnInit, OnDestroy {
  posts: Post[] = []
  isLoading = false
  totalPosts = 0
  postsPerPage = 10
  currPage = 1
  pageSizeOptions = [1, 2, 5, 10]
  userId: string
  userIsAuthenticated = false
  private authStatusSub: Subscription
  $posts = this.postsService.postsUpdated;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userId = this.authService.getUserId()

    if (this.userId) {
      this.postsService.getPosts(this.postsPerPage, this.currPage, this.userId)
    } else {
      this.postsService.getPosts(this.postsPerPage, this.currPage)
    }
    this.userIsAuthenticated = this.authService.getIsAuth()
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated
        this.userId = this.authService.getUserId()
      })
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true
    this.currPage = pageData.pageIndex + 1
    this.postsPerPage = pageData.pageSize
    this.postsService.getPosts(this.postsPerPage, this.currPage)
  }

  deletePost(postId: string) {

    this.isLoading = true
    this.postsService.deletePost(postId).subscribe(
      res => {
        this.postsService.getPosts(this.postsPerPage, this.currPage, this.userId)
      },
      err => (this.isLoading = false)
    )
  }
  onLikePost(postId: string) {

    this.postsService.likePost(postId, this.userId)
      .subscribe(console.log)
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe()
  }


  createOrUpdatePost(newPostData: RawPostData) {
    this.postsService.addPost(newPostData)
      .subscribe(() => {
        this.postsService.getPosts(this.postsPerPage, this.currPage, this.userId)
      })
  }

  updatePost(post: Post) {
    this.postsService.updatedPost(post._id, post.content, post.imgPath)
      .subscribe(() => {
        this.postsService.getPosts(this.postsPerPage, this.currPage, this.userId)
      })
  }
}
