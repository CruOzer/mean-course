import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../../../models/Post';
import { PostsService } from '../../../services/posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  private editMode: Boolean;
  private postId: string;
  post: Post;
  isLoading: Boolean = true;
  // enteredContent: string = '';
  // enteredTitle: string = '';
  // @Output()
  // postCreated: EventEmitter<Post> = new EventEmitter();

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.isLoading = true;
      this.editMode = paramMap.has('postId');
      if (this.editMode) {
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = {
            id: postData.post._id,
            title: postData.post.title,
            content: postData.post.content
          };
          this.isLoading = false;
        });
      } else {
        this.postId = null;
        this.post = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.editMode) {
      this.editPost(form);
    } else {
      this.addPost(form);
    }
  }

  editPost(form: NgForm) {
    this.postsService.updatePost(
      this.postId,
      form.value.title,
      form.value.content
    );
  }

  addPost(form: NgForm) {
    this.postsService.addPost(form.value.title, form.value.content);
    // this.postCreated.emit(post);
  }
}
