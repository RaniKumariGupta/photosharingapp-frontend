import { z } from 'zod';

export const postSchema = z.object({
  caption: z.string().nonempty({ message: 'Caption is required' }),
  image: z.instanceof(File).refine((file) => {
    const filetypes = /\.(jpeg|jpg|png)$/i;
    return filetypes.test(file.name);
  }, { message: 'Only images with .jpeg, .jpg, .png extensions are allowed' }),
});

export type PostData = z.infer<typeof postSchema>;
