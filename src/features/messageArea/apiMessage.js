
import { MAX_MESSAGES_PER_PAGE } from "../../config";
import supabase from "../../services/supabase";

const CHAT_IMAGE_BUCKET = "chat-images";
const MAX_CHAT_IMAGE_SIZE = 5 * 1024 * 1024;

////////////////
// GET MESSAGES
////////////////

export async function getMessages({
  conversation_id,
  pageParam = 0,
}) {
  const limit = MAX_MESSAGES_PER_PAGE;
  const from = pageParam * limit;
  const to = from + limit - 1;

  if (!conversation_id) return;

  const query = supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversation_id)
    .order("created_at", { ascending: false })
    .range(from, to);

  const { data: messages, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return messages.reverse();
}

////////////////
// GET MESSAGE BY ID
////////////////

export async function getMessageById(messageId) {
  if (!messageId) return null;

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("id", messageId);

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

////////////////
// OPEN CONVERSATION
////////////////

export async function openConversation(friendUserId) {
  const { data, error } = await supabase
    .from("conversations")
    .insert([{ user2_id: friendUserId }])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  const conversationId = data[0].id;

  return conversationId;
}

////////////////
// SEND TEXT MESSAGE
////////////////

export async function sendMessage({
  id,
  conversation_id,
  content,
  friendUserId,
}) {
  let convId = conversation_id;

  if (!convId) {
    const newConvId = await openConversation(friendUserId);
    convId = newConvId;
  }

  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        id,
        conversation_id: convId,
        content,
      },
    ])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  const { error: conversationError } = await supabase
    .from("conversations")
    .update({ last_message: data[0] })
    .eq("id", convId);

  if (conversationError) {
    throw new Error(conversationError.message);
  }

  return data[0];
}

////////////////
// UPLOAD CHAT IMAGE
////////////////

export async function uploadChatImage({
  file,
  userId,
  conversationId,
}) {
  if (!file || !userId) {
    throw new Error("File foto atau akun pengguna tidak ditemukan.");
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Format foto harus JPG, PNG, WEBP, atau GIF."
    );
  }

  if (file.size > MAX_CHAT_IMAGE_SIZE) {
    throw new Error("Ukuran foto maksimal 5 MB.");
  }

  if (!globalThis.crypto?.randomUUID) {
    throw new Error(
      "Browser tidak mendukung pembuatan ID file yang diperlukan."
    );
  }

  const extensions = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };

  const extension = extensions[file.type];
  const folder = conversationId || "new-chat";

  const filePath =
    `${userId}/${folder}/${crypto.randomUUID()}.${extension}`;

  const { data, error } = await supabase.storage
    .from(CHAT_IMAGE_BUCKET)
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload foto gagal: ${error.message}`);
  }

  const { data: publicData } = supabase.storage
    .from(CHAT_IMAGE_BUCKET)
    .getPublicUrl(data.path);

  if (!publicData?.publicUrl) {
    throw new Error("URL foto gagal dibuat.");
  }

  return publicData.publicUrl;
}
