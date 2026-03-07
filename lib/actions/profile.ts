"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return { error: 'You must be logged in to update your profile.' };
  }

  const username = formData.get("username") as string;
  const fullName = formData.get("fullName") as string;
  const avatarFile = formData.get("avatar") as File | null;

  let avatarUrl = formData.get("currentAvatarUrl") as string;

  // Handle Image Upload if a new file is provided
  if (avatarFile && avatarFile.size > 0) {
    // Basic validation
    if (!avatarFile.type.startsWith("image/")) {
      return { error: "Please upload a valid image file." };
    }
    if (avatarFile.size > 5 * 1024 * 1024) { // 5MB limit
      return { error: "Image size must be less than 5MB." };
    }

    const fileExt = avatarFile.name.split('.').pop();
    const filePath = `${session.user.id}-${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('wiki_images')
      .upload(filePath, avatarFile, { upsert: true });

    if (uploadError) {
      return { error: `Failed to upload image: ${uploadError.message}` };
    }

    // Get the public URL for the newly uploaded avatar
    const { data: { publicUrl } } = supabase.storage
      .from('wiki_images')
      .getPublicUrl(filePath);

    avatarUrl = publicUrl;
  }

  // 1. Update the public.profiles table (for database joins like Wiki Posts)
  const { error: dbError } = await supabase
    .from('profiles')
    .update({
      username: username,
      full_name: fullName,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', session.user.id);

  if (dbError) {
    return { error: `Database error: ${dbError.message}` };
  }

  // 2. Update the Auth MetaData (so session.user.user_metadata has the correct data for the Navbar instantly)
  const { error: authError } = await supabase.auth.updateUser({
    data: {
      preferred_username: username,
      full_name: fullName,
      avatar_url: avatarUrl
    }
  });

  if (authError) {
    return { error: `Auth sync error: ${authError.message}` };
  }

  revalidatePath('/', 'layout'); // Force entire app to refresh the nav auth state

  return { success: true, avatarUrl };
}
