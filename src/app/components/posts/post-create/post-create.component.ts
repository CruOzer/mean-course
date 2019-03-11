import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../../../models/Post';
import { PostsService } from '../../../services/posts.service';

import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  private editMode: Boolean;
  private postId: string;
  form: FormGroup;
  post: Post;
  imagePreview: string;
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
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.isLoading = true;
      this.editMode = paramMap.has('postId');
      if (this.editMode) {
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = {
            id: postData.post._id,
            title: postData.post.title,
            content: postData.post.content,
            imagePath: postData.post.imagePath
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
          this.isLoading = false;
        });
      } else {
        this.postId = null;
        this.post = null;
        this.isLoading = false;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.editMode) {
      this.editPost(this.form);
    } else {
      this.addPost(this.form);
    }
    this.form.reset();
  }

  editPost(form: FormGroup) {
    this.postsService.updatePost(
      this.postId,
      form.value.title,
      form.value.content,
      form.value.image
    );
  }

  addPost(form: FormGroup) {
    console.log(this.form.value.image);

    this.postsService.addPost(
      form.value.title,
      form.value.content,
      this.form.value.image
    );
    // this.postCreated.emit(post);
  }
}
