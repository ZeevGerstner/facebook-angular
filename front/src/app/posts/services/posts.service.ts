import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'

import { Subject } from 'rxjs'
import { map, tap } from 'rxjs/operators'

import { environment } from '../../../environments/environment'
import { Post } from '../post.model'

@Injectable({ providedIn: 'root' })
export class PostsService {
  private BASE_URL: string = `${environment.apiUrl}/posts/`
  private posts: Post[] = []
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>()

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postPerPage?: number, currPage?: number) {
    const queryParams = `?pageSize=${postPerPage}&page=${currPage}`
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        `${this.BASE_URL}${queryParams}`
      )
      .pipe(
        map(postData => ({
          posts: postData.posts.map(post => ({
            ...post,
            id: post._id
          })),
          maxPosts: postData.maxPosts
        }))
      )
      .subscribe(postsData => {
        this.posts = postsData.posts
        console.log(this.posts)

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
      content: string
      imgPath: string
      creator: string
    }>(`${this.BASE_URL}${id}`)
  }

  addPosts(content: string, img?: string) {
    const postData = new FormData()
    postData.append('content', content)
    if (img) postData.append('img', img)

    return this.http
      .post<{ message: string; post: Post }>(this.BASE_URL, postData)
      .pipe(tap(() => this.getPosts()))

    // .subscribe(res => {
    //   this.router.navigate(['/'])
    // })
  }

  updatedPost(id: string, content: string, img?: string) {
    let postData: Post | FormData
    if (typeof img === 'object') {
      postData = new FormData()
      postData.append('id', id)
      postData.append('content', content)
      if (img) postData.append('img', img)
    } else {
      postData = {
        id,
        content,
        imgPath: img ? img : '',
        creator: null
      }
    }
    this.http.put(`${this.BASE_URL}${id}`, postData).subscribe(res => {
      this.router.navigate(['/'])
    })
  }

  deletePost(postId: string) {
    return this.http.delete(`${this.BASE_URL}${postId}`)
  }
}
