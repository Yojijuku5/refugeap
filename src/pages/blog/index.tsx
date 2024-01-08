import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { BlogCard, BlogCardSkeleton } from "../../components/BlogCard";
import { Modal, useModal } from "../../components/Modal";
import { NewBlogForm } from "../../components/NewBlogForm";
import { api } from "../../utils/api";

const BlogPage = () => {
  const newBlogModal = useModal();
  const router = useRouter();
  const { data: session } = useSession();

  const blogsQuery = api.blog.all.useQuery();

  const addNewItemClickHandler = () => {
    if (!session) {
      return void router.push("/sign-in");
    }

    newBlogModal.open();
  };

  return (
    <>
      <Head>
        <title>Blogs | RefugEAP</title>
        <meta name="description" content="Blog Page for the RefugEAP" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto min-h-screen max-w-7xl p-5 pt-32">
        <ul className="grid gap-10 [grid-template-columns:repeat(auto-fill,minmax(min(400px,100%),1fr))]">
          {blogsQuery.isLoading || !blogsQuery.data ? (
            <BlogCardSkeleton />
          ) : (
            <>
              {blogsQuery.data.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </>
          )}
        </ul>
      </main>

      <button className="button-add" onClick={addNewItemClickHandler}>
        +
      </button>

      {newBlogModal.isOpen && (
        <Modal
          closeHandler={newBlogModal.close}
          isClosing={newBlogModal.isClosing}
        >
          <NewBlogForm closeHandler={newBlogModal.close} />
        </Modal>
      )}
    </>
  );
};

export default BlogPage;
