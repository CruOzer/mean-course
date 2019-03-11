import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Post } from '../models/Post';

import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];

  private postsUpdated: Subject<Post[]> = new Subject<Post[]>();
  constructor(private httpClient: HttpClient) {}

  getPosts() {
    this.httpClient
      .get<{ message: string; posts: any }>('http://localhost:5000/api/posts')
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
            };
          });
        })
      )
      .subscribe(
        data => {
          this.posts = data;
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
      .post<{ message: string }>('http://localhost:5000/api/posts', post)
      .subscribe(data => {
        console.log(data.message);
        this.posts.unshift(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(id: string) {
    this.httpClient
      .delete<{ message: string }>('http://localhost:5000/api/posts/' + id)
      .subscribe(data => {
        console.log(data.message);
      });
  }
}
