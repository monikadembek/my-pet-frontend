import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Slide } from './models';

@Component({
  selector: 'app-image-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.scss',
})
export class ImageSliderComponent implements OnInit, OnDestroy {
  @Input() slides: Slide[] = [];
  @Input() showIndicators = true;
  @Input() showNavigation = true;
  @Input() autoplayInterval = 5000;

  currentIndex = 0;
  private timeoutId?: number;

  ngOnInit(): void {
    this.resetTimer();
  }

  private resetTimer(): void {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
    this.timeoutId = window.setTimeout(
      () => this.goToNext(),
      this.autoplayInterval
    );
  }

  goToPrevious(): void {
    const isFirstSlide = this.currentIndex === 0;
    const newIndex = isFirstSlide
      ? this.slides.length - 1
      : this.currentIndex - 1;

    this.resetTimer();
    this.currentIndex = newIndex;
  }

  goToNext(): void {
    const isLastSlide = this.currentIndex === this.slides.length - 1;
    const newIndex = isLastSlide ? 0 : this.currentIndex + 1;

    this.resetTimer();
    this.currentIndex = newIndex;
  }

  goToSlide(slideIndex: number): void {
    this.resetTimer();
    this.currentIndex = slideIndex;
  }

  getCurrentSlideUrl(): string {
    return `url('${this.slides[this.currentIndex].imageUrl}')`;
  }

  ngOnDestroy(): void {
    window.clearTimeout(this.timeoutId);
  }
}
