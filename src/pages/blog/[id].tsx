import type { Blog, User } from "@prisma/client";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { type ComponentProps, useState, type MouseEvent } from "react";
import superjson from "superjson";
import { ZodError } from "zod";
import { Avatar } from "../../components/Avatar";
import { CommentBlog } from "../../components/BlogComment";
import { EditBlogForm } from "../../components/EditBlogForm";
import Loader from "../../components/Loader";
import { Modal, useModal } from "../../components/Modal";
import { TextArea } from "../../components/TextArea";
import { addCommentToEventSchema } from "../../schemas/eventSchema";
import { appRouter } from "../../server/api/root";
import { createTRPCContext } from "../../server/api/trpc";
import { prisma } from "../../server/db";
import { api } from "../../utils/api";

type RemoveBlogButtonProps = {
  blogId: Blog["id"];
  authorId: User["id"];
};
type EditBlogButtonProps = {
  authorId: User["id"];
} & Pick<ComponentProps<typeof EditBlogForm>, "blog">;

const NewCommentForm = ({ image }: Parameters<typeof Avatar>[0]) => {
  const [content, setContent] = useState("");
  const [contentError, setContentError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const utils = api.useContext();
  const eventId = router.query.id as string;

  const commentMutation = api.blog.addComment.useMutation({
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
      await utils.blog.byId.invalidate({ id: router.query.id as string });
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
        onClick={cancelHandler}
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

const BlogDetailsPage = ({ id }: Props) => {
  const { data: session } = useSession();

  const blogQuery = api.blog.byId.useQuery({ id });

  if (blogQuery.isLoading || !blogQuery.data) {
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
        <header className="grid grid-flow-col grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] items-center gap-x-5">
          <Avatar image={blogQuery.data.user.image} />

          <h2 className="truncate text-xl font-bold capitalize">
            {blogQuery.data.title}
          </h2>
          <p className="text-md truncate text-neutral-700">
            {blogQuery.data.user.name ||
              blogQuery.data.user.email?.split("@")[0]}
          </p>

          <div className="row-span-full m-auto space-x-2">
            <EditBlogButton
              authorId={blogQuery.data.userId}
              blog={blogQuery.data}
            />
            <RemoveBlogButton
              authorId={blogQuery.data.userId}
              blogId={blogQuery.data.id}
            />
          </div>
        </header>

        <p>{blogQuery.data.content}</p>

        <h2 className="mt-20 text-2xl font-bold capitalize">
          {blogQuery.data.comments.length} comments
        </h2>

        <NewCommentForm image={session?.user?.image || ""} />

        <ul className="my-10 space-y-7">
          {blogQuery.data.comments.map((comment) => (
            <CommentBlog key={comment.id} comment={comment} />
          ))}
        </ul>
      </main>
    </>
  );
};

const EditBlogButton = ({ authorId, blog }: EditBlogButtonProps) => {
  const { data: session } = useSession();
  const modal = useModal();

  if (!session?.user?.isAdmin && authorId !== session?.user?.id) {
    return null;
  }
  return (
    <>
      <button
        className="button col-start-3 row-span-full row-start-1 aspect-square w-10 fill-current p-2"
        onClick={modal.open}
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="m9.134 19.319 11.587-11.588c.171-.171.279-.423.279-.684 0-.229-.083-.466-.28-.662l-3.115-3.104c-.185-.185-.429-.277-.672-.277s-.486.092-.672.277l-11.606 11.566c-.569 1.763-1.555 4.823-1.626 5.081-.02.075-.029.15-.029.224 0 .461.349.848.765.848.511 0 .991-.189 5.369-1.681zm-3.27-3.342 2.137 2.137-3.168 1.046zm.955-1.166 10.114-10.079 2.335 2.327-10.099 10.101z" />
        </svg>
      </button>

      {modal.isOpen && (
        <Modal closeHandler={modal.close} isClosing={modal.isClosing}>
          <EditBlogForm closeHandler={modal.close} blog={blog} />
        </Modal>
      )}
    </>
  );
};

const RemoveBlogButton = ({ blogId, authorId }: RemoveBlogButtonProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const utils = api.useContext();
  const modal = useModal();

  const removeBlogMutation = api.blog.remove.useMutation({
    onSuccess: async () => {
      await router.push("/blog");
    },

    onSettled: async () => {
      await utils.blog.all.invalidate();
    },

    onMutate: async ({ id }) => {
      await utils.blog.all.cancel();

      const previousBlogs = utils.blog.all.getData() ?? [];

      utils.blog.all.setData(
        undefined,
        previousBlogs.filter((blog) => blog.id !== id)
      );
    },
  });

  const removeBlogHandler = () => {
    removeBlogMutation.mutate({ id: blogId });
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
              remove blog post
            </h1>

            <button className="button mr-10 px-10" onClick={modal.close}>
              cancel
            </button>

            <button className="button-remove px-10" onClick={removeBlogHandler}>
              remove
              {removeBlogMutation.isLoading && <Loader />}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const blogs = await prisma.blog.findMany({});

  const paths = blogs.map((item) => ({
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

  await ssg.blog.byId.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
    revalidate: 1,
  };
};

export default BlogDetailsPage;
