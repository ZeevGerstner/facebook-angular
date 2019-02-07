import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { Subscription } from 'rxjs'
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators'

import { AuthService } from '../auth/auth.service'
import { SearchService } from './services/search.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false
  usersSearch = []
  searchForm = new FormGroup({
    searchValue: new FormControl('')
  })
  private authListenerSub: Subscription

  constructor(
    private authService: AuthService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth()
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe(
        isAuthenticated => (this.userIsAuthenticated = isAuthenticated)
      )

    this.searchForm.controls.searchValue.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(term => this.searchService.onSearchUsers(term))
      )
      .subscribe(res => {
        this.usersSearch = res.users
      })
  }

  onLogout() {
    this.authService.logout()
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe()
  }
}
