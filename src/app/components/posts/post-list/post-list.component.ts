import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../../../models/Post';
import { PostsService } from '../../../services/posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  private postsSub: Subscription;
  // posts = [
  //   { title: 'Title One', content: 'Content1' },
  //   { title: 'Title Two', content: 'Content2' },
  //   { title: 'Title Three', content: 'Content3' },
  //   { title: 'Title Four', content: 'Content4' }
  // ];
  @Input()
  posts: Post[] = [];
  constructor(private postsService: PostsService) {}

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((data: Post[]) => {
        this.posts = data;
      });
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
