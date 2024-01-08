import type { Event, User } from "@prisma/client";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, type ComponentProps, type MouseEvent } from "react";
import superjson from "superjson";
import { ZodError } from "zod";
import { Avatar } from "../../components/Avatar";
import { CommentEvent } from "../../components/EventComment";
import Loader from "../../components/Loader";
import { Modal, useModal } from "../../components/Modal";
import { TextArea } from "../../components/TextArea";
import { UpdateEventForm } from "../../components/UpdateEventForm";
import { addCommentToEventSchema } from "../../schemas/eventSchema";
import { appRouter } from "../../server/api/root";
import { createTRPCContext } from "../../server/api/trpc";
import { prisma } from "../../server/db";
import { api } from "../../utils/api";

type RemoveItemButtonProps = {
  eventId: Event["id"];
  authorId: User["id"];
};

const RemoveItemButton = ({ eventId, authorId }: RemoveItemButtonProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const utils = api.useContext();
  const modal = useModal();

  const removeEventMutation = api.event.remove.useMutation({
    onSuccess: async () => {
      await router.push("/events");
    },

    onSettled: async () => {
      await utils.event.all.invalidate();
    },

    onMutate: async ({ id }) => {
      await utils.event.all.cancel();

      const previousEvents = utils.event.all.getData() ?? [];

      utils.event.all.setData(
        undefined,
        previousEvents.filter((event) => event.id !== id)
      );
    },
  });

  const removeItemHandler = () => {
    removeEventMutation.mutate({ id: eventId });
  };

  if (!session?.user?.isAdmin && authorId !== session?.user?.id) {
    return null;
  }

  return (
    <>
      <button
        className="button-remove aspect-square w-10 fill-neutral-200 p-2"
        onClick={modal.open}
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="m4.015 5.494h-.253c-.413 0-.747-.335-.747-.747s.334-.747.747-.747h5.253v-1c0-.535.474-1 1-1h4c.526 0 1 .465 1 1v1h5.254c.412 0 .746.335.746.747s-.334.747-.746.747h-.254v15.435c0 .591-.448 1.071-1 1.071-2.873 0-11.127 0-14 0-.552 0-1-.48-1-1.071zm14.5 0h-13v15.006h13zm-4.25 2.506c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75s.75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75zm-4.5 0c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75s.75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75zm3.75-4v-.5h-3v.5z" />
        </svg>
      </button>

      {modal.isOpen && (
        <Modal closeHandler={modal.close} isClosing={modal.isClosing}>
          <div className="grid grid-cols-2 place-items-center whitespace-nowrap">
            <h1 className="col-span-full  mb-20 text-center text-2xl capitalize">
              remove event
            </h1>

            <button className="button mr-10 px-10" onClick={modal.close}>
              cancel
            </button>

            <button className="button-remove px-10" onClick={removeItemHandler}>
              remove
              {removeEventMutation.isLoading && <Loader />}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

type UpdateEventButtonProps = {
  authorId: User["id"];
} & Pick<ComponentProps<typeof UpdateEventForm>, "event">;

const UpdateEventButton = ({ authorId, event }: UpdateEventButtonProps) => {
  const { data: session } = useSession();
  const modal = useModal();

  if (!session?.user?.isAdmin && authorId !== session?.user?.id) {
    return null;
  }

  return (
    <>
      <button
        className="button aspect-square w-10 fill-current p-2"
        onClick={modal.open}
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="m9.134 19.319 11.587-11.588c.171-.171.279-.423.279-.684 0-.229-.083-.466-.28-.662l-3.115-3.104c-.185-.185-.429-.277-.672-.277s-.486.092-.672.277l-11.606 11.566c-.569 1.763-1.555 4.823-1.626 5.081-.02.075-.029.15-.029.224 0 .461.349.848.765.848.511 0 .991-.189 5.369-1.681zm-3.27-3.342 2.137 2.137-3.168 1.046zm.955-1.166 10.114-10.079 2.335 2.327-10.099 10.101z" />
        </svg>
      </button>

      {modal.isOpen && (
        <Modal closeHandler={modal.close} isClosing={modal.isClosing}>
          <UpdateEventForm closeHandler={modal.close} event={event} />
        </Modal>
      )}
    </>
  );
};

const NewCommentForm = ({ image }: Parameters<typeof Avatar>[0]) => {
  const [content, setContent] = useState("");
  const [contentError, setContentError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const utils = api.useContext();
  const eventId = router.query.id as string;

  const commentMutation = api.event.addComment.useMutation({
    onSuccess: () => {
      setContent("");
    },

    onError: (error) => {
      setContentError(
        error.data?.zodError?.fieldErrors["content"]?.at(0) ?? ""
      );
    },

    onMutate: () => {
      setContentError("");
    },

    onSettled: async () => {
      setIsLoading(() => false);
      await utils.event.byId.invalidate({ id: router.query.id as string });
    },
  });

  const cancelHandler = (e: MouseEvent<HTMLButtonElement>) => {
    setContent("");
    e.currentTarget.blur();
  };

  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      return router.push("/sign-in");
    }

    try {
      addCommentToEventSchema.parse({ content, id: eventId });

      setIsLoading(() => true);

      commentMutation.mutate({ content, id: eventId });
    } catch (error) {
      if (error instanceof ZodError) {
        setContentError(error.formErrors.fieldErrors["content"]?.at(0) ?? "");
      }
    }
  };

  return (
    <form
      className="group grid grid-cols-[auto_1fr_auto_auto] gap-y-2 gap-x-5"
      onSubmit={(e) => void submitHandler(e)}
    >
      <Avatar image={image} />
      <TextArea
        textAreaProps={{
          value: content,
          onChange: changeHandler,
          rows: 2,
        }}
        labelText="Leave a comment"
        errorText={contentError}
        containerStyle="col-start-2 col-span-full"
      />
      <button
        className="button col-start-3 hidden group-focus-within:block"
        type="button"
        onClick={(e) => cancelHandler(e)}
      >
        cancel
      </button>
      <button className="button-primary col-start-4 hidden px-10 group-focus-within:block">
        Post
        {isLoading && <Loader />}
      </button>
    </form>
  );
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const EventDetailsPage = ({ id }: Props) => {
  const { data: session } = useSession();

  const eventQuery = api.event.byId.useQuery({ id });

  if (eventQuery.isLoading || !eventQuery.data) {
    return null;
  }

  return (
    <>
      <Head>
        <title>RefugEAP</title>
        <meta name="description" content="RefugEAP" />
        <link rel="icon" href="/favicon.icon" />
      </Head>

      <main className="mx-auto mt-32 flex min-h-screen max-w-7xl flex-col gap-5 px-5">
        <header className="grid grid-flow-col grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] items-center gap-x-5 truncate">
          <div className="col-start-1 row-span-full aspect-square w-16 rounded-lg bg-emerald-700/20 p-2 text-center text-emerald-700">
            <p className="font-bold">
              {eventQuery.data.date.toLocaleDateString("en-US", {
                day: "2-digit",
              })}
            </p>
            <p>
              {eventQuery.data.date.toLocaleDateString("en-US", {
                month: "short",
              })}
            </p>
          </div>

          <h2 className="truncate text-xl font-bold capitalize">
            {eventQuery.data.title}
          </h2>

          <div className="flex items-center truncate fill-current text-neutral-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="aspect-square min-w-[16px] max-w-[16px]"
            >
              <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
            </svg>
            <p className="ml-1 truncate">{eventQuery.data.address}</p>
          </div>

          <div className="row-span-full m-auto space-x-2">
            <UpdateEventButton
              event={eventQuery.data}
              authorId={eventQuery.data.userId}
            />

            <RemoveItemButton
              eventId={eventQuery.data.id}
              authorId={eventQuery.data.userId}
            />
          </div>
        </header>

        <p>{eventQuery.data.description}</p>

        <h2 className="mt-20 text-2xl font-bold capitalize">
          {eventQuery.data.comments.length} comments
        </h2>

        <NewCommentForm image={session?.user?.image || ""} />

        <ul className="my-10 space-y-7">
          {eventQuery.data.comments.map((comment) => (
            <CommentEvent key={comment.id} comment={comment} />
          ))}
        </ul>
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const events = await prisma.event.findMany({});

  const paths = events.map((item) => ({
    params: { id: item.id },
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps = async (
  ctx: GetStaticPropsContext<{ id: string }>
) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createTRPCContext(),
    transformer: superjson,
  });

  const id = ctx.params?.id as string;

  await ssg.event.byId.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
    revalidate: 1,
  };
};

export default EventDetailsPage;
