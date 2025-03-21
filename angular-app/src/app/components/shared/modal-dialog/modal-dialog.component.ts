import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-dialog.component.html',
  styleUrl: './modal-dialog.component.css',
})
export class ModalDialogComponent {
  isShowModal = false;
  parentSavedValue: any;
  @Input()
  title = '';
  @Input()
  message = '';
  @Input()
  hasOkButton = true;
  @Input()
  okButtonClass = 'btn-danger';
  @Input()
  hasYesButton = false;
  @Input()
  yesButtonClass = 'btn-success';
  @Input()
  hasNoButton = false;
  @Input()
  noButtonClass = 'btn-danger';

  @Output() okButtonClicked: EventEmitter<any> = new EventEmitter();
  @Output() yesButtonClicked: EventEmitter<any> = new EventEmitter();
  @Output() noButtonClicked: EventEmitter<any> = new EventEmitter();

  okButtonClick() {
    this.isShowModal = false;
    this.okButtonClicked.emit();
  }

  yesButtonClick() {
    this.isShowModal = false;
    this.yesButtonClicked.emit(this.parentSavedValue);
  }

  noButtonClick() {
    this.isShowModal = false;
    this.noButtonClicked.emit();
  }

  showModal(value?: any) {
    this.parentSavedValue = value;
    this.isShowModal = true;
  }
}
