import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Post } from './Post';

import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

const BACKEND_URL: string = environment.apiUrl + '/posts';
@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];

  private postsUpdated: Subject<{
    posts: Post[];
    postCount: number;
  }> = new Subject<{ posts: Post[]; postCount: number }>();
  constructor(private httpClient: HttpClient, private router: Router) {}

  getPosts(postPerPage: number, currentPage: number) {
    const queryParam: string = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.httpClient
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParam
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts,
            message: postData.message
          };
        })
      )
      .subscribe(
        (data: { posts: Post[]; maxPosts: number; message: string }) => {
          this.posts = data.posts;
          this.postsUpdated.next({
            posts: [...this.posts],
            postCount: data.maxPosts
          });
        },
        err => {
          console.log(err);
        }
      );
  }

  getPostUpdateListener(): Observable<{ posts: Post[]; postCount: number }> {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.httpClient
      .post<{ message: string; post: Post }>(BACKEND_URL, postData)
      .subscribe(data => {
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    return this.httpClient.delete<{ message: string }>(BACKEND_URL + '/' + id);
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image,
        creator: null
      };
    }

    this.httpClient
      .put<{ message: string }>(BACKEND_URL + '/' + id, postData)
      .subscribe(data => {
        this.router.navigate(['/']);
      });
  }

  getPost(
    id: string
  ): Observable<{
    message: string;
    post: {
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    };
  }> {
    return this.httpClient.get<{
      message: string;
      post: {
        _id: string;
        title: string;
        content: string;
        imagePath: string;
        creator: string;
      };
    }>(BACKEND_URL + '/' + id);
  }
}
