import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { PageEvent } from '@angular/material'

import { PostsService } from '../services/posts.service'
import { AuthService } from 'src/app/auth/auth.service'
import { Post } from '../post.model'

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
  private postSub: Subscription

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true
    this.userId = this.authService.getUserId()
    if (this.userId) {
      this.postsService.getPosts(this.postsPerPage, this.currPage, this.userId)
    } else {
      this.postsService.getPosts(this.postsPerPage, this.currPage)
    }
    this.postSub = this.postsService
      .getPostsUpdatedListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false
        this.totalPosts = postData.postCount
        this.posts = postData.posts
      })

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
    console.log(postId)

    this.isLoading = true
    this.postsService.deletePost(postId).subscribe(
      res => {
        this.postsService.getPosts(this.postsPerPage, this.currPage)
      },
      err => (this.isLoading = false)
    )
  }

  ngOnDestroy() {
    this.postSub.unsubscribe()
    this.authStatusSub.unsubscribe()
  }
}
