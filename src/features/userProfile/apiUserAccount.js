import { MAXIMUM_AVATAR_FILE_SIZE } from "../../config";
import supabase, { supabaseUrl } from "../../services/supabase";

export async function updateCurrentUser({
  password,
  fullname,
  username,
  bio,
  avatar,
  previousAvatar,
}) {
  // 1. Update password OR fullname
  let updateData;

  if (password) updateData = { password };
  if (fullname) updateData = { data: { fullname } };
  if (username) updateData = { data: { username } };
  if (bio) updateData = { data: { bio } };

  if (updateData) {
    const { error } = await supabase.auth.updateUser(updateData);
    if (error) throw new Error(error.message);
  }

  if (!avatar) return;

  // 2. Get the current authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  if (!user) throw new Error("You must be logged in to upload an avatar.");

  // 3. Upload the avatar into the user's own folder
  const fileName = `${user.id}/avatar-${Math.random()}`;

  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);

  if (storageError) {
    if (storageError.statusCode === "413" || storageError.statusCode === 413) {
      throw new Error(
        `The file is too large. It should be less than ${MAXIMUM_AVATAR_FILE_SIZE}MB.`,
      );
    }

    throw new Error(storageError.message);
  }

  // 4. Update the user's avatar URL
  const avatarUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;

  const { data: updatedUser, error: updateError } =
    await supabase.auth.updateUser({
      data: { avatar_url: avatarUrl },
    });

  if (updateError) throw new Error(updateError.message);

  // 5. Delete the previous avatar, if one exists
  if (previousAvatar) {
    const marker = "/storage/v1/object/public/avatars/";
    const markerIndex = previousAvatar.indexOf(marker);

    if (markerIndex !== -1) {
      const oldFileName = decodeURIComponent(
        previousAvatar.slice(markerIndex + marker.length),
      );

      const { error: deleteError } = await supabase.storage
        .from("avatars")
        .remove([oldFileName]);

      if (deleteError) {
        throw new Error(
          `Avatar uploaded, but the previous avatar could not be deleted: ${deleteError.message}`,
        );
      }
    }
  }

  return updatedUser;
}

///////////////////////

export async function sendPasswordResetEmail({ email, redirectTo }) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) throw new Error(error.message);

  return null;
}
