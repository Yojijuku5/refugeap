import { type Event } from "@prisma/client";
import Link from "next/link";

export const EventCardSkeleton = () => {
  return (
    <>
      {[...Array(10).keys()].map((index) => (
        <div
          key={index}
          className="animate-skeleton relative h-[240px] overflow-hidden rounded-md border border-neutral-300 bg-neutral-200 p-5 shadow-md"
        >
          <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-5">
            <div className="col-start-1 row-span-full aspect-square h-16 rounded-lg bg-neutral-300/50" />
            <div className="aspect-square h-6 w-1/2 rounded-lg bg-neutral-300/50" />
            <div className="aspect-square h-3 w-1/2 rounded-lg bg-neutral-300/50" />
          </div>

          <div className="mt-5 aspect-square h-16 w-full rounded-lg  bg-neutral-300/50" />

          <div className="mt-5 h-4 w-14 rounded-lg bg-neutral-300/50" />

          <div className="absolute top-0 left-0 h-full w-full animate-slide bg-[linear-gradient(90deg,#0f172000_0,#0f172020_20%,#0f172070_60%,#0f172000)]" />
        </div>
      ))}
    </>
  );
};

export const EventCard = ({ event }: { event: Event }) => {
  return (
    <li className="card flex flex-col gap-5 p-5">
      <header className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-5 truncate">
        <div className="col-start-1 row-span-full aspect-square w-16 rounded-lg bg-emerald-700/20 p-2 text-center text-emerald-700">
          <p className="font-bold">
            {event.date.toLocaleDateString("en-US", { day: "2-digit" })}
          </p>
          <p>{event.date.toLocaleDateString("en-US", { month: "short" })}</p>
        </div>

        <h2 className="truncate text-xl font-bold capitalize">{event.title}</h2>

        <div className="flex items-center truncate fill-current text-neutral-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="aspect-square min-w-[16px] max-w-[16px]"
          >
            <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
          </svg>
          <p className="ml-1 truncate">{event.address}</p>
        </div>
      </header>

      <p className="line-clamp-3">{event.description}</p>

      <p className="mt-auto flex items-center gap-1 font-bold capitalize text-emerald-700">
        read more
        <svg
          viewBox="0 0 24 24"
          className="aspect-square w-5 fill-emerald-700"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m14.523 18.787s4.501-4.505 6.255-6.26c.146-.146.219-.338.219-.53s-.073-.383-.219-.53c-1.753-1.754-6.255-6.258-6.255-6.258-.144-.145-.334-.217-.524-.217-.193 0-.385.074-.532.221-.293.292-.295.766-.004 1.056l4.978 4.978h-14.692c-.414 0-.75.336-.75.75s.336.75.75.75h14.692l-4.979 4.979c-.289.289-.286.762.006 1.054.148.148.341.222.533.222.19 0 .378-.072.522-.215z" />
        </svg>
      </p>

      <Link href={`/events/${event.id}`} className="absolute inset-0" />
    </li>
  );
};
