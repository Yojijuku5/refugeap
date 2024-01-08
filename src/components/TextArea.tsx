import { type TextareaHTMLAttributes } from "react";

type Props = {
  textAreaProps: TextareaHTMLAttributes<HTMLTextAreaElement>;
  labelText: string;
  errorText?: string;
  containerStyle?: string;
};

export const TextArea = (props: Props) => {
  const { labelText, errorText, textAreaProps, containerStyle } = props;
  return (
    <div className={containerStyle}>
      <label className="flex flex-col gap-1 capitalize">
        {labelText}:
        <textarea
          {...textAreaProps}
          className="rounded-md border border-solid border-neutral-400 bg-transparent p-2 outline-emerald-700/50"
        />
      </label>

      <p className="text-center text-red-500">{errorText}</p>
    </div>
  );
};
