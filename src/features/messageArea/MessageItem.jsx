
import { useUser } from "../authentication/useUser";
import { formatTime } from "../../utils/common";

const CHAT_IMAGE_PREFIX = "__ALFATHCHAT_IMAGE__:";

function MessageItem({ message }) {
  const { user } = useUser();

  const content = message?.content ?? "";
  const isImage = content.startsWith(CHAT_IMAGE_PREFIX);
  const imageUrl = isImage
    ? content.slice(CHAT_IMAGE_PREFIX.length)
    : "";

  return (
    <div
      className={`relative ${
        message?.sender_id === user?.id
          ? "self-end rounded-br-none bg-gradient-to-br from-bgAccent to-bgAccentDim text-textPrimary-dark before:absolute before:bottom-0 before:right-0 before:h-0 before:w-0 before:translate-x-full before:border-l-8 before:border-t-8 before:border-l-bgAccentDim before:border-t-transparent before:content-[''] dark:from-bgAccent-dark dark:to-bgAccentDim-dark before:dark:border-l-bgAccentDim-dark"
          : "rounded-bl-none bg-bgPrimary before:absolute before:bottom-0 before:left-0 before:h-0 before:w-0 before:-translate-x-full before:border-r-8 before:border-t-8 before:border-r-bgPrimary before:border-t-transparent before:content-[''] dark:bg-LightShade/20 before:dark:border-r-LightShade/20"
      } my-1 w-fit max-w-[80%] rounded-2xl px-4 py-2 shadow-md before:shadow-md`}
    >
      {isImage ? (
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src={imageUrl}
            alt="Foto dalam pesan"
            loading="lazy"
            className="max-h-80 max-w-full rounded-lg object-contain"
          />
        </a>
      ) : (
        <p className="whitespace-pre-wrap break-words">
          {content}
        </p>
      )}

      <div
        className={`select-none text-xs opacity-70 ${
          isImage ? "mt-2 text-right" : "mt-2 text-right"
        }`}
      >
        {formatTime(message?.created_at)}
      </div>
    </div>
  );
}

export default MessageItem;
