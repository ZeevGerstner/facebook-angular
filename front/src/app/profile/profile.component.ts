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
    user
    myUserId: string
    isMyProfile = false
    userLoggin: boolean
    userPosts
    constructor(
        public route: ActivatedRoute,
        private authService: AuthService,
    ){}
    
    ngOnInit() {
        this.route.params.subscribe(param=>{
            this.authService.getUserById(param.userId)
            .subscribe(currUser => {
                this.user = currUser.user[0]
                this.checkProfile()
                console.log(this.user)
                this.getPosts()
            })
        })
        
    }
    checkProfile(){
        this.myUserId = localStorage.getItem('userId')
        if(this.myUserId) this.userLoggin = true
        else this.userLoggin = false
        if(this.myUserId === this.user._id) this.isMyProfile = true
        else this.isMyProfile = false
    }
    getPosts(){

    }
    followUser(){
        let updateUser = {
            userIdToUpdate: this.myUserId,
            userIdToIsert: this.user._id,
        }
        
        this.authService.updateUser(updateUser)
        .subscribe(console.log)
    }
}