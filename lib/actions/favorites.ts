"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleFavorite(projectSlug: string) {
  const supabase = await createClient();

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return { error: 'You must be logged in to favorite a project.' };
  }

  // Check if it exists
  const { data } = await supabase
    .from('user_favorites')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('project_slug', projectSlug)
    .single();

  if (data) {
    // Delete it
    await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', session.user.id)
      .eq('project_slug', projectSlug);
  } else {
    // Insert it
    await supabase
      .from('user_favorites')
      .insert({
        user_id: session.user.id,
        project_slug: projectSlug
      });
  }

  revalidatePath(`/project/${projectSlug}`);
  return { success: true, isFavorited: !data };
}

export async function checkIsFavorited(projectSlug: string) {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return false;
  }

  const { data } = await supabase
    .from('user_favorites')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('project_slug', projectSlug)
    .single();

  return !!data;
}
