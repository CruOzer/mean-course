import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Post } from '../models/Post';

import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];

  private postsUpdated: Subject<Post[]> = new Subject<Post[]>();
  constructor(private httpClient: HttpClient) {}

  getPosts() {
    this.httpClient
      .get<{ message: string; posts: Post[] }>(
        'http://localhost:3000/api/posts'
      )
      .subscribe(
        data => {
          console.log(data.message);
          this.posts = data.posts;
          this.postsUpdated.next([...this.posts]);
        },
        err => {
          console.log(err);
        }
      );
  }

  getPostUpdateListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: '', title: title, content: content };
    this.httpClient
      .post<{ message: string }>('http://localhost:3000/api/posts', post)
      .subscribe(data => {
        console.log(data.message);
        this.posts.unshift(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
