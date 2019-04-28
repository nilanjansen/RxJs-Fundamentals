import { Component } from '@angular/core';
import { interval, Observable } from 'rxjs';

import { take,map } from 'rxjs/operators';
import { mergeMap,tap,switchMap,debounceTime,distinctUntilChanged } from 'rxjs/operators';
import { Subject,of,fromEvent } from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'rxjs';
  searchSubject$=new Subject<string>();
  results$:Observable<any>;
  /**
   *
   */
  constructor(private http:HttpClient) {
  }

  ngOnInit() { 
    this.results$ = this.searchSubject$
      .pipe(debounceTime(200))
      .pipe(distinctUntilChanged())
      .pipe(tap(x => console.log('do', x)))
      .pipe(switchMap(searchString => this.queryAPI(searchString)));

  }
  ngOnDestroy(){
    
  }
  queryAPI(searchString){
    console.log('queryAPI',searchString);
    return this.http.get(`https://www.reddit.com/r/aww/search.json?q=${searchString}`)
    .pipe(map(result=>result['data']['children']));
  }
  inputChanged($event){
    this.searchSubject$.next($event);
    console.log('input changed',$event);
  }
  
   
}
