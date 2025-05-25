
import { supabase } from '@/integrations/supabase/client';

export const uploadFile = async (file: File, userId: string): Promise<{ url?: string; error?: string }> => {
  try {
    console.log('Starting file upload:', file.name, file.size, file.type);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    console.log('Uploading to path:', fileName);
    
    const { data, error } = await supabase.storage
      .from('media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      return { error: `Erro ao fazer upload: ${error.message}` };
    }

    console.log('Upload successful, getting public URL for:', data.path);

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(data.path);

    console.log('Public URL generated:', publicUrl);
    return { url: publicUrl };
  } catch (error) {
    console.error('Error in uploadFile:', error);
    return { error: 'Erro interno ao fazer upload' };
  }
};

export const convertFileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
