import Image from "next/image";
import { type RouterOutputs } from "../utils/api";

type Props = {
  image: RouterOutputs["blog"]["all"][0]["user"]["image"];
  className?: string;
};

export const Avatar = ({ image, className }: Props) => {
  if (!image) {
    return (
      <div
        className={`col-start-1 row-span-full aspect-square w-16 rounded-xl bg-emerald-700/20 ${
          className ?? ""
        }`}
      />
    );
  }

  return (
    <Image
      className={`col-start-1 row-span-full aspect-square w-16 rounded-xl bg-emerald-700/20 ${
        className ?? ""
      }`}
      priority
      src={image}
      alt="user image"
      width={64}
      height={64}
    />
  );
};
