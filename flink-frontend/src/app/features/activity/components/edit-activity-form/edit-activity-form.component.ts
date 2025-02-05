import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { ActivityService } from 'src/app/core/services/activity.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-activity-form',
  templateUrl: './edit-activity-form.component.html',
  styleUrls: ['./edit-activity-form.component.scss'],
})
export class EditActivityFormComponent implements OnInit, AfterViewInit {
  activityForm!: FormGroup;
  map!: L.Map;
  marker?: L.Marker;
  selectedFiles: File[] = [];
  photoPreviews: string[] = [];
  categories: any[] = [];
  private categoriesApiUrl = 'http://localhost:3000/category';
  activityId!: string;
  currentActivity: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private activityService: ActivityService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.activityId = this.route.snapshot.paramMap.get('id')!;
    this.initializeForm();
    this.loadCategories();
    this.loadActivity();
  }

  private initializeForm(): void {
    this.activityForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      locationName: ['', Validators.required],
      location: this.fb.group({
        latitude: [null, Validators.required],
        longitude: [null, Validators.required],
        name: ['', Validators.required],
      }),
      date: ['', Validators.required],
      time: ['', Validators.required],
      maxParticipants: ['', [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
    });
  }

  private loadCategories(): void {
    this.http.get<any[]>(this.categoriesApiUrl).subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading categories:', err),
    });
  }

  private loadActivity(): void {
    this.activityService.getActivityById(this.activityId).subscribe({
      next: (activity) => {
        this.currentActivity = activity;
        this.patchFormValues(activity);
      },
      error: (err) => console.error('Error loading activity:', err),
    });
  }

  private patchFormValues(activity: any): void {
    const date = new Date(activity.date);
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = date.toTimeString().split(' ')[0];

    this.activityForm.patchValue({
      title: activity.title,
      description: activity.description,
      locationName: activity.location.name,
      location: {
        latitude: activity.location.latitude,
        longitude: activity.location.longitude,
        name: activity.location.name,
      },
      date: formattedDate,
      time: formattedTime,
      maxParticipants: activity.nbOfParticipants,
      category: activity.categoryId,
    });

    if (activity.photos) {
      this.photoPreviews = activity.photos;
    }

    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = L.marker(
      [activity.location.latitude, activity.location.longitude],
      {
        icon: L.icon({
          iconUrl: 'assets/marker.png',
          iconSize: [38, 50],
          iconAnchor: [19, 50],
          popupAnchor: [0, -50],
        }),
      }
    ).addTo(this.map);
    this.map.setView(
      [activity.location.latitude, activity.location.longitude],
      13
    );
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
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
      this.fetchAddress(lat, lng);
    });
  }

  private fetchAddress(lat: number, lng: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (data && data.display_name) {
          this.activityForm.patchValue({
            locationName: data.display_name,
            location: {
              latitude: lat,
              longitude: lng,
              name: data.display_name,
            },
          });
        }
      },
      error: (err) => console.error('Error fetching address:', err),
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.selectedFiles = Array.from(target.files);
      this.photoPreviews = [];
      this.selectedFiles.forEach((file) => {
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
      location: formValue.location,
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));
    this.selectedFiles.forEach((file) => {
      formData.append('photos', file);
    });

    this.activityService.updateActivity(this.activityId, formData).subscribe({
      next: (activity) => {
        console.log('Activity updated successfully', activity);
        this.router.navigate(['/activity', activity.id]);
      },
      error: (err) => {
        console.error('Error updating activity', err);
      },
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
