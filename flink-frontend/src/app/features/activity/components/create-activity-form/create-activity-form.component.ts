import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-activity-form',
  templateUrl: './create-activity-form.component.html',
  styleUrls: ['./create-activity-form.component.scss'],
})
export class CreateActivityFormComponent implements OnInit {
  activityForm!: FormGroup; // Use definite assignment

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activityForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      location: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      maxParticipants: ['', [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.activityForm.valid) {
      console.log('Form Submitted', this.activityForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  onCancel(): void {
    this.activityForm.reset();
  }
}
