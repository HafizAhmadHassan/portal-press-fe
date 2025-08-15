const CarouselDotPage = ({
  totalItems,
  itemsPerView,
  currentIndex,
}: {
  totalItems: number;
  itemsPerView: number;
  currentIndex: number;
}) => {
  // Calculate the number of pages (dots)
  const pageCount = Math.max(1, totalItems - itemsPerView + 1);

  // Ensure we don't try to render too many dots
  const dotsToShow = Math.min(pageCount, 10);

  return (
    <div className="flex gap-2 rounded-lg bg-white/80 p-2 shadow-md">
      {Array.from({ length: dotsToShow }).map((_, index) => {
        // If we have too many dots, show a subset and indicate current position proportionally
        const isActive =
          pageCount <= 10
            ? index === currentIndex
            : index === Math.floor((currentIndex * dotsToShow) / pageCount);

        return (
          <span
            key={index}
            className={`size-3 rounded-full transition-all ${
              isActive ? 'w-5 bg-primary' : 'w-3 bg-gray-400'
            }`}
          />
        );
      })}
    </div>
  );
};

export default CarouselDotPage;
