import { type ChangeEvent, type FormEvent, useState } from "react";
import { ZodError } from "zod";
import { createEventSchema } from "../schemas/eventSchema";
import { api } from "../utils/api";
import { Input } from "./Input";
import Loader from "./Loader";
import { TextArea } from "./TextArea";

type Props = { closeHandler: () => void };

const defaultFormValues = { title: "", address: "", description: "", date: "" };
const defaultFormErrorValues = {
  title: "",
  address: "",
  description: "",
  date: "",
};

export const NewEventForm = ({ closeHandler }: Props) => {
  const utils = api.useContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [errorFormValues, setErrorFormValues] = useState(
    defaultFormErrorValues
  );

  const createEventMutation = api.event.create.useMutation({
    onSuccess: () => {
      setFormValues(defaultFormValues);
      closeHandler();
    },

    onError: (error) => {
      setErrorFormValues(() => ({
        title: error.data?.zodError?.fieldErrors["title"]?.at(0) ?? "",
        address: error.data?.zodError?.fieldErrors["address"]?.at(0) ?? "",
        description:
          error.data?.zodError?.fieldErrors["description"]?.at(0) ?? "",
        date: error.data?.zodError?.fieldErrors["date"]?.at(0) ?? "",
      }));
    },

    onMutate: () => {
      setErrorFormValues(defaultFormErrorValues);
    },

    onSettled: async () => {
      setIsLoading(() => false);
      await utils.event.all.invalidate();
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

      const data = { ...formValues, date: new Date(formValues.date) };

      createEventSchema.parse(data);

      setIsLoading(() => true);

      createEventMutation.mutate(data);
    } catch (error) {
      if (error instanceof ZodError) {
        setErrorFormValues({
          title: error.formErrors.fieldErrors["title"]?.at(0) ?? "",
          address: error.formErrors.fieldErrors["address"]?.at(0) ?? "",
          description: error.formErrors.fieldErrors["description"]?.at(0) ?? "",
          date: error.formErrors.fieldErrors["date"]?.at(0) ?? "",
        });
      }
    }
  };

  return (
    <form
      className="flex h-full min-w-[30vw] flex-col gap-5"
      onSubmit={submitHandler}
    >
      <h1 className="mb-5 text-center text-2xl capitalize">new event</h1>

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

      <Input
        labelText="address"
        inputProps={{
          type: "text",
          placeholder: "enter address...",
          value: formValues.address,
          onChange: changeHandler,
          name: "address",
        }}
        errorText={errorFormValues.address}
      />

      <TextArea
        labelText="description"
        textAreaProps={{
          placeholder: "enter description...",
          value: formValues.description,
          onChange: changeHandler,
          name: "description",
          rows: 5,
        }}
        errorText={errorFormValues.description}
      />

      <Input
        labelText="date"
        inputProps={{
          type: "date",
          placeholder: "enter date...",
          value: formValues.date,
          onChange: changeHandler,
          name: "date",
        }}
        errorText={errorFormValues.date}
      />

      <button type="submit" className="button-primary mt-auto">
        {isLoading && <Loader />}
        submit
      </button>
    </form>
  );
};
