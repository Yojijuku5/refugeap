import { type ChangeEvent, type FormEvent, useState } from "react";
import { ZodError } from "zod";
import { createBlogSchema } from "../schemas/blogSchema";
import { api } from "../utils/api";
import { Input } from "./Input";
import Loader from "./Loader";
import { TextArea } from "./TextArea";

type Props = { closeHandler: () => void };

const defaultFormValues = { title: "", content: "" };
const defaultFormErrorValues = { title: "", content: "" };

export const NewBlogForm = ({ closeHandler }: Props) => {
  const utils = api.useContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [errorFormValues, setErrorFormValues] = useState(
    defaultFormErrorValues
  );

  const createBlogMutation = api.blog.create.useMutation({
    onSuccess: () => {
      setFormValues(defaultFormValues);
      closeHandler();
    },

    onError: (error) => {
      setErrorFormValues(() => ({
        title: error.data?.zodError?.fieldErrors["title"]?.at(0) ?? "",
        content: error.data?.zodError?.fieldErrors["content"]?.at(0) ?? "",
      }));
    },

    onMutate: () => {
      setErrorFormValues(defaultFormErrorValues);
    },

    onSettled: async () => {
      setIsLoading(() => false);
      await utils.blog.all.invalidate();
    },
  });

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = (e: FormEvent) => {
    try {
      e.preventDefault();
      console.log(formValues);

      createBlogSchema.parse(formValues);

      setIsLoading(() => true);

      createBlogMutation.mutate(formValues);
    } catch (error) {
      if (error instanceof ZodError) {
        setErrorFormValues({
          title: error.formErrors.fieldErrors["title"]?.at(0) ?? "",
          content: error.formErrors.fieldErrors["content"]?.at(0) ?? "",
        });
      }
    }
  };

  return (
    <form
      className="flex h-full min-w-[30vw] flex-col gap-5"
      onSubmit={submitHandler}
    >
      <h1 className="mb-5 text-center text-2xl capitalize">new blog</h1>

      <Input
        labelText="title"
        inputProps={{
          type: "text",
          placeholder: "enter title...",
          value: formValues.title,
          onChange: changeHandler,
          name: "title",
        }}
        errorText={errorFormValues.title}
      />

      <TextArea
        labelText="content"
        textAreaProps={{
          placeholder: "enter content...",
          value: formValues.content,
          onChange: changeHandler,
          name: "content",
          rows: 5,
        }}
        errorText={errorFormValues.content}
      />

      <button type="submit" className="button-primary mt-auto ">
        {isLoading && <Loader />}
        submit
      </button>
    </form>
  );
};
