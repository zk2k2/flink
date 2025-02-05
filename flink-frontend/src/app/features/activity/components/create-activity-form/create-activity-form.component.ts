import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { ActivityService } from 'src/app/core/services/activity.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-activity-form',
  templateUrl: './create-activity-form.component.html',
  styleUrls: ['./create-activity-form.component.scss']
})
export class CreateActivityFormComponent implements OnInit, AfterViewInit {
  activityForm!: FormGroup;
  map!: L.Map;
  marker?: L.Marker;
  selectedFiles: File[] = [];
  photoPreviews: string[] = [];
  
  categories: any[] = [];
  private categoriesApiUrl = 'http://localhost:3000/category';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private activityService: ActivityService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
  }

  private initializeForm(): void {
    this.activityForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      locationName: ['', Validators.required],
      location: this.fb.group({
        latitude: [null, Validators.required],
        longitude: [null, Validators.required],
        name: ['']
      }),
      date: ['', Validators.required],
      time: ['', Validators.required],
      maxParticipants: ['', [Validators.required, Validators.min(1)]],
      category: ['', Validators.required]
    });
  }

  private loadCategories(): void {
    this.http.get<any[]>(this.categoriesApiUrl).subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
    const customIcon = L.icon({
      iconUrl: 'assets/marker.png',
      iconSize: [38, 50],
      iconAnchor: [19, 50],
      popupAnchor: [0, -50],
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng, { icon: customIcon }).addTo(this.map);
      }
      const locationName = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
      this.activityForm.patchValue({
        locationName,
        location: { latitude: lat, longitude: lng, name: locationName }
      });
    });
  }
  

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.selectedFiles = Array.from(target.files);
      this.photoPreviews = [];
      this.selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.photoPreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  onSubmit(): void {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      return;
    }

    const formValue = this.activityForm.value;
    const date = formValue.date;
    const time = formValue.time;
    const dateTime = new Date(`${date}T${time}`);

    const payload = {
      title: formValue.title,
      description: formValue.description,
      date: dateTime,
      nbOfParticipants: formValue.maxParticipants,
      categoryId: formValue.category,
      location: formValue.location 
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));
    this.selectedFiles.forEach(file => {
      formData.append('photos', file);
    });

    this.activityService.createActivity(formData).subscribe({
      next: (activity) => {
        console.log('Activity created successfully', activity);
        this.router.navigate(['/feed']);
      },
      error: (err) => {
        console.error('Error creating activity', err);
      }
    });
  }

  onCancel(): void {
    this.activityForm.reset();
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = undefined;
    }
    this.photoPreviews = [];
    this.selectedFiles = [];
  }
}
