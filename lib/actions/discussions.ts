"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createDiscussion(projectSlug: string, title: string, content: string) {
  const supabase = await createClient();

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return { error: 'You must be logged in to post.' };
  }

  const { error } = await supabase
    .from('discussions')
    .insert({
      project_slug: projectSlug,
      title,
      content,
      user_id: session.user.id
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/project/${projectSlug}`);
  return { success: true };
}
