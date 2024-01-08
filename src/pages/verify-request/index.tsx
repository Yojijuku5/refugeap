import Head from "next/head";

const VerifyRequest = () => {
  return (
    <>
      <Head>
        <title>Verify Request | RefugEAP</title>
        <meta name="description" content="Verify request for the RefugEAP" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="mb-20 aspect-square h-20 fill-current"
        >
          <path d="M23 0l-4.5 16.5-6.097-5.43 5.852-6.175-7.844 5.421-5.411-1.316 18-9zm-11 12.501v5.499l2.193-3.323-2.193-2.176zm-8.698 6.825l-1.439-.507 5.701-5.215 1.436.396-5.698 5.326zm3.262 4.287l-1.323-.565 4.439-4.503 1.32.455-4.436 4.613zm-4.083.387l-1.481-.507 8-7.89 1.437.397-7.956 8z" />
        </svg>

        <h1 className="text-2xl capitalize">Verify your inbox</h1>
        <p className="text-center">
          A email as been sent to your mailing box to activate your account
        </p>
      </main>
    </>
  );
};

export default VerifyRequest;
