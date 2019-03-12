import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../../../models/Post';
import { PostsService } from '../../../services/posts.service';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  panelOpenState = false;
  private postsSub: Subscription;
  isLoading: Boolean = true;
  // posts = [
  //   { title: 'Title One', content: 'Content1' },
  //   { title: 'Title Two', content: 'Content2' },
  //   { title: 'Title Three', content: 'Content3' },
  //   { title: 'Title Four', content: 'Content4' }
  // ];
  // @Input()
  posts: Post[] = [];
  totalPosts: number = 0;
  postsPerPage: number = 2;
  pageSizeOptions: number[] = [1, 2, 5, 10];
  currentPage: number = 1;
  constructor(private postsService: PostsService) {}

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(data => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangePage(event: PageEvent) {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.postsPerPage = event.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((data: {posts: Post[], postCount: number}) => {
        this.posts = data.posts;
        this.totalPosts = data.postCount;
        this.isLoading = false;
      });
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
