import { z } from 'zod';

const validateFileType = (file: File) => {
  const filetypes = /jpeg|jpg|png|gif/;
  return filetypes.test(file.type);
};

const validateFileSize = (file: File) => {
  const maxSize = 5000000; 
  return file.size <= maxSize;
};

const photoSchema = z.object({
  caption: z.string().nonempty({ message: 'Caption is required' }),
  image: z
    .any()
    .refine(
      (files) => files.length > 0,
      { message: 'Image is required' }
    )
    .refine(
      (files) => files.length === 0 || validateFileType(files[0]),
      { message: 'Invalid file type. Only jpeg, jpg, png, and gif are allowed.' }
    )
    .refine(
      (files) => files.length === 0 || validateFileSize(files[0]),
      { message: 'File size should be less than or equal to 5MB.' }
    )
    .optional(),
});

export type PhotoFormValues = z.infer<typeof photoSchema>;
export { photoSchema };
