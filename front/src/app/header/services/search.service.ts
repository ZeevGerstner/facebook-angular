import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { environment } from '../../../environments/environment'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AuthData } from '../../auth/auth-data.model'
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
    private BASE_URL: string = `${environment.apiUrl}/user/`
    users: AuthData[]
    private searchTxt = new Subject<string>()

    constructor(private http: HttpClient) { }

    onSearchUsers(val) {
        return this.http.get<any>(`${this.BASE_URL}?search=${val}`)
    }
}