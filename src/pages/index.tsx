import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";
import backgroundImage from "../../public/bg.jpg";

const CardIcon = {
  school:
    "M22 9.74l-2 1.02v7.24c-1.007 2.041-5.606 3-8.5 3-3.175 0-7.389-.994-8.5-3v-7.796l-3-1.896 12-5.308 11 6.231v8.769l1 3h-3l1-3v-8.26zm-18 1.095v6.873c.958 1.28 4.217 2.292 7.5 2.292 2.894 0 6.589-.959 7.5-2.269v-6.462l-7.923 4.039-7.077-4.473zm-1.881-2.371l9.011 5.694 9.759-4.974-8.944-5.066-9.826 4.346z",
  gear: "M12 8.666c-1.838 0-3.333 1.496-3.333 3.334s1.495 3.333 3.333 3.333 3.333-1.495 3.333-3.333-1.495-3.334-3.333-3.334m0 7.667c-2.39 0-4.333-1.943-4.333-4.333s1.943-4.334 4.333-4.334 4.333 1.944 4.333 4.334c0 2.39-1.943 4.333-4.333 4.333m-1.193 6.667h2.386c.379-1.104.668-2.451 2.107-3.05 1.496-.617 2.666.196 3.635.672l1.686-1.688c-.508-1.047-1.266-2.199-.669-3.641.567-1.369 1.739-1.663 3.048-2.099v-2.388c-1.235-.421-2.471-.708-3.047-2.098-.572-1.38.057-2.395.669-3.643l-1.687-1.686c-1.117.547-2.221 1.257-3.642.668-1.374-.571-1.656-1.734-2.1-3.047h-2.386c-.424 1.231-.704 2.468-2.099 3.046-.365.153-.718.226-1.077.226-.843 0-1.539-.392-2.566-.893l-1.687 1.686c.574 1.175 1.251 2.237.669 3.643-.571 1.375-1.734 1.654-3.047 2.098v2.388c1.226.418 2.468.705 3.047 2.098.581 1.403-.075 2.432-.669 3.643l1.687 1.687c1.45-.725 2.355-1.204 3.642-.669 1.378.572 1.655 1.738 2.1 3.047m3.094 1h-3.803c-.681-1.918-.785-2.713-1.773-3.123-1.005-.419-1.731.132-3.466.952l-2.689-2.689c.873-1.837 1.367-2.465.953-3.465-.412-.991-1.192-1.087-3.123-1.773v-3.804c1.906-.678 2.712-.782 3.123-1.773.411-.991-.071-1.613-.953-3.466l2.689-2.688c1.741.828 2.466 1.365 3.465.953.992-.412 1.082-1.185 1.775-3.124h3.802c.682 1.918.788 2.714 1.774 3.123 1.001.416 1.709-.119 3.467-.952l2.687 2.688c-.878 1.847-1.361 2.477-.952 3.465.411.992 1.192 1.087 3.123 1.774v3.805c-1.906.677-2.713.782-3.124 1.773-.403.975.044 1.561.954 3.464l-2.688 2.689c-1.728-.82-2.467-1.37-3.456-.955-.988.41-1.08 1.146-1.785 3.126",
  world:
    "M12.02 0c6.614.011 11.98 5.383 11.98 12 0 6.623-5.376 12-12 12-6.623 0-12-5.377-12-12 0-6.617 5.367-11.989 11.981-12h.039zm3.694 16h-7.427c.639 4.266 2.242 7 3.713 7 1.472 0 3.075-2.734 3.714-7m6.535 0h-5.523c-.426 2.985-1.321 5.402-2.485 6.771 3.669-.76 6.671-3.35 8.008-6.771m-14.974 0h-5.524c1.338 3.421 4.34 6.011 8.009 6.771-1.164-1.369-2.059-3.786-2.485-6.771m-.123-7h-5.736c-.331 1.166-.741 3.389 0 6h5.736c-.188-1.814-.215-3.925 0-6m8.691 0h-7.685c-.195 1.8-.225 3.927 0 6h7.685c.196-1.811.224-3.93 0-6m6.742 0h-5.736c.062.592.308 3.019 0 6h5.736c.741-2.612.331-4.835 0-6m-12.825-7.771c-3.669.76-6.671 3.35-8.009 6.771h5.524c.426-2.985 1.321-5.403 2.485-6.771m5.954 6.771c-.639-4.266-2.242-7-3.714-7-1.471 0-3.074 2.734-3.713 7h7.427zm-1.473-6.771c1.164 1.368 2.059 3.786 2.485 6.771h5.523c-1.337-3.421-4.339-6.011-8.008-6.771",
  heart:
    "m7.234 3.004c-2.652 0-5.234 1.829-5.234 5.177 0 3.725 4.345 7.727 9.303 12.54.194.189.446.283.697.283s.503-.094.697-.283c4.977-4.831 9.303-8.814 9.303-12.54 0-3.353-2.58-5.168-5.229-5.168-1.836 0-3.646.866-4.771 2.554-1.13-1.696-2.935-2.563-4.766-2.563zm0 1.5c1.99.001 3.202 1.353 4.155 2.7.14.198.368.316.611.317.243 0 .471-.117.612-.314.955-1.339 2.19-2.694 4.159-2.694 1.796 0 3.729 1.148 3.729 3.668 0 2.671-2.881 5.673-8.5 11.127-5.454-5.285-8.5-8.389-8.5-11.127 0-1.125.389-2.069 1.124-2.727.673-.604 1.625-.95 2.61-.95z",
};

