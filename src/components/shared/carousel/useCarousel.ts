import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface UseCarouselProps {
  dataLength: number;
  itemsPerView: number;
  itemsPerViewTablet: number;
  itemsPerViewMobile: number;
  gap: number;
}

export const useCarousel = ({
  dataLength,
  itemsPerView,
  itemsPerViewTablet,
  itemsPerViewMobile,
  gap,
}: UseCarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [visibleItems, setVisibleItems] = useState(itemsPerView);
  const [isInitialized, setIsInitialized] = useState(true);

  // Create a memoized version of updateItemWidth for use in multiple places
  const updateItemWidth = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;

    // Use a default width if container width is not detected properly
    if (!containerWidth && visibleItems > 0) {
      const screenWidth = window.innerWidth;
      const estimatedContainerWidth = screenWidth * 0.9; // 90% of screen width as estimate
      const calculatedItemWidth =
        (estimatedContainerWidth - gap * (visibleItems - 1)) / visibleItems;
      setItemWidth(calculatedItemWidth + gap);
      return;
    }

    if (containerWidth && visibleItems > 0) {
      const calculatedItemWidth = (containerWidth - gap * (visibleItems - 1)) / visibleItems;
      setItemWidth(calculatedItemWidth + gap);
    }
  }, [visibleItems, gap]);

  // Handle screen size changes - make this run first and be more aggressive
  useLayoutEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      let newScreenSize: 'mobile' | 'tablet' | 'desktop';
      let newVisibleItems: number;

      if (width < 768) {
        newScreenSize = 'mobile';
        newVisibleItems = itemsPerViewMobile;
      } else if (width < 1024) {
        newScreenSize = 'tablet';
        newVisibleItems = itemsPerViewTablet;
      } else {
        newScreenSize = 'desktop';
        newVisibleItems = itemsPerView;
      }

      setScreenSize(newScreenSize);
      setVisibleItems(newVisibleItems);

      // Reset current store if needed due to screen size change
      if (currentIndex > dataLength - newVisibleItems) {
        setCurrentIndex(Math.max(0, dataLength - newVisibleItems));
      }
    };

    // Force immediate update
    updateScreenSize();

    // Also run it after a short delay
    const timeoutId = setTimeout(updateScreenSize, 50);

    window.addEventListener('resize', updateScreenSize);
    return () => {
      window.removeEventListener('resize', updateScreenSize);
      clearTimeout(timeoutId);
    };
  }, [dataLength, itemsPerView, itemsPerViewTablet, itemsPerViewMobile, currentIndex]);

  // Use useLayoutEffect for DOM measurements to ensure they happen before browser paint
  useLayoutEffect(() => {
    // Update the width immediately on mount and when dependencies change
    updateItemWidth();

    // If the calculation resulted in a zero width, use defaults
    if (itemWidth === 0) {
      const containerWidth = containerRef.current?.offsetWidth || window.innerWidth * 0.9;
      const calculatedItemWidth = (containerWidth - gap * (visibleItems - 1)) / visibleItems;
      setItemWidth(calculatedItemWidth + gap);
    }

    // Also set a series of delayed updates to ensure we catch any late DOM changes
    const timeoutIds = [
      setTimeout(updateItemWidth, 0),
      setTimeout(updateItemWidth, 50),
      setTimeout(updateItemWidth, 100),
      setTimeout(updateItemWidth, 500),
      setTimeout(updateItemWidth, 1000),
    ];

    window.addEventListener('resize', updateItemWidth);

    // Cleanup timeouts and event listener
    return () => {
      timeoutIds.forEach(clearTimeout);
      window.removeEventListener('resize', updateItemWidth);
    };
  }, [visibleItems, gap, updateItemWidth, itemWidth]);

  // Always automatically set initialized to true after a short delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isInitialized) {
        setIsInitialized(true);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [isInitialized]);

  // Update initialized state based on itemWidth
  useEffect(() => {
    if (itemWidth > 0 && !isInitialized) {
      setIsInitialized(true);
    }
  }, [itemWidth, isInitialized]);

  // Fix maxIndex calculation to ensure we can always navigate
  const maxIndex = Math.max(0, dataLength - visibleItems);

  const nextSlide = () => {
    if (!isInitialized || dataLength <= 1) return;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (!isInitialized || dataLength <= 1) return;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return {
    containerRef,
    itemRef,
    currentIndex,
    itemWidth,
    visibleItems,
    nextSlide,
    prevSlide,
    canGoNext: dataLength > 1,
    canGoPrev: dataLength > 1,
    isInitialized: isInitialized || dataLength <= visibleItems,
  };
};
