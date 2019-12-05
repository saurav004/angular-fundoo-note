import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { LabelService } from 'src/app/service/label.service';
import { EditLabelComponent } from '../edit-label/edit-label.component';
import { ViewnoteComponent } from '../viewnote/viewnote.component'
import { UserService } from 'src/app/service/user.service';
import { NoteServiceService } from 'src/app/service/note-service.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private user_info = {};
  private labels;
  private allNotes = [];
  private list: Array<any>;
  username:string = 'admin';
  email: string = 'admin@gmail.com';
  profile_pic: string = 'assets/images/profile.jpg';

  token = localStorage.getItem('token');

  viewFlag={
    "noteFlag": true,
    "reminderFlag": false,
    "archiveFlag": false,
    "trashFlag": false
  }

  showNoteContent = true;
  constructor(private router: Router,
     private labelService: LabelService,
     private noteService: NoteServiceService,
     private userService: UserService, 
     private dialog: MatDialog
     ) { 
       console.log('constructor called');
     }


  ngOnInit() {
    console.log("oninit function called");
    
    this.getProfilePic();
    this.getLabel();
    this.noteList();
    console.log(this.viewFlag);
  }

  showView(show_me){
    Object.keys(this.viewFlag).forEach(v => this.viewFlag[v] = false);
    this.viewFlag[show_me] = true;
    console.log(this.viewFlag);
  }
  noteList(){
    this.noteService.getNotes(this.token).subscribe(
      response => {
        
        this.allNotes = response.data;
        console.log('This is response :', this.allNotes);
      },
      err => {
        this.allNotes = null;
        console.log(err);

      }
    );
  }
  getProfilePic(){
    this.userService.getProfilePic(this.token).subscribe(
      result => {
        this.user_info = result.data;
        console.log(this.user_info);
        this.username = this.user_info['username'];
        this.email = this.user_info['email'];
        this.profile_pic = this.user_info['image_url']
      },
      err => console.log('failed to load labels' + err)

    );
  }
  getLabel() {
  
    console.log("TOKEN : -> ",localStorage.getItem('token'))
    this.labelService.getLabels(this.token).subscribe(
      result => {
        console.log('these are lables++: -> ',result.data);
        this.labels = result.data;
      },
      err => console.log('failed to load labels' + err)

    );
  }

  openDialog() {
    const dialogRef = this.dialog.open(EditLabelComponent, {
      data: { name :this.labels}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`The dialog was closed: ${this.labels}`);
      // this.getLabel();
      // this.labels = result;
    });
  }
  signout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}