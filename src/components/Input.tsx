import { type InputHTMLAttributes } from "react";

type Props = {
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  labelText: string;
  errorText?: string;
  containerStyle?: string;
};

export const Input = (props: Props) => {
  const { labelText, errorText, inputProps, containerStyle } = props;
  return (
    <div className={containerStyle}>
      <label className="flex flex-col gap-1 capitalize">
        {labelText}:
        <input
          {...inputProps}
          className="rounded-md border border-solid border-neutral-400 bg-transparent p-2 outline-emerald-700/50"
        />
      </label>

      <p className="text-center text-red-500">{errorText}</p>
    </div>
  );
};
