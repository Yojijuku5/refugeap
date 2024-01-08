import { type ReactNode, useState, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const open = () => {
    setIsOpen(() => true);
    setIsClosing(() => false);
  };

  const close = () => {
    setIsClosing(() => true);
    setTimeout(() => setIsOpen(() => false), 300);
  };

  return { isOpen, open, close, isClosing };
};

const CloseButton = ({ closeHandler }: { closeHandler: () => void }) => {
  return (
    <button
      onClick={closeHandler}
      className="button absolute right-5 top-5 aspect-square w-10 p-2"
    >
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
      </svg>
    </button>
  );
};

const ModalContainer = (props: NonNullable<PropsWithChildren>) => {
  const { children } = props;

  return (
    <div className="relative h-full max-h-screen w-full animate-scale-up-small overflow-auto bg-neutral-100 p-10 lg:h-max lg:w-max lg:rounded-lg">
      {children}
    </div>
  );
};

type BackdropProps = NonNullable<PropsWithChildren> & Pick<Props, "isClosing">;

const Backdrop = (props: BackdropProps) => {
  const { children, isClosing } = props;
  return (
    <div
      aria-expanded={!isClosing ? true : false}
      className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/40 backdrop-blur-lg aria-[expanded=false]:animate-fade-out"
    >
      {children}
    </div>
  );
};

type Props = {
  children: ReactNode;
  closeHandler: () => void;
  isClosing: boolean;
};

export const Modal = (props: Props) => {
  const { children, closeHandler, isClosing } = props;
  const container = document.getElementById("__next");

  if (!container) {
    return null;
  }

  return createPortal(
    <Backdrop isClosing={isClosing}>
      <ModalContainer>
        <CloseButton closeHandler={closeHandler} />
        {children}
      </ModalContainer>
    </Backdrop>,
    container
  );
};
