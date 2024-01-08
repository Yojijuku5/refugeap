import type { Item, User } from "@prisma/client";
import Link from "next/link";
import { Avatar } from "./Avatar";
import { ItemCarousel } from "./ItemCarousel";

export const ItemCardSkeleton = () => {
  return (
    <>
      {[...Array(10).keys()].map((index) => (
        <div
          key={index}
          className="animate-skeleton relative overflow-hidden rounded-lg border border-neutral-300 bg-neutral-200 @container"
        >
          <div className="flex flex-col @2xl:flex-row">
            <div className="h-[300px] w-full min-w-[300px] bg-neutral-300 @2xl:w-[300px]" />

            <div className="m-5 flex flex-1 flex-col gap-5">
              <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-5">
                <div className="col-start-1 row-span-full aspect-square h-16 rounded-lg bg-neutral-300/50" />
                <div className="aspect-square h-6 w-1/2 rounded-lg bg-neutral-300/50" />
                <div className="aspect-square h-3 w-1/2 rounded-lg bg-neutral-300/50" />
              </div>

              <div className="mt-5 aspect-square h-24 w-full rounded-lg  bg-neutral-300/50" />

              <div className="mt-5 h-4 w-14 rounded-lg bg-neutral-300/50" />
            </div>

            <div className="absolute h-full w-full animate-slide bg-[linear-gradient(90deg,#0f172000_10%,#0f172020_20%,#0f172070_60%,#0f172000)]" />
          </div>
        </div>
      ))}
    </>
  );
};

type Props = {
  item: Item;
  author: User;
};

export const ItemCard = ({ item, author }: Props) => {
  return (
    <article className="card">
      <div className="flex h-full flex-col @2xl:flex-row">
        <ItemCarousel item={item} />

        <div className="m-5 flex flex-1 flex-col gap-5">
          <header className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-5 truncate">
            <Avatar image={author.image} />
            <h2 className="truncate text-xl font-bold capitalize">
              {item.title}
            </h2>
            <p className="ml-1 truncate text-neutral-700">
              {author.name || author.email?.split("@")[0]}
            </p>
          </header>

          <p className="line-clamp-5">{item.description}</p>

          <p className="mt-auto flex gap-2 font-bold capitalize text-emerald-700">
            view
            <svg
              viewBox="0 0 24 24"
              className="aspect-square w-5 fill-emerald-700"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m14.523 18.787s4.501-4.505 6.255-6.26c.146-.146.219-.338.219-.53s-.073-.383-.219-.53c-1.753-1.754-6.255-6.258-6.255-6.258-.144-.145-.334-.217-.524-.217-.193 0-.385.074-.532.221-.293.292-.295.766-.004 1.056l4.978 4.978h-14.692c-.414 0-.75.336-.75.75s.336.75.75.75h14.692l-4.979 4.979c-.289.289-.286.762.006 1.054.148.148.341.222.533.222.19 0 .378-.072.522-.215z" />
            </svg>
          </p>
        </div>
      </div>

      <Link className="absolute inset-0" href={`/items/${item.id}`} />
    </article>
  );
};
