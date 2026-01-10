import { z } from 'zod';

export const updateProfilePictureSchema = z.object({
  profilePicture: z.url('Invalid URL format'),
});
