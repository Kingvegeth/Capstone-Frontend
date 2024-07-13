import { Component, EventEmitter, Input, Output } from '@angular/core';
import { iGenre, iMovie } from '../../../models/imovie';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MovieService } from '../../../services/movie.service';
import { iPerson } from '../../../models/iperson';
import { iCompany } from '../../../models/icompany';
import { PersonService } from '../../../services/person.service';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-edit-movie-modal',
  templateUrl: './edit-movie-modal.component.html',
  styleUrl: './edit-movie-modal.component.scss'
})
export class EditMovieModalComponent {
  @Input() movie!: iMovie;
  @Output() movieUpdated = new EventEmitter<iMovie>();
  @Output() movieDeleted = new EventEmitter<number>();

  genres: string = '';
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

  constructor(
    public activeModal: NgbActiveModal,
    private movieService: MovieService,
    private personService: PersonService,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    console.log('Initializing EditMovieModalComponent');
    this.personService.getAllPeople().subscribe(data => {
      this.allPeople = data;
      console.log('All people loaded:', this.allPeople);
    });
    this.companyService.getAllCompanies().subscribe(data => {
      this.allCompanies = data;
      console.log('All companies loaded:', this.allCompanies);
    });

    this.selectedGenres = this.movie.genres.map(genre => genre as unknown as string);
    this.selectedCast = this.movie.cast?.map(person => person.id) || [];
    this.selectedDirectors = this.movie.directors?.map(person => person.id) || [];
    this.selectedScreenwriters = this.movie.screenwriters?.map(person => person.id) || [];
    this.selectedProducers = this.movie.producers?.map(company => company.id) || [];
    this.selectedDistributor = this.movie.distributor?.id || null;

    if (this.movie.posterImg) {
      this.previewUrl = this.movie.posterImg;
    }

    console.log('Initial movie data:', this.movie);
    console.log('Selected genres:', this.selectedGenres);
    console.log('Selected cast:', this.selectedCast);
    console.log('Selected directors:', this.selectedDirectors);
    console.log('Selected screenwriters:', this.selectedScreenwriters);
    console.log('Selected producers:', this.selectedProducers);
    console.log('Selected distributor:', this.selectedDistributor);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log('File selected:', this.selectedFile);

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        console.log('Preview URL:', this.previewUrl);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  addGenre() {
    if (this.selectedGenres.includes('')) return;
    this.selectedGenres.push('');
    console.log('Added new genre:', this.selectedGenres);
  }

  removeGenre(index: number) {
    this.selectedGenres.splice(index, 1);
    console.log('Removed genre at index', index, ':', this.selectedGenres);
  }

  updateMovie() {
    this.isLoading = true;
    console.log('Starting movie update');

    const updatedMovie = {
      ...this.movie,
      genres: this.selectedGenres.map(g => g.trim().toUpperCase() as unknown as iGenre),
      cast: this.selectedCast.map(id => ({ id } as iPerson)),
      directors: this.selectedDirectors.map(id => ({ id } as iPerson)),
      screenwriters: this.selectedScreenwriters.map(id => ({ id } as iPerson)),
      producers: this.selectedProducers.map(id => ({ id } as iCompany)),
      distributor: this.selectedDistributor ? { id: this.selectedDistributor } as iCompany : undefined
    };

    console.log('Updated movie data to be sent:', updatedMovie);

    if (this.selectedFile) {
      console.log('Uploading poster...');
      this.movieService.uploadPoster(this.movie.id!, this.selectedFile).subscribe(
        (response) => {
          updatedMovie.posterImg = response.posterImg;
          console.log('Poster uploaded successfully:', response.posterImg);
          this.saveMovie(updatedMovie);
        },
        (error) => {
          console.error('Error uploading poster:', error);
          this.isLoading = false;
        }
      );
    } else {
      this.saveMovie(updatedMovie);
    }
  }

  saveMovie(movie: iMovie) {
    console.log('Saving movie:', movie);
    this.movieService.updateMovie(this.movie.id!, movie).subscribe(
      (updatedMovie) => {
        console.log('Movie updated successfully:', updatedMovie);
        this.movieUpdated.emit(updatedMovie);
        this.isLoading = false;
        this.activeModal.close();
      },
      (error) => {
        console.error('Error updating movie:', error);
        this.isLoading = false;
      }
    );
  }

  deleteMovie() {
    if (confirm('Sei sicuro di voler eliminare questo film?')) {
      this.isLoading = true;
      console.log('Deleting movie with ID:', this.movie.id);
      this.movieService.deleteMovie(this.movie.id!).subscribe(
        () => {
          console.log('Movie deleted successfully');
          this.movieDeleted.emit(this.movie.id!);
          this.isLoading = false;
          this.activeModal.close();
        },
        (error) => {
          console.error('Error deleting movie:', error);
          this.isLoading = false;
        }
      );
    }
  }
}
