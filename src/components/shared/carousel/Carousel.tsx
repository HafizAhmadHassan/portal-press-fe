import { type JSX, useEffect, useLayoutEffect, useState } from "react";

import CarouselDotPage from "./CarouselDotPage";
import CarouselItemsContainer from "./CarouselItemsContainer";
import CarouselPreviewNextBtn from "./CarouselPreviewNextBtn";
import { useCarousel } from "./useCarousel";

interface CarouselProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => JSX.Element;
  itemsPerView?: number;
  itemsPerViewMobile?: number;
  itemsPerViewTablet?: number;
  gap?: number;
  loading: boolean;
  SkeletonComponent: JSX.Element;
}

const DynamicCarousel = <T,>({
  data,
  renderItem,
  itemsPerView = 3,
  itemsPerViewMobile = 1,
  itemsPerViewTablet = 2,
  gap = 16,
  loading,
  SkeletonComponent,
}: CarouselProps<T>) => {
  const totalItems = data.length;
  // Track if component is mounted to avoid any race conditions
  const [isMounted, setIsMounted] = useState(false);

  // Force mounted state to be set after component mounts
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const {
    containerRef,
    itemRef,
    currentIndex,
    itemWidth,
    visibleItems,
    nextSlide,
    prevSlide,
    canGoNext,
    canGoPrev,
    isInitialized,
  } = useCarousel({
    dataLength: totalItems,
    itemsPerView,
    itemsPerViewTablet,
    itemsPerViewMobile,
    gap,
  });

  // Force a layout update when component mounts
  useLayoutEffect(() => {
    // Trigger a resize event to force recalculation
    window.dispatchEvent(new Event("resize"));

    // Also trigger after a short delay
    const timeoutId = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  // Skeleton rendering logic
  const renderSkeleton = () => (
    <div className="flex flex-row w-full gap-4 overflow-hidden">
      {Array.from({ length: itemsPerViewMobile }).map((_, index) => (
        <div className="w-full" key={index}>
          {SkeletonComponent}
        </div>
      ))}
    </div>
  );

  if (loading) {
    return renderSkeleton();
  }

  // Don't render the carousel if there's no data
  if (!data.length) {
    return null;
  }

  // Determine how many items to show
  const actualVisibleItems = isMounted
    ? visibleItems
    : window.innerWidth < 768
    ? itemsPerViewMobile
    : window.innerWidth < 1024
    ? itemsPerViewTablet
    : itemsPerView;

  // Always show navigation if we have more items than can fit in view
  const showNavigation = data.length > 1;

  // Fallback item width when not initialized
  const fallbackItemWidth = containerRef.current
    ? containerRef.current.offsetWidth / actualVisibleItems - gap
    : (window.innerWidth * 0.9) / actualVisibleItems - gap;

  return (
    <div className="relative mx-auto w-full overflow-hidden rounded-xl pb-12">
      <CarouselItemsContainer
        containerRef={containerRef}
        currentIndex={currentIndex}
        itemWidth={itemWidth}
        fallbackItemWidth={fallbackItemWidth}
        itemRef={itemRef}
        data={data}
        gap={gap}
        renderItem={renderItem}
      />

      {/* Always show navigation buttons if there's multiple items */}
      <CarouselPreviewNextBtn
        prevSlide={prevSlide}
        nextSlide={nextSlide}
        showNavigation={showNavigation}
      />

      {showNavigation && (
        <div className="absolute inset-x-0 -bottom-4 flex justify-center pb-4">
          <CarouselDotPage
            totalItems={totalItems}
            itemsPerView={actualVisibleItems}
            currentIndex={currentIndex}
          />
        </div>
      )}
    </div>
  );
};

export default DynamicCarousel;
