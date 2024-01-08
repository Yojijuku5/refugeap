import { useState, type ChangeEvent, type FormEvent } from "react";
import { type z, ZodError } from "zod";
import { createBlogSchema, type updateBlogSchema } from "../schemas/blogSchema";
import { api } from "../utils/api";
import { Input } from "./Input";
import Loader from "./Loader";
import { TextArea } from "./TextArea";

type Props = {
  closeHandler: () => void;
  blog: z.TypeOf<typeof updateBlogSchema>;
};

const defaultFormErrorValues = {
  title: "",
  content: "",
};

export const EditBlogForm = ({ closeHandler, blog }: Props) => {
  const utils = api.useContext();
  const [isLoading, setIsLoading] = useState(false);
  const defaultFormValues = { title: blog.title, content: blog.content };
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [errorFormValues, setErrorFormValues] = useState(
    defaultFormErrorValues
  );

  const updateBlogMutation = api.blog.update.useMutation({
    onSuccess: () => {
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

    onSettled: async (data) => {
      setIsLoading(() => false);

      if (!data) {
        return;
      }

      await utils.blog.byId.invalidate({ id: data.id });
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

      const data = { ...formValues, content: formValues.content };

      createBlogSchema.parse(data);

      setIsLoading(() => true);

      updateBlogMutation.mutate({ ...data, id: blog.id });
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
