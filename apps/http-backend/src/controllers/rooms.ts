import z from 'zod';

export const roomSchema = z.object({
  name: z.string().min(4),
});

export const createRoom = (req, res) => {

}