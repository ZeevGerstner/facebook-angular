import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { AuthService } from '../auth/auth.service'
import { AuthData } from '../auth/auth-data.model'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: { _id: string }
  myUserId: string
  userLoggin: boolean
  isMyProfile = false

  constructor(
    public route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {

    this.route.params.subscribe(({userId}) => {
      this.authService.getUserById(userId)
        .subscribe(currUser => {
        [this.user] = currUser.user
        this.checkProfile()
      })
    })
  }
  checkProfile() {
    this.myUserId = localStorage.getItem('userId')
    if (this.myUserId) this.userLoggin = true
    if (this.myUserId === this.user._id) this.isMyProfile = true
  }
  followUser() {
    let updateUser = {
      followedByUserId: this.myUserId,
      followingOnUserId: this.user._id
    }

    this.authService.updateUser(updateUser).subscribe(console.log)
  }
}
