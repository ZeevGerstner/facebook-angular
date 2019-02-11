import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'

import { Subject, BehaviorSubject } from 'rxjs'
import { map, tap } from 'rxjs/operators'

import { environment } from '../../../environments/environment'
import { Post } from '../post.model'
import { RawPostData } from '../models/raw-post-data.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private BASE_URL: string = `${environment.apiUrl}/posts/`
  private posts: Post[] = []
  postsUpdated = new BehaviorSubject<{ posts: Post[]; postCount: number }>({ posts: [], postCount: 0 })

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postPerPage?: number, currPage?: number, userId?: string) {
    const queryParams = `?pageSize=${postPerPage}&page=${currPage}`
    console.log('asasasasasa', userId)
    let feedUserId
    (userId) ? feedUserId = `feed/${userId}` : ''
    this.http
      .get<{ message: string; posts: Post[]; maxPosts: number }>(
        `${this.BASE_URL}${feedUserId}${queryParams}`
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

  addPost({ content, imgPath }: RawPostData) {
    const postData = new FormData()
    postData.append('content', content)
    if (imgPath) postData.append('img', imgPath)

    return this.http
      .post<{ message: string; post: Post }>(this.BASE_URL, postData)
    // .pipe(tap(() => this.getPosts()))
  }

  updatedPost(id: string, content: string, img?: string) {
    let postData: Post | FormData
    postData = new FormData()
    postData.append('id', id)
    postData.append('content', content)
    postData = {
      id,
      content,
      imgPath: img ? img : '',
      creator: null
    }
    return this.http.put(`${this.BASE_URL}${id}`, postData)
  }

  deletePost(postId: string) {
    return this.http.delete(`${this.BASE_URL}${postId}`)
  }

  likePost(postId: string, userId: string) {
    const likePostData = { postId, userId }
    return this.http.put(`${this.BASE_URL}like`, likePostData)
  }
}
