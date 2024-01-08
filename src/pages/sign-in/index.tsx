import { type ChangeEvent, type FormEvent, useState } from "react";
import { z, ZodError } from "zod";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Loader from "../../components/Loader";
import { Input } from "../../components/Input";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const signInGoogleHandler = () => {
    void signIn("google", { redirect: true, callbackUrl: "/" });
  };

  const changeEmailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setIsLoading(() => true);

    try {
      z.string().email().parse(email);
      await signIn("email", { redirect: true, callbackUrl: "/", email });
    } catch (error) {
      if (error instanceof ZodError && error.errors[0]) {
        setEmailError(error.errors[0].message);
      }
    } finally {
      setIsLoading(() => false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up | RefugEAP</title>
        <meta name="description" content="Sign Up Page for the RefugEAP" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen">
        <form
          className="m-auto flex h-screen w-full flex-col justify-center rounded-lg border border-neutral-200 bg-white p-8 shadow-md lg:h-auto lg:w-[400px]"
          onSubmit={(e) => void submitHandler(e)}
        >
          <h1 className="text-center text-2xl capitalize">sign in</h1>

          <Input
            labelText="Email"
            inputProps={{
              type: "email",
              placeholder: "john@gmail.com",
              onChange: changeEmailHandler,
            }}
            errorText={emailError}
          />

          <button type="submit" className="button-primary relative mt-10">
            sign in
            {isLoading && <Loader />}
          </button>

          <p
            className="after:contents-[''] before:contents-[''] my-8  text-center text-2xl before:relative
            before:top-0 before:right-2 before:-ml-[50%] before:inline-block before:h-[1px] before:w-10 before:bg-current before:align-middle after:relative after:top-0 after:left-2 after:-mr-[50%] after:inline-block
            after:h-[1px] after:w-10 after:bg-current after:align-middle"
          >
            or
          </p>

          <button
            onClick={signInGoogleHandler}
            type="button"
            className="button border border-neutral-300 bg-white/90 hover:bg-white"
          >
            <Image
              src={"/google-icon.png"}
              alt="google icon"
              width={24}
              height={24}
              className="float-left"
              priority
            />
            continue with google
          </button>
        </form>
      </main>
    </>
  );
};

export default SignUpPage;
