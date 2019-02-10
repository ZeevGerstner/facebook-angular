import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { environment } from '../../../environments/environment'
import { AuthData } from '../../auth/auth-data.model'

@Injectable({ providedIn: 'root' })
export class SearchService {
  private BASE_URL: string = `${environment.apiUrl}/user/`
  users: AuthData[]

  constructor(private http: HttpClient) {}

  onSearchUsers(term) {
    return this.http.get<any>(`${this.BASE_URL}?search=${term}`)
  }
}
