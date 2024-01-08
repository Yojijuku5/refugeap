import { useSession } from "next-auth/react";
import Head from "next/head";
import { EventCard, EventCardSkeleton } from "../../components/EventCard";
import { Modal, useModal } from "../../components/Modal";
import { NewEventForm } from "../../components/NewEventForm";
import { api } from "../../utils/api";

const EventsPage = () => {
  const { data: session } = useSession();
  const newEventModal = useModal();

  const eventsQuery = api.event.all.useQuery();

  return (
    <>
      <Head>
        <title>Events | RefugEAP</title>
        <meta name="description" content="Event Page for the RefugEAP" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto min-h-screen max-w-7xl p-5 pt-32">
        <ul className="grid gap-10 [grid-template-columns:repeat(auto-fill,minmax(min(400px,100%),1fr))]">
          {eventsQuery.isLoading || !eventsQuery.data ? (
            <EventCardSkeleton />
          ) : (
            <>
              {eventsQuery.data?.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </>
          )}
        </ul>
      </main>

      {newEventModal.isOpen && (
        <Modal
          closeHandler={newEventModal.close}
          isClosing={newEventModal.isClosing}
        >
          <NewEventForm closeHandler={newEventModal.close} />
        </Modal>
      )}

      {session?.user?.isAdmin && (
        <button className="button-add" onClick={newEventModal.open}>
          +
        </button>
      )}
    </>
  );
};

export default EventsPage;
