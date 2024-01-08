import { type NextPage } from "next";
import Head from "next/head";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { ZodError } from "zod";
import { Input } from "../../components/Input";
import Loader from "../../components/Loader";
import { TextArea } from "../../components/TextArea";
import { sendEmailContactSchema } from "../../schemas/mediaSchema";
import { api } from "../../utils/api";

const Toast = ({ closeHandler }: { closeHandler: () => void }) => {
  const [startExitingAnimation, setStartExitingAnimation] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(
      () => setStartExitingAnimation(() => true),
      3_000
    );

    return () => clearTimeout(timeoutId);
  }, [closeHandler]);

  return (
    <div
      className="fixed top-0 left-1/2 z-50 mt-5 -translate-x-1/2 animate-drop-in rounded-lg bg-emerald-700 py-2 px-5 text-white shadow-lg backdrop-blur-md aria-[expanded=false]:animate-fade-out"
      aria-expanded={startExitingAnimation ? false : true}
      onAnimationEnd={() => startExitingAnimation && closeHandler()}
    >
      <p className="text-lg">Email sent successfully!</p>
    </div>
  );
};

const defaultFormValues = { email: "", comment: "", name: "", subject: "" };
const defaultFormErrorValues = {
  email: "",
  comment: "",
  name: "",
  subject: "",
};

const Contact: NextPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [errorFormValues, setErrorFormValues] = useState(
    defaultFormErrorValues
  );
  const sendEmailMutation = api.media.sendEmailContact.useMutation({
    onSuccess: () => {
      setFormValues(defaultFormValues);
      setIsSuccess(() => true);
    },

    onError: (error) => {
      setErrorFormValues(() => ({
        comment: error.data?.zodError?.fieldErrors["comment"]?.at(0) ?? "",
        email: error.data?.zodError?.fieldErrors["email"]?.at(0) ?? "",
        name: error.data?.zodError?.fieldErrors["name"]?.at(0) ?? "",
        subject: error.data?.zodError?.fieldErrors["subject"]?.at(0) ?? "",
      }));
    },

    onMutate: () => {
      setErrorFormValues(defaultFormErrorValues);
    },

    onSettled: () => {
      setIsLoading(() => false);
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

      sendEmailContactSchema.parse(formValues);

      setIsLoading(() => true);

      sendEmailMutation.mutate(formValues);
    } catch (error) {
      if (error instanceof ZodError) {
        setErrorFormValues({
          comment: error.formErrors.fieldErrors["comment"]?.at(0) ?? "",
          email: error.formErrors.fieldErrors["email"]?.at(0) ?? "",
          name: error.formErrors.fieldErrors["name"]?.at(0) ?? "",
          subject: error.formErrors.fieldErrors["subject"]?.at(0) ?? "",
        });
      }
    }
  };

  return (
    <>
      <Head>
        <title>RefugEAP</title>
        <meta name="description" content="RefugEAP" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isSuccess && <Toast closeHandler={() => setIsSuccess(() => false)} />}

      <main className="mx-auto min-h-screen max-w-7xl px-5 pt-32">
        <h2 className="text-4xl">
          Love to hear from <mark className="highlight-primary">you</mark>
          ,
          <br />
          Get in touch!
        </h2>

        <form
          id="contact-form"
          className="mt-10 flex flex-col gap-5"
          onSubmit={submitHandler}
        >
          <Input
            labelText="name"
            inputProps={{
              type: "name",
              placeholder: "enter your full name...",
              name: "name",
              value: formValues.name,
              onChange: changeHandler,
            }}
            errorText={errorFormValues.name}
          />

          <Input
            labelText="subject"
            inputProps={{
              type: "subject",
              placeholder: "enter subject...",
              name: "subject",
              value: formValues.subject,
              onChange: changeHandler,
            }}
            errorText={errorFormValues.subject}
          />

          <Input
            labelText="email"
            inputProps={{
              type: "email",
              placeholder: "enter email...",
              name: "email",
              value: formValues.email,
              onChange: changeHandler,
            }}
            errorText={errorFormValues.email}
          />

          <TextArea
            labelText="comment"
            textAreaProps={{
              placeholder: "enter comment...",
              name: "comment",
              value: formValues.comment,
              onChange: changeHandler,
              rows: 5,
            }}
            errorText={errorFormValues.comment}
          />

          <button className="button-primary w-max px-10">
            {isLoading && <Loader />}
            sumbit
          </button>
        </form>
      </main>
    </>
  );
};

export default Contact;
