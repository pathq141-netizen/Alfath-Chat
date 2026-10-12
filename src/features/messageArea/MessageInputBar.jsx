
import { RiSendPlaneFill, RiImageAddLine } from "react-icons/ri";
import { useUser } from "../authentication/useUser";
import { useRef, useState } from "react";
import { useSendNewMessage } from "./useSendNewMessage";
import { v4 as uuid } from "uuid";
import Loader from "../../components/Loader";
import useConvInfo from "./useConvInfo";
import { uploadChatImage } from "./apiMessage";

const CHAT_IMAGE_PREFIX = "__ALFATHCHAT_IMAGE__:";

function MessageInputBar() {
  const {
    convInfo,
    isPending: isPendingConvInfo,
    isError: isConvInfoError,
  } = useConvInfo();

  const [newMessage, setNewMessage] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { isSending, sendNewMessage } = useSendNewMessage();
  const { user } = useUser();

  const conversationId = convInfo?.id;
  const friendUserId = convInfo?.friendInfo?.id;
  const myUserId = user?.id;

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  function handleSendNewMessage(e) {
    e.preventDefault();

    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (!newMessage.trim() || isSending || isUploadingImage) {
      return;
    }

    const messageObj = {
      id: uuid(),
      conversation_id: conversationId,
      content: newMessage,
      friendUserId,
      sender_id: myUserId,
      created_at: new Date(),
      optimistic: true,
    };

    const messageToSend = newMessage;
    setNewMessage("");

    sendNewMessage(messageObj, {
      onError: (_, message) => {
        setNewMessage(message.content || messageToSend);
      },
    });
  }

  async function handleImageSelected(e) {
    const file = e.target.files?.[0];

    // Allow selecting the same photo again later.
    e.target.value = "";

    if (!file) return;

    if (!myUserId) {
      alert("Lu harus login dulu untuk mengirim foto.");
      return;
    }

    if (isUploadingImage || isSending) return;

    setIsUploadingImage(true);

    try {
      const imageUrl = await uploadChatImage({
        file,
        userId: myUserId,
        conversationId,
      });

      const messageObj = {
        id: uuid(),
        conversation_id: conversationId,
        content: `${CHAT_IMAGE_PREFIX}${imageUrl}`,
        friendUserId,
        sender_id: myUserId,
        created_at: new Date(),
        optimistic: true,
      };

      sendNewMessage(messageObj, {
        onError: () => {
          alert(
            "Foto berhasil diunggah, tetapi pesan gagal dikirim. Coba lagi."
          );
        },
      });
    } catch (error) {
      alert(error.message || "Gagal mengunggah foto.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  if (isConvInfoError) return null;

  const isBusy = isSending || isUploadingImage || isPendingConvInfo;

  return (
    <div className="px-4 py-2">
      <form
        onSubmit={handleSendNewMessage}
        className="mx-auto grid max-w-3xl grid-cols-[auto_1fr_auto] items-center overflow-hidden rounded-full border border-transparent bg-bgPrimary shadow-lg dark:border-LightShade/20 dark:bg-LightShade/20"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleImageSelected}
          disabled={isBusy}
        />

        <button
          type="button"
          aria-label="Pilih foto"
          title="Kirim foto"
          className="m-1 flex h-10 w-10 items-center justify-center rounded-full text-2xl text-bgAccent hover:bg-bgAccent/10 active:scale-95 disabled:opacity-50"
          disabled={isBusy}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploadingImage ? (
            <Loader size="small" />
          ) : (
            <RiImageAddLine />
          )}
        </button>

        <label htmlFor="inputMessage" className="sr-only">
          Pesan
        </label>

        <input
          disabled={isPendingConvInfo || isUploadingImage}
          className="h-12 w-full min-w-0 bg-transparent pl-2 pr-2 outline-none"
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          type="text"
          placeholder="Message"
          id="inputMessage"
          autoComplete="off"
        />

        <button
          className="m-1 flex h-10 w-10 items-center justify-center rounded-full bg-bgAccent text-2xl text-textPrimary-dark hover:bg-bgAccentDim active:scale-95 disabled:opacity-70 dark:bg-bgAccent-dark dark:hover:bg-bgAccentDim-dark"
          disabled={isBusy || !newMessage.trim()}
          type="submit"
          aria-label="Kirim pesan"
        >
          {isSending ? (
            <Loader size="small" />
          ) : (
            <RiSendPlaneFill />
          )}
        </button>
      </form>
    </div>
  );
}

export default MessageInputBar;
