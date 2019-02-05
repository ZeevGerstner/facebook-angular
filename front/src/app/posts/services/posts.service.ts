import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'

import { Subject } from 'rxjs'
import { map } from 'rxjs/operators'

import { environment } from '../../../environments/environment'
import { Post } from '../post.model'

@Injectable({ providedIn: 'root' })
export class PostsService {
  private BASE_URL: string = `${environment.apiUrl}/posts/`
  private posts: Post[] = []
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>()

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postPerPage: number, currPage: number) {
    const queryParams = `?pageSize=${postPerPage}&page=${currPage}`
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        `${this.BASE_URL}${queryParams}`
      )
      .pipe(
        map(postData => ({
          posts: postData.posts.map(post => ({
            ...post,
            id: post._id,
          })),
          maxPosts: postData.maxPosts
        }))
      )
      .subscribe(postsData => {
        this.posts = postsData.posts
        console.log(this.posts);

        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: postsData.maxPosts
        })
      })
  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable()
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string
      title: string
      content: string
      imgPath: string,
      creator: string
    }>(`${this.BASE_URL}${id}`)
  }

  addPosts(title: string, content: string, img: File) {
    const postData = new FormData()
    postData.append('title', title)
    postData.append('content', content)
    postData.append('img', img, title)

    this.http
      .post<{ message: string; post: Post }>(
        this.BASE_URL,
        postData
      )
      .subscribe(res => {
        this.router.navigate(['/'])
      })
  }

  updatedPost(id: string, title: string, content: string, img: File | string) {
    let postData: Post | FormData
    if (typeof img === 'object') {
      postData = new FormData()
      postData.append('id', id)
      postData.append('title', title)
      postData.append('content', content)
      postData.append('img', img, title)
    } else {
      postData = {
        id,
        title,
        content,
        imgPath: img,
        creator: null,
      }
    }
    this.http
      .put(`${this.BASE_URL}${id}`, postData)
      .subscribe(res => {
        this.router.navigate(['/'])
      })
  }

  deletePost(postId: string) {
    return this.http.delete(`${this.BASE_URL}${postId}`)
  }
}
