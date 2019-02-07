import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { environment } from '../../environments/environment'
import { AuthData } from './auth-data.model'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private BASE_URL: string = `${environment.apiUrl}/user/`
  private isAuthenticated = false
  private token: string
  private tokenTimer: any
  private userId: string
  private authStatusListener = new Subject<boolean>()

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token
  }

  getIsAuth() {
    return this.isAuthenticated
  }

  getUserId() {
    return this.userId
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable()
  }

  createUser(email: string, password: string, userName: string) {
    const authData: AuthData = { email, password, userName }
    this.http
      .post(`${this.BASE_URL}signup`, authData)
      .subscribe(
        res => this.router.navigate(['/']),
        err => this.authStatusListener.next(false)
      )
  }

  getUser() {
    console.log('service',this.BASE_URL);
    this.http.get(`${this.BASE_URL}`)

  }

  autoAuthUser() {
    const authInfo = this.getAuthData()
    if (!authInfo) return
    const now = new Date()
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime()
    if (expiresIn > 0) {
      this.token = authInfo.token
      this.isAuthenticated = true
      this.userId = authInfo.userId
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusListener.next(true)
    }
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password }
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        `${this.BASE_URL}login`,
        authData
      )
      .subscribe(
        res => {
          const token = res.token
          this.token = token
          if (token) {
            const expiresInDuration = res.expiresIn
            this.setAuthTimer(expiresInDuration)
            this.isAuthenticated = true
            this.userId = res.userId
            this.authStatusListener.next(true)
            const now = new Date()
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            )
            this.saveAuthData(token, expirationDate, this.userId)
            this.router.navigate(['/'])
          }
        },
        err => {
          this.authStatusListener.next(false)
        }
      )
  }

  logout() {
    this.token = null
    this.isAuthenticated = false
    this.authStatusListener.next(false)
    this.router.navigate(['/'])
    this.userId = null
    this.clearAuthData()
    clearTimeout(this.tokenTimer)
  }

  getUserById(userId: string) {
    return this.http.get<any>(`${this.BASE_URL}?userId=${userId}`)
  }

  updateUser(updateUser){
    console.log(updateUser)
    return this.http.put(`${this.BASE_URL}update`, updateUser)

  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout()
    }, duration * 1000)
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token)
    localStorage.setItem('expiration', expirationDate.toISOString())
    localStorage.setItem('userId', userId)
  }

  private clearAuthData() {
    localStorage.removeItem('token')
    localStorage.removeItem('expiration')
    localStorage.removeItem('userId')
  }

  private getAuthData() {
    const token = localStorage.getItem('token')
    const expirationDate = localStorage.getItem('expiration')
    const userId = localStorage.getItem('userId')
    if (!token || !expirationDate) return
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId
    }
  }
}
