import { Injectable } from '@angular/core';

import { Post } from '../models/Post';

import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];

  private postsUpdated: Subject<Post[]> = new Subject<Post[]>();
  constructor() {}

  getPosts(): Post[] {
    return [...this.posts];
  }

  getPostUpdateListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: '', title: title, content: content };
    this.posts.unshift(post);
    this.postsUpdated.next([...this.posts]);
  }
}
