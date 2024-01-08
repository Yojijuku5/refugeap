import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ItemCard, ItemCardSkeleton } from "../../components/ItemCard";
import { Modal, useModal } from "../../components/Modal";
import NewItemForm from "../../components/NewItemForm";
import { api } from "../../utils/api";

const ItemsPage = () => {
  const newItemModal = useModal();
  const router = useRouter();
  const { data: session } = useSession();
  const itemsQuery = api.item.all.useQuery();

  const addNewItemClickHandler = () => {
    if (!session) {
      return void router.push("/sign-in");
    }

    newItemModal.open();
  };

  return (
    <>
      <Head>
        <title>Items | RefugEAP</title>
        <meta name="description" content="RefugEAP" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-5 py-10 pt-32">
        {itemsQuery.isLoading || !itemsQuery.data ? (
          <ItemCardSkeleton />
        ) : (
          <>
            {itemsQuery.data.map((item) => (
              <ItemCard key={item.id} item={item} author={item.user} />
            ))}
          </>
        )}
      </main>

      {newItemModal.isOpen && (
        <Modal
          closeHandler={newItemModal.close}
          isClosing={newItemModal.isClosing}
        >
          <NewItemForm closeHandler={newItemModal.close} />
        </Modal>
      )}

      <button className="button-add" onClick={addNewItemClickHandler}>
        +
      </button>
    </>
  );
};

export default ItemsPage;
