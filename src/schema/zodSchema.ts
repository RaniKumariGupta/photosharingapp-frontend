import { z } from 'zod';

export const postSchema = z.object({
  caption: z.string().nonempty({ message: 'Caption is required' }),
  image: z.instanceof(File).refine((file) => {
    const filetypes = /\.(jpeg|jpg|png)$/i;
    return filetypes.test(file.name);
  }, { message: 'Only images with .jpeg, .jpg, .png extensions are allowed' }),
});

export type PostData = z.infer<typeof postSchema>;


export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  // profileImage: z.instanceof(FileList).optional(),
  profileImage: z.instanceof(FileList).optional(),
});


export type ProfileFormValues = z.infer<typeof profileSchema>;