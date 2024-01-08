import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";

type MemberCardProps = {
  name: string;
  image: string;
  children: ReactNode;
  email: string;
};

const MemberCard = ({ name, email, image, children }: MemberCardProps) => {
  return (
    <li className="group grid grid-rows-[auto_auto_auto_1fr] gap-4 border-b-2 border-black/10 py-20 text-center last:border-none lg:grid-cols-[1fr_1fr]">
      <Image
        src={image}
        priority
        height={256}
        width={256}
        className="col-start-1 row-span-full mx-auto aspect-square w-64 rounded-md border border-black/10 object-cover shadow-lg lg:mx-0"
        alt={`${name} profile picture`}
      />
      <p className="text-xl">
        <strong className="capitalize">{name}</strong>
      </p>
      <p className="text-neutral-600">{children}</p>
      <Link href={`mailto:${email}`}>
        <strong>email:</strong> {email}
      </Link>
    </li>
  );
};

const AboutUsPage = () => {
  return (
    <>
      <Head>
        <title>Our Team | RefugEAP</title>
        <meta name="description" content="RefugEAP" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mt-32">
        <section className="mx-auto grid max-w-7xl p-5">
          <h2 className="text-center text-4xl font-bold capitalize">
            <mark className="highlight-primary">our team</mark>
          </h2>
          <ul className="flex flex-col">
            <MemberCard
              name="Aleks Palanac"
              image="/aleks-palanac.jpg"
              email="ap417@le.ac.uk"
            >
              Aleks Palanac is Convenor of the RefugEAP Network and Head of
              Sanctuary at the University of Leicester. She has been heavily
              involved in developing its University of Sanctuary initiatives,
              particularly by widening participation to HE for asylum seekers
              and refugees through trauma-informed English language provision
              (ESOL and EAP)
            </MemberCard>
            <MemberCard
              name="Dr Tomasz John"
              image="/tomasz.jpg"
              email="tomasz.john@strath.ac.uk"
            >
              Dr Tomasz John (he/him) is a Teaching Fellow in TESOL and
              Intercultural Communication at University of Strathclyde
              (Glasgow). Tomasz worked as an EAP practitioner and Head of EAP
              for over 10 years. He&apos;s a Co-convener and Comms Officer of
              the BALEAP EAP4SJ SIG. Tomasz is passionate about ethical and
              comprehensive internationalisation of HE, decolonisation of
              curriculum and representation in ELT
            </MemberCard>
            <MemberCard
              name="Iwona Winiarska-Pringle"
              image="/Iwona.jpg"
              email="iwona.winiarska-pringle@glasgow.ac.uk"
            >
              Iwona Winiarska-Pringle is an English for Academic Purposes
              Lecturer at the University of Glasgow with an additional role of
              overseeing refugee-background students support provision within
              English for Academic Study. Iwona volunteers with RefugEAP and
              BALEAP EAP for Social Justice SIG. Her professional interests are
              educational dialogue, ethical internationalisation, teacher
              development and relational pedagogies.
            </MemberCard>
            <MemberCard
              name="Paul Breen"
              image="/paul-breen.png"
              email="paul.breen@ucl.ac.uk"
            >
              Paul Breen is a Senior Digital Learning Developer and Senior
              Lecturer in EAP with UCL&apos;s Academic Communication Centre. He
              gained his Masters and PhD qualifications at The University of
              Manchester in the field of Education, with a particular focus on
              English Language Teaching, English for Academic Purposes and
              Educational Technology. He has worked in academic and media
              contexts in Britain, Ireland and overseas. His publications
              include both academic and non-academic output, ranging from
              textbooks to the 2018 book version of his PhD, entitled Developing
              Educators for the Digital Age.
            </MemberCard>
            <MemberCard
              name="Sadie-Jade Fouracre-Reynolds"
              image="/sadie-jade.jpg"
              email="s.fouracre-reynolds@swansea.ac.uk"
            >
              Sadie-Jade Fouracre-Reynolds is a language teacher of two decades
              with a background in science. She has worked in a wide range of
              contexts including EAP, ESOL, EAL and CLIL. A combination of
              teaching experience, course development, material creation and
              outreach project management has fed into her work with vulnerable
              communities and development of teacher support and mentoring
              programmes.
            </MemberCard>
            <MemberCard
              name="Amelia Harker"
              image="/amelia-harker.png"
              email="Amelia.Harker@ed.ac.uk"
            >
              Amelia Harker is the English Language for Widening Participation
              Coordinator at the University of Edinburgh and an English Language
              Education Teaching Fellow. She has taught English for Academic
              Purposes for 15 years but still identifies as a Sociologist whose
              research interests include: Widening Participation,
              Internationalisation, Student Voice, Criticality in Higher
              Education, Critical Pedagogy, and EAP for Social Justice. Her
              emerging expertise is in Refugee and Asylum Seeker support and
              Trauma Informed Practice.
            </MemberCard>
            <MemberCard
              name="Jennifer Cowell"
              image="/Jennifer.png"
              email="jennifer.cowell@stir.ac.uk "
            >
              Jennifer Cowell works at the University of Stirling and leads on a
              variety of university-wide in-sessional provisions, including the
              new Academic and Business English ESAPs in the Business School.
              She is also: a member of the QAA advisory group for the updated
              Linguistics benchmark statement (2022); practitioner advisor for
              TESOLgraphics; an executive committee member of SATEFL; and a
              tutor at the Stirling School of English. Jen is passionate about:
              designing accessible and inclusive learning materials which
              motivate students&apos; learning; promoting decolonisation of the
              curriculum; and widening participation.
            </MemberCard>
          </ul>
        </section>
      </main>
    </>
  );
};

export default AboutUsPage;
