import { createClient } from '@supabase/supabase-js';

import { getActiveWallet } from './wallet';

const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';

const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);

const STATUS_BUCKET = 'status-media';

export type RemoteStatus = {
  id: string;
  wallet_address: string;
  media_path: string;
  media_type: 'image' | 'video';
  caption: string | null;
  created_at: string;
  expires_at: string;
};

type CreateRemoteStatusParams = {
  mediaUri: string;
  mediaType: 'image' | 'video';
  caption?: string;
};

async function uriToBlob(
  uri: string,
): Promise<Blob> {
  const response = await fetch(uri);

  if (!response.ok) {
    throw new Error(
      'Failed to read status media',
    );
  }

  return response.blob();
}

export async function uploadStatusMedia(
  mediaUri: string,
  mediaType: 'image' | 'video',
): Promise<string> {
  const wallet = await getActiveWallet();

  if (!wallet) {
    throw new Error('No active wallet found');
  }

  const blob = await uriToBlob(mediaUri);

  const extension =
    mediaType === 'video'
      ? 'mp4'
      : 'jpg';

  const path =
    `${wallet.address}/${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from(STATUS_BUCKET)
    .upload(path, blob, {
      contentType:
        mediaType === 'video'
          ? 'video/mp4'
          : 'image/jpeg',
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return path;
}

export async function createRemoteStatus({
  mediaUri,
  mediaType,
  caption,
}: CreateRemoteStatusParams): Promise<RemoteStatus> {
  const wallet = await getActiveWallet();

  if (!wallet) {
    throw new Error('No active wallet found');
  }

  const mediaPath = await uploadStatusMedia(
    mediaUri,
    mediaType,
  );

  const expiresAt = new Date(
    Date.now() + 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data, error } = await supabase
    .from('statuses')
    .insert({
      wallet_address: wallet.address.toLowerCase(),
      media_path: mediaPath,
      media_type: mediaType,
      caption: caption?.trim() || null,
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (error) {
    await supabase.storage
      .from(STATUS_BUCKET)
      .remove([mediaPath]);

    throw error;
  }

  return data as RemoteStatus;
}

export async function getRemoteStatuses(): Promise<
  RemoteStatus[]
> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('statuses')
    .select('*')
    .gt('expires_at', now)
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (data ?? []) as RemoteStatus[];
}

export function getStatusMediaUrl(
  mediaPath: string,
): string {
  const { data } = supabase.storage
    .from(STATUS_BUCKET)
    .getPublicUrl(mediaPath);

  return data.publicUrl;
}