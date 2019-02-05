import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { Post } from '../post.model'
import { Subscription } from 'rxjs'


@Component({
    selector: 'app-post-preview',
    templateUrl: './post-preview.component.html',
    styleUrls: ['./post-preview.component.scss']
})

export class postPreviewComponent implements OnInit, OnDestroy {


    @Input() post: Post
    @Input() userIsAuthenticated: boolean
    @Input() userId: string

    constructor(
        
    ) { }

    ngOnInit() {
       

    }
    ngOnDestroy() {
    }

}