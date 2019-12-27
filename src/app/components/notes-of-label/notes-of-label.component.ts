import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { NoteServiceService } from 'src/app/service/note-service.service';
import { ActivatedRoute } from '@angular/router';
import { Note } from 'src/app/models/note';
import { Label } from 'src/app/models/label';
import { MatDialog } from '@angular/material';
import { DataService } from 'src/app/service/data.service';
import { DatePipe } from '@angular/common';
import { EditNoteComponent } from '../edit-note/edit-note.component';
import { CollaborateComponent } from '../collaborate/collaborate.component';

@Component({
  selector: 'app-notes-of-label',
  templateUrl: './notes-of-label.component.html',
  styleUrls: ['./notes-of-label.component.scss'],
  providers: [DatePipe]
})
export class NotesOfLabelComponent implements OnInit, OnChanges {

  // dummy() {
  //   // private notes: any;
  //   // private token = localStorage.getItem('token');
  //   // @Input() labelId: number;

  private datetimereminder = new Date(Date.now());

  private getNote: Note[] = [];
  private allLabels: Label[];
  private noteIdTemp: number;
  private reminderData: string;
  private viewListGrid = false;
  public gridListView = false;
  public data = {
    dataForUpdate: {},
    urlCridetial: Note
  };

  // @Input() viewListGrid: boolean;
  @Input() labelId: number;

  @Output() childmessage = new EventEmitter<any>();


  constructor(
    public dialog: MatDialog,
    private dataservice: DataService,
    private datePipe: DatePipe,
    private noteservice: NoteServiceService
  ) {
  }

  ngOnChanges() {
        this.getLabelsNotes();
      }

  ngOnInit() {
    // this.dataservice.currentMessage.subscribe(notes => this.getNote = notes);
    this.dataservice.currentLabels.subscribe(labels => this.allLabels = labels);
  }

  getLabelsNotes() {
        console.log(this.labelId);
        this.noteservice.getLabelsNote(this.labelId, localStorage.getItem('token')).subscribe(
          result => {
            this.getNote = result.data;
            console.log(result);
          },
          err => {
            console.log(err);
          }
        );
      }

  setPinNote(note) {
    const data = {
      dataForUpdate: {is_pin: !note.is_pin},
      urlCridetial: note
    };
    console.log(data);

    this.childmessage.emit(data);
  }
  setReminder(note) {
    const data = {
      dataForUpdate: {reminder: this.datePipe.transform(this.datetimereminder.toISOString(), 'yyyy-MM-dd HH:mm:ss')},
      urlCridetial: note
    };
    console.log(typeof data.dataForUpdate.reminder);
    console.log(this.datePipe.transform(this.datetimereminder.toISOString(), 'yyyy-MM-dd HH:mm:ss'));
    this.childmessage.emit(data);
  }

  getReminder(reminder) {
    if (reminder !== null && ((Date.parse(reminder) / 1000) - (Date.now() / 1000)) > 0) {
      this.reminderData =  this.datePipe.transform(reminder, 'd MMM hh:mm a  ');
      return true;
    }
    return false;
  }

  sendMessage(note, detail) {
    const data = {
      reminder: note,
      noteDetail: detail
    };
    this.childmessage.emit(data);
  }

  addedLabel(note, updatelabel) {
    let noteLabels = note.label;
    if (noteLabels.includes(updatelabel)) {
      noteLabels = noteLabels.filter(label => label !== updatelabel);
      this.data.dataForUpdate = { label: noteLabels};
      this.data.urlCridetial = note;
      console.log('if : ', this.data);
    } else {
      noteLabels = noteLabels.concat([updatelabel]);
      this.data.dataForUpdate = { label: noteLabels};
      this.data.urlCridetial = note;
      console.log('else : ', this.data);
    }
    this.childmessage.emit(this.data);
  }

  removeLable(note, labelToDelete) {
    let labelList = [...note.label];
    labelList = labelList.filter(label => label !== labelToDelete);
    // remove label form note and update note with updated labels
    console.log('remove this label', labelToDelete, labelList);
    const data = {
      dataForUpdate: { label: labelList },
      urlCridetial: note
    };
    this.childmessage.emit(data);
  }

  addLabel(note, newLabel) {
    const labelList = [...note.label];
    labelList.push(newLabel);
    // add label into note and update note with updated labels
    console.log('add this label', newLabel);
    const data = {
      dataForUpdate: { label: labelList },
      urlCridetial: note
    };
    this.childmessage.emit(data);
  }


  moveTrash(note) {
    console.log(note);
    const noteDetail = {
      is_trashed: true
    };
    this.data.dataForUpdate = noteDetail;
    this.data.urlCridetial = note;
    this.childmessage.emit(this.data);
  }


  changeList() {
    let style = {};
    if (this.viewListGrid) {
      style = {
        width: '100%',
        'flex-flow': 'column',
        'box-sizing': 'border-box',
        'flex-direction': 'column',
        'max-width': '100%'
      };
    } else if (window.innerWidth >= 600 && window.innerWidth < 900) {
      style = {
        'flex-flow': 'row',
        'box-sizing': 'border-box',
        'flex-direction': 'row',
        'max-width': '50%'
      };
    } else if (window.innerWidth >= 900) {
      style = {
        'flex-flow': 'row',
        'box-sizing': 'border-box',
        'flex-direction': 'row',
        'max-width': '33%'
      };
    }
    return style;
  }
  noteColor(color) {
    const style = {
      'background-color': color
    };
    return style;
  }

  archiveNote(note) {
    const noteDetail = {
      is_archive: true
    };

    this.data.dataForUpdate = noteDetail;
    this.data.urlCridetial = note;
    this.childmessage.emit(this.data);
  }

  changeColor(note, color) {
    const noteDetail = {
    change_color: color
    };
    console.log(color);
    const data = {
      dataForUpdate: noteDetail,
      urlCridetial: note
    };
    this.childmessage.emit(data);
  }
  getFile(note) {
    this.noteIdTemp = note;
    document.getElementById('setNoteImage').click();
  }

  onFileSelected(target) {
    const noteImage = target.files[0];
    const uploadData = new FormData();
    uploadData.append('image', noteImage, noteImage.name);
    const data = {
      dataForUpdate: uploadData,
      urlCridetial: this.noteIdTemp
    };
    this.childmessage.emit(data);
  }

  test(noteId) {
    console.log('test method', noteId);

  }

  openDialog(note) {
    const dialogRef = this.dialog.open(EditNoteComponent,
      {
        panelClass: 'edit-note-no-padding-dialog',
        height: 'auto',
        width: '50%',
        data: note,
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (Object.getOwnPropertyNames(result).length > 0) {
        const data = {
          dataForUpdate: result,
          urlCridetial: note
        };
        this.childmessage.emit(data);
      }
      console.log('The dialog has been closed and result is ', result);
    });
  }

  openCollaborateDialog(note) {
    const dialogRef = this.dialog.open(CollaborateComponent,
      {
        data: note,
      }
    );
    dialogRef.afterClosed().subscribe(result => {

      if (result !== undefined) {
        if (note.collaborate.length !== result.length) {
          const data = {
            dataForUpdate: {collaborate: result},
            urlCridetial: note
          };
          this.childmessage.emit(data);
        }
      }
      console.log('Dialog box closed and result is ', result);
    },
      err => {
        console.log('Some thing is wrong: ', err);
      });
  }
}
