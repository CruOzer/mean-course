import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Post } from "../models/Post";

import { Subject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { post } from "selenium-webdriver/http";

@Injectable({
  providedIn: "root"
})
export class PostsService {
  private posts: Post[] = [];

  private postsUpdated: Subject<Post[]> = new Subject<Post[]>();
  constructor(private httpClient: HttpClient, private router: Router) {}

  getPosts() {
    this.httpClient
      .get<{ message: string; posts: any }>("http://localhost:5000/api/posts")
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
          });
        })
      )
      .subscribe(
        (data: Post[]) => {
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

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.httpClient
      .post<{ message: string; post: Post }>(
        "http://localhost:5000/api/posts",
        postData
      )
      .subscribe(data => {
        this.posts.push(data.post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(id: string) {
    this.httpClient
      .delete<{ message: string }>("http://localhost:5000/api/posts/" + id)
      .subscribe(data => {
        const updatedPosts = this.posts.filter(post => post.id !== id);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image
      };
    }

    this.httpClient
      .put<{ message: string }>(
        "http://localhost:5000/api/posts/" + id,
        postData
      )
      .subscribe(data => {
        const updatePosts = [...this.posts];
        const oldPostIndex = updatePosts.findIndex(p => p.id === id);
        const post: Post = {
          id,
          title,
          content,
          imagePath: "data.imagePath"
        };
        updatePosts[oldPostIndex] = post;
        this.posts = updatePosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  getPost(
    id: string
  ): Observable<{
    message: string;
    post: { _id: string; title: string; content: string; imagePath: string };
  }> {
    return this.httpClient.get<{
      message: string;
      post: { _id: string; title: string; content: string; imagePath: string };
    }>("http://localhost:5000/api/posts/" + id);
  }
}
