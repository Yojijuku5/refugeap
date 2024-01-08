import type { Item, User } from "@prisma/client";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import superjson from "superjson";
import { ItemCard } from "../../components/ItemCard";
import Loader from "../../components/Loader";
import { Modal, useModal } from "../../components/Modal";
import { SelectedProductCarousel } from "../../components/SelectedItemCarousel";
import { appRouter } from "../../server/api/root";
import { createTRPCContext } from "../../server/api/trpc";
import { prisma } from "../../server/db";
import { api, type RouterOutputs } from "../../utils/api";

type RemoveItemButtonProps = {
  itemId: Item["id"];
  authorId: User["id"];
};

const RemoveItemButton = ({ itemId, authorId }: RemoveItemButtonProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const utils = api.useContext();
  const modal = useModal();

  const removeItemMutation = api.item.remove.useMutation({
    onSuccess: async () => {
      await router.push("/items");
    },

    onSettled: async () => {
      await utils.item.all.invalidate();
    },

    onMutate: async ({ id }) => {
      await utils.item.all.cancel();

      const previousItems = utils.item.all.getData() ?? [];

      utils.item.all.setData(
        undefined,
        previousItems.filter((item) => item.id !== id)
      );
    },
  });

  const removeItemHandler = () => {
    removeItemMutation.mutate({ id: itemId });
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
              remove item
            </h1>

            <button className="button mr-10 px-10" onClick={modal.close}>
              cancel
            </button>

            <button className="button-remove px-10" onClick={removeItemHandler}>
              remove
              {removeItemMutation.isLoading && <Loader />}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

type ItemDetailsProps = {
  item: NonNullable<RouterOutputs["item"]["byId"]>;
};

const ItemDetails = ({ item }: ItemDetailsProps) => {
  return (
    <section>
      <div className="flex items-center space-x-2">
        <h2 className="flex-1 text-2xl font-bold capitalize">{item.title}</h2>
        <RemoveItemButton itemId={item.id} authorId={item.userId} />
      </div>

      <h3 className="mt-10 font-bold capitalize">description</h3>
      <p>{item.description}</p>

      <h3 className="mt-10 font-bold capitalize">location</h3>
      <p>{item.location}</p>

      <h3 className="mt-10 font-bold capitalize">contact</h3>
      <p>{item.user.email}</p>
    </section>
  );
};

type OtherItemsProps = {
  item: NonNullable<RouterOutputs["item"]["byId"]>;
};

const OtherItems = ({ item }: OtherItemsProps) => {
  return (
    <section className="mt-10 lg:col-span-full">
      <h2 className="my-10 text-2xl">
        Other From {item.user.name ?? item.user.email?.split("@")[0]}
      </h2>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-10">
        {item.user.items.map((userItem) => (
          <ItemCard item={userItem} author={item.user} key={userItem.id} />
        ))}
      </div>
    </section>
  );
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const ItemDetailsPage = ({ id }: Props) => {
  const itemQuery = api.item.byId.useQuery({ id });

  if (itemQuery.isLoading || !itemQuery.data) {
    return null;
  }

  return (
    <>
      <Head>
        <title>RefugEAP</title>
        <meta name="description" content="RefugEAP" />
        <link rel="icon" href="/favicon.icon" />
      </Head>

      <main className="mx-auto mt-32 mb-10 grid min-h-screen max-w-7xl grid-rows-[auto,auto,auto] gap-10 p-5 lg:grid-cols-[auto,1fr] lg:grid-rows-[auto,auto]">
        <SelectedProductCarousel images={itemQuery.data.images} />

        <ItemDetails item={itemQuery.data} />

        {itemQuery.data.user.items.length > 0 && (
          <OtherItems item={itemQuery.data} />
        )}
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const items = await prisma.item.findMany({});

  const paths = items.map((item) => ({
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

  await ssg.item.byId.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
    revalidate: 1,
  };
};

export default ItemDetailsPage;
