import { Component, EventEmitter, Input, Output } from '@angular/core';
import { iGenre, iMovie } from '../../models/imovie';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MovieService } from '../../services/movie.service';

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

  constructor(public activeModal: NgbActiveModal, private movieService: MovieService) {}

  ngOnInit() {

    this.selectedGenres = this.movie.genres.map(genre => genre as unknown as string);

    if (this.movie.posterImg) {
      this.previewUrl = this.movie.posterImg;
    }
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

  addGenre() {
    if (this.selectedGenres.includes('')) return;
    this.selectedGenres.push('');
  }

  removeGenre(index: number) {
    this.selectedGenres.splice(index, 1);
  }

  updateMovie() {
    this.isLoading = true;

    const updatedMovie: iMovie = {
      ...this.movie,
      genres: this.selectedGenres.map(g => g.trim().toUpperCase() as unknown as iGenre),
    };

    if (this.selectedFile) {
      this.movieService.uploadPoster(this.movie.id!, this.selectedFile).subscribe(
        (response) => {
          updatedMovie.posterImg = response.posterImg;
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
    this.movieService.updateMovie(this.movie.id!, movie).subscribe(
      (updatedMovie) => {
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
      this.movieService.deleteMovie(this.movie.id!).subscribe(
        () => {
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