type CardProps = {
  icon: keyof typeof CardIcon;
  title: string;
  color: string;
  children: ReactNode;
};

const Card = ({ icon, children, title, color }: CardProps) => {
  return (
    <li className="rounded-lg border border-black/20 bg-neutral-100 p-5 shadow-md">
      <svg
        className={`aspect-square h-[5rem] w-[5rem] rounded-full ${color} fill-white p-3`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d={CardIcon[icon]} />
      </svg>

      <h3 className="mt-5 text-xl font-bold capitalize">{title}</h3>

      <p className="mt-2 text-neutral-500">{children}</p>
    </li>
  );
};

type TestimonialCardProps = {
  title: string;
  name: string;
  children: ReactNode;
};

const TestimonialCard = ({ children, name, title }: TestimonialCardProps) => {
  return (
    <li className="card flex flex-col p-5">
      <svg
        className="aspect-square w-10 text-gray-400"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
          fill="currentColor"
        />
      </svg>

      <h2 className="mt-6 truncate text-xl font-bold capitalize">{title}</h2>
      <p className="text-md truncate capitalize text-neutral-700">{name}</p>
      <p className="mt-2 line-clamp-5">{children}</p>
    </li>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>RefugEAP</title>
        <meta name="description" content="RefugEAP" />
        <link rel="icon" href="/favicon.icon" />
      </Head>

      <main className="">
        <section className="flex min-h-screen flex-col">
          <div className="mx-auto mt-auto mb-20 flex max-w-7xl flex-col items-center gap-10 p-5 text-center">
            <h2 className="mt-10 text-5xl font-bold capitalize tracking-wide text-white">
              we help to <mark className="highlight-primary">build</mark>
              <br />
              your dream
            </h2>

            <p className="text-xl text-neutral-100 lg:max-w-[50%]">
              The RefugEAP is an organisation that helps refugees to build their
              dream by providing them with the necessary tools to succeed in
              their academic journey.
            </p>

            <Link
              href={"#how-to-volunteer"}
              scroll={false}
              className="button-primary"
            >
              let&apos;s join!
            </Link>
          </div>

          <Image
            src={backgroundImage}
            priority
            alt="background-image"
            className="fixed inset-0 -z-10 h-full w-full object-cover"
          />
        </section>

        <section className="bg-neutral-200 py-10">
          <div className="mx-auto grid max-w-7xl p-5">
            <h2 className="mb-10 text-center text-4xl font-bold capitalize">
              our objectives
            </h2>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-10">
              <Card icon="world" color="bg-sky-500" title="Connect">
                  To connect and support individuals and institutions from across the UK HE sector who are keen to take this work forward
              </Card>

              <Card icon="gear" color="bg-emerald-500" title="Communicate">
                To create new sector-wide systems, where necessary, to optimise communication flow between all stakeholders 
                (including universities, RBSs, potential partner organisations) in order to match opportunities to needs
              </Card>

              <Card icon="school" color="bg-rose-500" title="Oppurtunities">
              To advocate for increased opportunities across the HE sector for RBSs to access pre-sessional EAP provision 
              (or similar) and successfully move onto degree programmes
              </Card>

              <Card icon="school" color="bg-amber-300" title="Share">
                  To gather and share examples of good practice and impact in order to:<br/>
                  A. provide evidence of successful sanctuary initiatives related to facilitating
                   access to EAP to allow individuals/organisations to build strong cases for the 
                   development of similar initiatives within their institutions;<br/>
                  B. provide ideas, strategies and resources to those developing and engaging in sanctuary initiatives
              </Card>
            </ul>
          </div>
        </section>

        <section className="bg-neutral-100 py-20">
          <div className="relative z-10  flex flex-col items-center justify-center py-20 after:absolute after:inset-0 after:-z-10 after:-skew-y-1 after:bg-emerald-700 after:content-[''] ">
            <h2 className="mb-10 text-center text-4xl font-bold capitalize text-white">
              <mark className="highlight">RefugEAP Programme</mark>
            </h2>
            <p className="max-w-xl text-center text-lg text-neutral-100">
              A structured online programme of free non-formal English for
              Academic Purposes (EAP) classes and independent learning
              resources, specifically for refugee-background students.
              <br className="my-5 block content-['']" />
              Classes are taught by dedicated volunteer EAP tutors and have been
              designed with trauma-informed principles in mind
            </p>
            <Link
              href="https://le.ac.uk/cite/sanctuary-seekers-unit/initiatives/refugeap"
              scroll={false}
              className="button mt-10 block w-max"
            >
              RefugEAP Programme
            </Link>
          </div>
        </section>

        <section className="bg-neutral-100 pb-20 pt-10">
          <div
            id="how-to-volunteer"
            className="relative z-10 flex flex-col items-center justify-center py-20 after:absolute after:inset-0 after:-z-10 after:skew-y-1 after:bg-emerald-700 after:content-[''] "
          >
            <h2 className="mb-10 text-center text-4xl font-bold capitalize text-white">
              <mark className="highlight">join us</mark>
            </h2>
            <p className="max-w-xl px-3 text-center text-lg text-neutral-100">
              <br className="my-5 block content-['']" />
              If you are keen to get involved as an active member of the
              RefugEAP Network Working Group (working to help us build content
              for the website) or perhaps a volunteer tutor on the RefugEAP
              Programme, you can fill in this online expression of interest form
            </p>

            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSfy_N8cqvLV2FGPrfWBXR-W64asV0yz4AqdHwDTCiOmH93P7Q/viewform"
              scroll={false}
              target="_blank"
              className="button mt-10 block w-max"
            >
              Expression of Interest Form
            </Link>
          </div>
        </section>

        <section className="bg-neutral-200 py-10">
          <div className="relative isolate mx-auto flex max-w-7xl flex-col items-center p-5">
            <h2 className="mb-10 text-center text-4xl font-bold capitalize">
              join our mailing list
            </h2>
            <p className="max-w-xl text-center">
              You could join the RefugEAP Network by subscribing to our new
              JISCmail discussion list. This functions as a mutual support
              network for individuals and organisations involved and/or
              interested in developing widening participation initiatives for
              refugee-background students to facilitate access to HE via English
              language pathways, with a particular focus on English for Academic
              Purposes. It will also be a place where you can keep up to date
              with what is happening in the Working Group and on the RefugEAP
              Programme (which will sometime put out a call for more volunteer
              tutors via this JISCmail list)
            </p>

            <Link
              href="https://www.jiscmail.ac.uk/cgi-bin/webadmin?SUBED1=REFUGEAP-NETWORK&A=1"
              scroll={false}
              target="_blank"
              className="button-primary mx-auto mt-10 w-max"
            >
              Our Mailing List
            </Link>

            <svg
              className="absolute left-1/2 bottom-0 -z-10 aspect-square h-80 -translate-x-1/2 fill-neutral-300"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M24 3l-3.195 11.716-4.329-3.855 4.154-4.385-5.568 3.849-3.843-.934 12.781-6.391zm-7.988 8.876v4.124l1.735-2.578-1.735-1.546zm-4.136 5.684c-.646.405-1.312.765-1.986 1.069l.492 1.184c.675-.303 1.343-.658 1.992-1.056l-.498-1.197zm3.124-2.408c-.59.581-1.363 1.171-2.042 1.67l.505 1.214c.486-.346 1.087-.758 1.537-1.146v-1.738zm-5.808 5.137c-1.294.457-2.52.711-3.643.711-3.069 0-5.549-1.787-5.549-4.83 0-1.348.457-2.511 1.326-3.392 1-1 2.315-1.489 4.001-1.489 2.533 0 4.338 1.631 4.338 3.903 0 1.022-.369 1.957-1.033 2.62-.564.565-1.305.892-2.032.892-.425 0-.772-.163-.936-.424-.054-.087-.065-.142-.098-.337-.413.478-.848.685-1.457.685-1.076 0-1.761-.804-1.761-2.044 0-1.837 1.206-3.359 2.652-3.359.609 0 .913.152 1.207.609l.108-.38h1.285c-.065.217-.261.88-.315 1.12-.706 2.612-.695 2.504-.695 2.74 0 .447.616.27.967-.011.533-.413.881-1.218.881-2.055 0-1-.468-1.87-1.25-2.359-.489-.293-1.175-.457-1.946-.457-2.294 0-3.903 1.522-3.903 3.675 0 3.446 3.626 4.262 7.361 2.996l.492 1.186zm-3.397-5.282c0-.446-.25-.75-.631-.75-.413 0-.794.271-1.065.783-.261.489-.435 1.13-.435 1.631 0 .576.217.88.631.88.401 0 .782-.315 1.064-.87.262-.511.436-1.174.436-1.674z" />
            </svg>
          </div>
        </section>

        <section className="bg-neutral-100 py-10">
          <div className="mx-auto grid max-w-7xl p-5">
            <h2 className="mb-10 text-center text-4xl font-bold capitalize">
              testimonials
            </h2>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-10">
              <TestimonialCard name="john doe" title="amazing group">
                I love the RefugEAP Network. It is a great group of people who
                are passionate about helping refugees and asylum seekers to
                access higher education.
              </TestimonialCard>
              <TestimonialCard name="micheal doe" title="love the group">
                I am truly grateful to be part of the RefugEAP Network. It is a
                great group of people who are passionate about helping refugees
                and asylum seekers to access higher education.
              </TestimonialCard>
              <TestimonialCard name="martin doe" title="enjoyed the work">
                Yes I am enjoying the work. I am truly grateful to be part of
                the RefugEAP Network. It is a great group of people who are
                passionate about helping refugees and asylum seekers to access
                higher education.
              </TestimonialCard>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
