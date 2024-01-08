import type { Item } from "@prisma/client";
import Image from "next/image";
import { type MouseEvent, useRef, useState } from "react";
import { useCarousel } from "./ItemCarousel";

type NavProps = {
  images: Item["images"];
  navClickHandler: (index: number) => void;
  currentIndex: number;
};

const ImagesNav = (props: NavProps) => {
  const { images, currentIndex, navClickHandler } = props;
  return (
    <nav className="hidden flex-col gap-5 lg:flex ">
      {images.map((image, index) => (
        <button
          aria-current={index === currentIndex ? "true" : "false"}
          className="overflow-hidden rounded-lg outline-none aria-[current=true]:outline-neutral-500"
          key={image}
        >
          <Image
            src={image}
            alt={image}
            className="aspect-square object-cover"
            onClick={() => navClickHandler(index)}
            height={80}
            width={80}
            priority
          />
        </button>
      ))}
    </nav>
  );
};

type CarouselContainer = {
  images: Item["images"];
  currentIndex: number;
};

const CarouselContainer = ({ images, currentIndex }: CarouselContainer) => {
  const [magnifierStyle, setMagnifierStyle] = useState({});
  const overflowContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (!overflowContainerRef.current) {
      return;
    }

    const imgPosition = overflowContainerRef.current.getBoundingClientRect();
    const imgHeight = overflowContainerRef.current.clientHeight;
    const imgWidth = overflowContainerRef.current.clientWidth;

    const posX = e.clientX - imgPosition.left;
    const posY = e.clientY - imgPosition.top;

    const percX = (posX / imgWidth) * 100;
    const percY = (posY / imgHeight) * 100;
    const perc = `${percX}%  ${percY}%`;

    setMagnifierStyle(() => ({ backgroundPosition: perc }));
  };

  return (
    <div
      className="group relative overflow-hidden rounded-lg"
      ref={overflowContainerRef}
      onMouseMove={handleMouseMove}
    >
      <ul
        className="flex flex-col transition-all duration-300 ease-out"
        style={{
          height: `calc(100% * ${images.length})`,
          translate: `0 calc(${currentIndex * -1} * 100% / ${images.length})`,
        }}
      >
        {images.map((src, index) => (
          <li key={src} className="relative h-full">
            <Image
              src={src}
              alt={`product image number ${index}`}
              className="-z-10 object-cover"
              fill
              priority
              sizes="100%"
            />
          </li>
        ))}
      </ul>

      <div
        role="img"
        className="pointer-events-none fixed top-1/2 left-1/2 z-50 hidden aspect-square w-[45%] -translate-y-1/2 rounded-lg bg-[length:300%] shadow-xl lg:group-hover:block"
        style={{
          backgroundImage: `url(${images.at(currentIndex) ?? ""})`,
          ...magnifierStyle,
        }}
      />
    </div>
  );
};

const ButtonsNav = ({ currentIndex, images, navClickHandler }: NavProps) => {
  return (
    <nav className="relative flex h-1.5 items-center justify-center overflow-hidden rounded-3xl bg-neutral-200 lg:col-start-2">
      <div
        className="absolute left-0 top-0 h-full rounded-3xl bg-neutral-500 transition-all duration-300 ease-out"
        style={{
          translate: `calc(${currentIndex} * 100%)`,
          width: `calc(100% / ${images.length})`,
        }}
      />
      {images.map((_, index) => (
        <button
          aria-label={`view slide image ${index}`}
          key={index}
          className="h-full flex-1 cursor-pointer border-none"
          onClick={() => navClickHandler(index)}
        />
      ))}
    </nav>
  );
};

type Props = { images: Item["images"] };

export const SelectedProductCarousel = ({ images }: Props) => {
  const carousel = useCarousel(images.length);

  return (
    <section className="grid grid-rows-[500px,auto] gap-5 lg:grid-cols-[80px,500px] lg:grid-rows-[500px,auto]">
      <ImagesNav
        images={images}
        currentIndex={carousel.currentIndex}
        navClickHandler={carousel.jumpToSlide}
      />
      <CarouselContainer images={images} currentIndex={carousel.currentIndex} />
      <ButtonsNav
        images={images}
        currentIndex={carousel.currentIndex}
        navClickHandler={carousel.jumpToSlide}
      />
    </section>
  );
};
