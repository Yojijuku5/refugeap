import Link from "next/link";
import { type RouterOutputs } from "../utils/api";
import { Avatar } from "./Avatar";

export const BlogCardSkeleton = () => {
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

type Props = {
  blog: RouterOutputs["blog"]["all"][0];
};

export const BlogCard = ({ blog }: Props) => {
  return (
    <li className="card flex flex-col gap-5 p-5">
      <header className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-5">
        <Avatar image={blog.user.image} />

        <h2 className="truncate text-xl font-bold capitalize">{blog.title}</h2>
        <p className="text-md truncate text-neutral-700">
          {blog.user.name || blog.user.email?.split("@")[0]}
        </p>
      </header>

      <p className="line-clamp-3">{blog.content}</p>

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

      <Link href={`/blog/${blog.id}`} className="absolute inset-0" />
    </li>
  );
};
