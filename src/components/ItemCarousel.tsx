import { type Item } from "@prisma/client";
import Image from "next/image";
import {
  type ButtonHTMLAttributes,
  useEffect,
  useState,
  useCallback,
} from "react";

export const useCarousel = (numberOfImages: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      const isLastSlide = currentIndex === numberOfImages - 1;
      return isLastSlide ? 0 : prev + 1;
    });
  }, [currentIndex, numberOfImages]);

  const goToPreviousSlide = () => {
    setCurrentIndex((prev) => {
      const isFirstSlide = currentIndex === 0;
      return isFirstSlide ? numberOfImages - 1 : prev - 1;
    });
  };

  const jumpToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => goToNextSlide(), 10_000);

    return () => clearInterval(interval);
  }, [goToNextSlide]);

  return {
    currentIndex,
    jumpToSlide,
    goToPreviousSlide,
    goToNextSlide,
  };
};

const NextSlideButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      aria-label="view-next-image"
      className="absolute top-1/2 right-3 z-20 -translate-y-1/2 transform rounded-full bg-neutral-200 fill-current p-2"
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="h-3 w-3"
      >
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
      </svg>
    </button>
  );
};

const PreviousSlideButton = (
  props: ButtonHTMLAttributes<HTMLButtonElement>
) => {
  return (
    <button
      aria-label="view-previous-image"
      className="absolute top-1/2 left-3 z-20 -translate-y-1/2 transform rounded-full bg-neutral-200 fill-current p-2"
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="h-3 w-3"
      >
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      </svg>
    </button>
  );
};

type NavbarProps = {
  numberOfDots: number;
  activeDotIndex: number;
  dotClickHandler: (index: number) => void;
};

const Navbar = (props: NavbarProps) => {
  const { activeDotIndex, dotClickHandler, numberOfDots } = props;
  return (
    <nav className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-5">
      {[...Array(numberOfDots).keys()].map((index) => (
        <button
          aria-current={activeDotIndex === index ? "true" : "false"}
          aria-label={`go to ${index + 1} slides`}
          key={index}
          className="aspect-square h-3 cursor-pointer rounded-full border-none bg-neutral-100 outline-none aria-[current=true]:bg-neutral-500 "
          onClick={() => dotClickHandler(index)}
        />
      ))}
    </nav>
  );
};

type CarouselProps = {
  images: Item["images"];
  currentIndex: number;
};

const Carousel = ({ currentIndex, images }: CarouselProps) => {
  return (
    <div
      className="flex h-full transition-transform duration-300 ease-out"
      style={{
        width: `calc(100% * ${images.length})`,
        transform: `translate(calc(${currentIndex * -1} * 100% / ${
          images.length
        }))`,
      }}
    >
      {images.map((src) => (
        <div key={src} className="relative -z-10 flex-1 overflow-hidden">
          <Image
            src={src}
            priority
            className="object-cover"
            alt="product image"
            fill
            sizes="100%"
          />
        </div>
      ))}
    </div>
  );
};

export const ItemCarousel = ({ item }: { item: Item }) => {
  const numberOfImages = item.images.length;
  const isAllowToNavigate = numberOfImages > 1;

  const carousel = useCarousel(numberOfImages);

  return (
    <div className="relative h-[300px] w-full min-w-[300px] overflow-hidden @2xl:w-[300px]">
      <Carousel currentIndex={carousel.currentIndex} images={item.images} />

      {isAllowToNavigate && (
        <>
          <Navbar
            numberOfDots={numberOfImages}
            activeDotIndex={carousel.currentIndex}
            dotClickHandler={carousel.jumpToSlide}
          />
          <NextSlideButton onClick={carousel.goToNextSlide} />
          <PreviousSlideButton onClick={carousel.goToPreviousSlide} />
        </>
      )}
    </div>
  );
};
