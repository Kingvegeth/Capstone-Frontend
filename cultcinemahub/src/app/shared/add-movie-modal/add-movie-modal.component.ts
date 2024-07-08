import { Component, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { iMovie, iGenre } from '../../models/imovie';
import { MovieService } from '../../services/movie.service';
import { iPerson } from '../../models/iperson';
import { iCompany } from '../../models/icompany';
import { PersonService } from '../../services/person.service';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-add-movie-modal',
  templateUrl: './add-movie-modal.component.html',
  styleUrls: ['./add-movie-modal.component.scss']
})
export class AddMovieModalComponent {
  movie: Partial<iMovie> = {};
  genres: string[] = [];
  selectedGenres: string[] = [];
  allGenres: string[] = [
    'ACTION', 'ADVENTURE', 'ANIMATION', 'BIOGRAPHY', 'COMEDY', 'CRIME',
    'DOCUMENTARY', 'DRAMA', 'FANTASY', 'HORROR', 'MUSICAL', 'SCI_FI', 'THRILLER'
  ];
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isLoading: boolean = false;
  allPeople: iPerson[] = [];
  allCompanies: iCompany[] = [];

  selectedCast: number[] = [];
  selectedDirectors: number[] = [];
  selectedScreenwriters: number[] = [];
  selectedProducers: number[] = [];
  selectedDistributor: number | null = null;

  @Output() movieAdded = new EventEmitter<iMovie>();

  constructor(
    public activeModal: NgbActiveModal,
    private movieService: MovieService,
    private personService: PersonService,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.personService.getAllPeople().subscribe(data => this.allPeople = data);
    this.companyService.getAllCompanies().subscribe(data => this.allCompanies = data);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  addMovie() {
    if (!this.movie.title || !this.movie.year || !this.movie.duration || !this.movie.description) {
      console.error('Please fill all required fields');
      console.log('Missing Fields:', {
        title: this.movie.title,
        year: this.movie.year,
        duration: this.movie.duration,
        description: this.movie.description
      });
      return;
    }

    this.isLoading = true;

    const newMovie: iMovie = {
      title: this.movie.title!,
      year: this.movie.year!,
      duration: this.movie.duration!,
      description: this.movie.description!,
      genres: this.selectedGenres.map(g => g.trim().toUpperCase() as iGenre),
      posterImg: this.movie.posterImg || '',
      cast: this.selectedCast.map(id => ({ id } as iPerson)),
      directors: this.selectedDirectors.map(id => ({ id } as iPerson)),
      screenwriters: this.selectedScreenwriters.map(id => ({ id } as iPerson)),
      producers: this.selectedProducers.map(id => ({ id } as iCompany)),
      distributor: this.selectedDistributor ? { id: this.selectedDistributor } as iCompany : undefined
    };

    console.log('Creating movie with data:', newMovie);

    this.movieService.createMovie(newMovie).subscribe(
      (createdMovie) => {
        this.movieAdded.emit(createdMovie);
        this.activeModal.close();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error creating movie:', error);
        this.isLoading = false;
      }
    );
  }
}
