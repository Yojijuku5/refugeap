import Head from "next/head";
import Link from "next/link";

const EngLangProvPage = () => {
  return (
    <>
      <Head>
        <title>Opportunities | RefugEAP</title>
        <meta name="description" content="RefugEAP" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto mt-32 min-h-screen max-w-7xl p-5">
        <section className="bg-neutral-100">
          <div className="relative z-10  flex flex-col items-center justify-center py-20 after:absolute after:inset-0 after:-z-10 after:bg-emerald-700 after:content-[''] ">
            <h2 className="text-center text-4xl font-bold capitalize text-white">
              Displaced Student Opportunities UK
            </h2>
          </div>
        </section>

        <section>
          <div className="flex justify-center">
            <div className="relative isolate mx-auto flex max-w-7xl flex-col items-center p-20">
              <h2 className="mb-10 text-center text-4xl font-bold capitalize">
                <mark className="highlight-primary">For Students</mark>
              </h2>
              <p className="max-w-xl text-center">
                If you know or are a Refugee Background Student, then you can
                check the website to have a look at potential education
                opportunities relating to your desired studies.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-center">
            <div className="max-w-7x1 relative isolate mx-auto flex flex-col items-center pb-20">
              <h2 className="mb-10 text-center text-4xl font-bold capitalize">
                <mark className="highlight-primary">for providers</mark>
              </h2>
              <p className="max-w-xl text-center">
                If you or someone you know can potentially provide opportunities
                for Refugee Background Students, then you can still take the
                link to the website. Once entering, there is a &apos;For
                Providers&apos; link in the header which will guide you through
                potentially opening up opportunities and put you in contact with
                someone from the organisation.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-center pb-10">
            <Link
              href="https://www.displacedstudent.org.uk/"
              scroll={false}
              target="_blank"
              className="button-primary mx-auto w-max">
              Link to Website
            </Link>
          </div>
        </section>

        <section>
          <div className="relative isolate mx-auto flex flex-col max-w-7x1 items-center pb-20">
            <h2 className="mb-10 text-center text-4xl font-bold capitalize">
                <mark className="highlight-primary">our padlet</mark>
            </h2>
            <iframe
                src="https://padlet.com/embed/94dn9e90rewkm1p3"
                allow="camera;microphone;geolocation"
                className="h-screen w-full">
            </iframe>
          </div>
        </section>
      </main>
    </>
    )
}

export default EngLangProvPage;
