import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NoteServiceService } from './note-service.service';
import { LabelService } from './label.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  public all_notes: any[];
  public all_labels: any[];
  public token = localStorage.getItem('token');

  private messageSource = new BehaviorSubject<any>(this.all_notes);
  private labelSource = new BehaviorSubject<any>(this.all_labels);
  currentMessage = this.messageSource.asObservable();
  currentLabels = this.labelSource.asObservable();

  constructor(
    private noteservice: NoteServiceService, 
    private lableservices: LabelService,
    private router: Router
    ) {
    this.get_all_note()
    this.get_all_label()
  }

  // Function for get all notes
  get_all_note() {
    this.noteservice.getNotes(this.token).subscribe(
      result => {
        this.all_notes = result.data;
        this.changeMessage(this.all_notes);
        console.log('result in data services', result)
      },
      err => {
        if(err.status == 401)
        {
          localStorage.clear();
          this.router.navigate(['/login']);
          alert(err.error.messages[0].message);        
        }
      }
    );
  }

  //Function for get all labels
  get_all_label() {
    this.lableservices.getLabels(this.token).subscribe(
      result => {
        this.all_labels = result.data;
        this.changeLables(this.all_labels);
        // console.log(result)
      },
      err => {
        if(err.status == 401)
        {
          localStorage.clear();
          this.router.navigate(['/login']);
          alert(err.error.messages[0].message);        
        }
      }
    );
  }


  //function for next change of message data
  changeMessage(message: any) {
    this.messageSource.next(message)
  }

  //function for next change of label data
  changeLables(message: any) {
    this.labelSource.next(message)
  }

}