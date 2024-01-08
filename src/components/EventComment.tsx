import type { EventComment } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { ZodError } from "zod";
import { updateCommentEventSchema } from "../schemas/eventSchema";
import { api, type RouterOutputs } from "../utils/api";
import { Avatar } from "./Avatar";
import Loader from "./Loader";
import { Modal, useModal } from "./Modal";
import { TextArea } from "./TextArea";

type Props = {
  closeHandler: () => void;
  comment: EventComment;
};

const defaultFormErrorValues = {
  content: "",
};

const EditCommentForm = ({ closeHandler, comment }: Props) => {
  const router = useRouter();
  const utils = api.useContext();
  const [isLoading, setIsLoading] = useState(false);
  const defaultFormValues = { content: comment.content };
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [errorFormValues, setErrorFormValues] = useState(
    defaultFormErrorValues
  );

  const updateCommentMutation = api.event.updateComment.useMutation({
    onSuccess: () => {
      closeHandler();
    },

    onError: (error) => {
      setErrorFormValues({
        content: error.data?.zodError?.fieldErrors["content"]?.at(0) ?? "",
      });
    },

    onMutate: () => {
      setErrorFormValues(defaultFormErrorValues);
    },

    onSettled: async (data) => {
      setIsLoading(() => false);

      if (!data) {
        return;
      }

      await utils.event.byId.invalidate({ id: router.query.id as string });
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

      const data = { ...formValues, id: comment.id };

      updateCommentEventSchema.parse(data);

      setIsLoading(() => true);

      updateCommentMutation.mutate(data);
    } catch (error) {
      if (error instanceof ZodError) {
        setErrorFormValues({
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
      <h1 className="mb-5 text-center text-2xl capitalize">update comment</h1>

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

const timeSince = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return `${Math.floor(interval)} years`;
  }

  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)} months`;
  }

  interval = seconds / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)} days`;
  }

  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)} hours`;
  }

  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)} minutes`;
  }

  return `${Math.floor(interval)} seconds`;
};

const UpdateCommentButton = ({ comment }: CommentProps) => {
  const { data: session } = useSession();
  const modal = useModal();

  if (!session?.user?.isAdmin && comment.userId !== session?.user?.id) {
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
          <EditCommentForm closeHandler={modal.close} comment={comment} />
        </Modal>
      )}
    </>
  );
};

const RemoveCommentButton = ({ comment }: CommentProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const utils = api.useContext();
  const modal = useModal();
  const EventId = (router.query.id as string) ?? "";

  const removeCommentMutation = api.event.removeComment.useMutation({
    onSuccess: () => {
      modal.close();
    },

    onSettled: async () => {
      await utils.event.byId.invalidate({
        id: EventId,
      });
    },

    onMutate: async ({ id }) => {
      await utils.event.byId.cancel({ id: EventId });
      const currentEvent = utils.event.byId.getData({ id: EventId });
      if (!currentEvent) {
        return;
      }
      utils.event.byId.setData(
        { id: EventId },
        {
          ...currentEvent,
          comments: currentEvent.comments.filter(
            (comment) => comment.id !== id
          ),
        }
      );
    },
  });

  const removeItemHandler = () => {
    removeCommentMutation.mutate({ id: comment.id });
  };

  if (!session?.user?.isAdmin && comment.userId !== session?.user?.id) {
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
              remove comment
            </h1>

            <button className="button mr-10 px-10" onClick={modal.close}>
              cancel
            </button>

            <button className="button-remove px-10" onClick={removeItemHandler}>
              remove
              {removeCommentMutation.isLoading && <Loader />}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

type CommentProps = {
  comment: NonNullable<RouterOutputs["event"]["byId"]>["comments"][0];
};

export const CommentEvent = ({ comment }: CommentProps) => {
  return (
    <li className="group grid grid-cols-[auto_auto_auto_auto_1fr] gap-x-3 gap-y-1">
      <Avatar image={comment.user.image ?? ""} className="row-span-2" />

      <p className="self-center font-semibold">
        {comment.user.name || comment.user.email?.split("@")[0]}
      </p>

      <p className="self-center text-sm italic text-neutral-500">
        {timeSince(comment.updatedAt)} ago
      </p>

      <p className="col-span-3 col-start-2 row-start-2">{comment.content}</p>

      <div className="space-x-22 row-span-2 ml-auto space-x-2 opacity-0 duration-300 group-hover:opacity-100">
        <UpdateCommentButton comment={comment} />
        <RemoveCommentButton comment={comment} />
      </div>
    </li>
  );
};
