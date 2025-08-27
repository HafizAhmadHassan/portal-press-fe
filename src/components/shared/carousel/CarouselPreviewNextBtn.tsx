import { ChevronLeft, ChevronRight } from "lucide-react";
import { SimpleButton } from "../simple-btn/SimpleButton.component";

interface CarouselPreviewNextBtnProps {
  prevSlide: () => void;
  nextSlide: () => void;
  buttonSize?: number; // Optional prop for controlling the size of the icons
  showNavigation?: boolean; // Add this prop
}

const CarouselPreviewNextBtn = ({
  prevSlide,
  nextSlide,
  buttonSize = 32,
  showNavigation = true, // Default to true for backward compatibility
}: CarouselPreviewNextBtnProps) => {
  const commonClasses =
    "absolute top-1/2 z-10 flex -translate-y-1/2 items-center justify-center";

  // If navigation shouldn't be shown, return null or an empty fragment
  if (!showNavigation) return null;

  // Make sure event handlers are properly passed and work
  const handlePrevClick = () => {
    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
      prevSlide();
    }, 0);
  };

  const handleNextClick = () => {
    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
      nextSlide();
    }, 0);
  };

  return (
    <>
      <SimpleButton
        variant="ghost"
        onClick={handlePrevClick}
        className={`${commonClasses} left-4`}
        aria-label="Previous slide"
      >
        <ChevronLeft size={buttonSize} />
      </SimpleButton>
      <SimpleButton
        variant="ghost"
        onClick={handleNextClick}
        className={`${commonClasses} right-4`}
        aria-label="Next slide"
      >
        <ChevronRight size={buttonSize} />
      </SimpleButton>
    </>
  );
};

export default CarouselPreviewNextBtn;
