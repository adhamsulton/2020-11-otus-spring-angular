import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { BookService } from '../shared/services/book.service';
import { Author, Book, Genre } from '../shared/models/book';
import { Subject, Subscription } from 'rxjs';

import { FormControl, FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@UntilDestroy()
@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  providers: [BsModalService],
})
export class BookListComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;

  booksArray: any[] = [];
  dtTrigger: Subject<any> = new Subject();

  books: Book[];
  book: Book = new Book();
  deleteMessage = false;
  isupdated = false;
  genres: Genre[];
  authors: Author[];

  bookupdateForm: FormGroup;

  subscription: Subscription = new Subscription();

  constructor(
    private bookservice: BookService,
    private modalService: BsModalService
  ) {
    this.bookupdateForm = new FormGroup({
      id: new FormControl(),
      name: new FormControl(),
      genre: new FormControl(),
      author: new FormControl(),
    });
  }

  ngOnInit() {
    console.log('onInit');

    this.isupdated = false;

    this.bookservice.getBookList().subscribe((data) => {
      this.books = data;
      console.log('newbook', this.books);

      this.dtTrigger.next();
    });
    this.bookservice.getGenreList().subscribe((data) => {
      this.genres = data;
      console.log('mylist', this.genres);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openModal(template: TemplateRef<any>, id: number = null) {
    console.log(template);

    this.modalRef = this.modalService.show(template);

    if (!this.authors) {
      this.bookservice
        .getAuthorsList()
        .subscribe((authors) => (this.authors = authors));
    }

    if (id) {
      this.bookservice
        .getBook(id)
        .pipe(untilDestroyed(this))
        .subscribe(
          ({ id, name, genre, authorList }: any) => {
            const author = authorList.map((auth) => auth.id);

            this.bookupdateForm.patchValue({
              id: id,
              name: name,
              genre: genre.id,
              author,
            });
          },
          (error) => console.log(error)
        );
    } else {
      this.bookupdateForm.patchValue({
        id: null,
        name: '',
        genre: null,
        author: null,
      });
    }
  }

  deleteBook(id: number) {
    this.bookservice
      .deleteBook(id)
      .pipe(untilDestroyed(this))
      .subscribe(
        (data) => {
          console.log(data);
          this.deleteMessage = true;
          this.bookservice
            .getBookList()
            .pipe(untilDestroyed(this))
            .subscribe((data) => {
              this.books = data;
            });
        },
        (error) => console.log(error)
      );
  }

  updateBook(id: number = null) {}

  addBook(): void {
    console.log('add');
    this.updateBook();
  }

  saveBook() {
    const { id, name, author, genre } = this.bookupdateForm.value;
    let dto = { id, name, genreId: genre, authorIds: author };

    this.bookservice.updateBook(dto).subscribe(
      (data) => {
        this.isupdated = true;
        this.bookservice
          .getBookList()
          .pipe(untilDestroyed(this))
          .subscribe((data) => {
            this.books = data;
          });
      },
      (error) => console.log(error)
    );
    this.modalRef.hide();
  }

  changeisUpdate() {
    this.modalRef.hide();
    this.isupdated = false;
  }

  authList(authors): string {
    return authors.map(({ fullName }, idx) => {
      return idx !== authors.length - 1 ? fullName + ', ' : fullName;
    });
  }
}
