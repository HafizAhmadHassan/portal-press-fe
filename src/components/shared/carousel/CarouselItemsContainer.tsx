import { type JSX, type RefObject } from "react";

interface CarouselItemsContainerProps<T> {
  containerRef: RefObject<HTMLDivElement | null>;
  currentIndex: number;
  itemWidth: number;
  fallbackItemWidth: number;
  itemRef: RefObject<HTMLDivElement | null>;
  data: T[];
  gap: number;
  renderItem: (item: T, index: number) => JSX.Element;
}

const CarouselItemsContainer = <T,>({
  containerRef,
  currentIndex,
  itemWidth,
  fallbackItemWidth,
  itemRef,
  data,
  gap,
  renderItem,
}: CarouselItemsContainerProps<T>) => {
  return (
    <div
      ref={containerRef as RefObject<HTMLDivElement>}
      className="flex transition-transform duration-300 ease-in-out"
      style={{
        transform: `translateX(-${
          currentIndex * (itemWidth || fallbackItemWidth)
        }px)`,
        gap: `${gap}px`,
      }}
    >
      {data.map((item, index) => (
        <div
          key={index}
          ref={index === 0 ? (itemRef as RefObject<HTMLDivElement>) : null}
          style={{
            width: `${(itemWidth || fallbackItemWidth) - gap}px`,
            flexShrink: 0,
          }}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};

export default CarouselItemsContainer;
