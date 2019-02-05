import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { AuthService } from '../auth/auth.service'
import { FormGroup, FormControl } from '@angular/forms'
import { SearchService } from './services/search.service'
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false
  private authListenerSub: Subscription
  constructor(
    private authService: AuthService,
    private searchService: SearchService
  ) { }
  searchForm = new FormGroup({
    searchValue: new FormControl('')
  });
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
        tap(t => console.log('term is ' + t)),
        switchMap(term => this.searchService.onSearchUsers(term))
      ).subscribe(console.log)
  }

  onLogout() {
    this.authService.logout()
  }
  ngOnDestroy() {
    this.authListenerSub.unsubscribe()
  }
}
