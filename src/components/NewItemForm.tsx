import { randomBytes } from "crypto";
import Image, { type ImageProps } from "next/image";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ZodError } from "zod";
import { createImageSchema } from "../schemas/itemSchema";
import { api } from "../utils/api";
import { Input } from "./Input";
import Loader from "./Loader";
import { TextArea } from "./TextArea";

const useUploadImageToS3 = () => {
  const query = api.media.uploadImageToS3.useMutation();

  const upload = async (imagesURL: string[]) => {
    const urls = [];
    for (const imageURL of imagesURL) {
      const res = await fetch(imageURL);
      const blob = await res.blob();

      const data = await query.mutateAsync({ imageExtension: blob.type });
      urls.push(data.url);

      await fetch(data.preSignedUrl, { method: "PUT", body: blob });
    }

    return urls;
  };

  return {
    upload,
  };
};

type SelectedImageProps = {
  clickHandler: (imageId: string) => void;
  imageProps: ImageProps & { src: string; id: string };
};

const SelectedImage = ({ clickHandler, imageProps }: SelectedImageProps) => {
  return (
    <div className="relative">
      <Image
        {...imageProps}
        className="h-14 w-14 rounded-xl"
        width={56}
        height={56}
        alt={imageProps.alt}
      />
      <button
        type="button"
        className="absolute -top-2 -right-2 rounded-full bg-neutral-200 p-1"
        onClick={() => clickHandler(imageProps.id)}
      >
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 fill-current"
        >
          <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
        </svg>
      </button>
    </div>
  );
};

const defaultFormValues: {
  title: "";
  description: "";
  location: "";
  images: { id: string; src: string }[];
} = { title: "", description: "", location: "", images: [] };

const defaultFormErrorValues = {
  title: "",
  description: "",
  location: "",
  images: "",
};

const NewItemForm = ({ closeHandler }: { closeHandler: () => void }) => {
  const utils = api.useContext();
  const uploadImageToS3 = useUploadImageToS3();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [errorFormValues, setErrorFormValues] = useState(
    defaultFormErrorValues
  );

  const createItemMutation = api.item.create.useMutation({
    onSuccess: () => {
      setFormValues(defaultFormValues);
      closeHandler();
    },

    onError: (error) => {
      setErrorFormValues(() => ({
        title: error.data?.zodError?.fieldErrors["title"]?.at(0) ?? "",
        description:
          error.data?.zodError?.fieldErrors["description"]?.at(0) ?? "",
        location: error.data?.zodError?.fieldErrors["location"]?.at(0) ?? "",
        images: error.data?.zodError?.fieldErrors["images"]?.at(0) ?? "",
      }));
    },

    onMutate: () => {
      setErrorFormValues(defaultFormErrorValues);
    },

    onSettled: async () => {
      setIsLoading(() => false);
      await utils.item.all.invalidate();
    },
  });

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const browseFileClickHandler = () => {
    if (!fileInputRef.current) {
      return;
    }

    fileInputRef.current.click();
  };

  const imageSelectionHandler = (event: ChangeEvent<HTMLInputElement>) => {
    for (const file of event.target.files ?? []) {
      setFormValues((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          {
            id: randomBytes(20).toString("hex"),
            src: URL.createObjectURL(file),
          },
        ],
      }));
    }
  };

  const removeSelectedImageHandler = (imageId: string) => {
    setFormValues((prev) => ({
      ...prev,
      images: prev.images.filter((image) => image.id !== imageId),
    }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const imagesURL = formValues.images.map((image) => image.src);

      createImageSchema.parse({ ...formValues, images: imagesURL });

      setIsLoading(() => true);

      const images = await uploadImageToS3.upload(imagesURL);

      createItemMutation.mutate({ ...formValues, images });
    } catch (error) {
      if (error instanceof ZodError) {
        setErrorFormValues({
          title: error.formErrors.fieldErrors["title"]?.at(0) ?? "",
          description: error.formErrors.fieldErrors["description"]?.at(0) ?? "",
          location: error.formErrors.fieldErrors["location"]?.at(0) ?? "",
          images: error.formErrors.fieldErrors["images"]?.at(0) ?? "",
        });
      }
    }
  };

  return (
    <form
      className="flex h-full min-w-[30vw] flex-col gap-5"
      onSubmit={(e) => void submitHandler(e)}
    >
      <h1 className="mb-5 text-center text-2xl capitalize">new item</h1>

      <Input
        labelText="title"
        errorText={errorFormValues.title}
        inputProps={{
          type: "text",
          placeholder: "enter title...",
          value: formValues.title,
          onChange: changeHandler,
          name: "title",
        }}
      />

      <Input
        labelText="location"
        errorText={errorFormValues.location}
        inputProps={{
          type: "text",
          placeholder: "enter location...",
          value: formValues.location,
          onChange: changeHandler,
          name: "location",
        }}
      />

      <TextArea
        labelText="description"
        errorText={errorFormValues.description}
        textAreaProps={{
          placeholder: "enter description...",
          value: formValues.description,
          onChange: changeHandler,
          name: "description",
          rows: 5,
        }}
      />

      <div>
        <p className="capitalize">images:</p>

        <p className="text-red-500">{errorFormValues.images}</p>

        <div className="mt-2 flex gap-5">
          {formValues.images.map((image, index) => (
            <SelectedImage
              key={index}
              imageProps={{
                src: image.src,
                id: image.id,
                alt: `image selected ${index + 1}`,
              }}
              clickHandler={removeSelectedImageHandler}
            />
          ))}
        </div>

        <button
          type="button"
          className="button mt-5"
          onClick={browseFileClickHandler}
        >
          browse
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png, image/jpeg"
            name="file"
            onChange={imageSelectionHandler}
            multiple
          />
        </button>
      </div>

      <button type="submit" className="button-primary mt-auto">
        {isLoading && <Loader />}
        submit
      </button>
    </form>
  );
};

export default NewItemForm;
