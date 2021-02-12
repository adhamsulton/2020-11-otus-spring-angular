import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Author, Book, Genre } from '../models/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private baseUrl = 'http://localhost:4200';

  constructor(private http: HttpClient) {}

  getBookList(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/books`);
  }

  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(`${this.baseUrl}` + '/books', book);
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/books/${id}`);
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/books/${id}`);
  }

  updateBook(value: any): Observable<Object> {
    return this.http.post(`${this.baseUrl}/books`, value);
  }

  getGenreList(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.baseUrl}/genres`);
  }

  getAuthorsList(): Observable<Author[]> {
    return this.http.get<Author[]>(`${this.baseUrl}/authors`);
  }
}
