import { randEmail, randFirstName, randProgrammingLanguage, randText } from '@ngneat/falso';
import { Message, PrismaClient, Room, User } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
async function main() {
  await prisma.user.deleteMany();
  await prisma.room.deleteMany();
  await prisma.message.deleteMany();

  const users: User[] = [];
  const messages: Message[] = [];
  const rooms: Room[] = [];

  const USER_COUNT = 10;
  const ROOMS_COUNT = 3;
  const MESSAGES_PER_USER = 15;
  const getRandomId = (MAX_ID: number) => Math.floor(Math.random() * MAX_ID);

  for (let i = 0; i < USER_COUNT; i++) {
    const name = randFirstName();
    const email = randEmail({ firstName: name, suffix: 'com', provider: 'gmail', nameSeparator: '.' });
    const password = await bcrypt.hash('123456789', 10);
    const user = await prisma.user.create({ data: { name, email, password }, include: { rooms: true } });
    users.push(user);
    console.log(`Created (User) - name: ${name} - email: ${email} - password: ${password}`);
  }

  for (let i = 0; i < ROOMS_COUNT; i++) {
    const name = randProgrammingLanguage();
    const room = await prisma.room.create({
      data: {
        name,
        adminId: users[users.length - 1 - i]?.id!,
        users: {
          connect: [
            { id: users[users.length - 1 - i]?.id },
            { id: users[getRandomId(7)]?.id },
            { id: users[getRandomId(7)]?.id },
            { id: users[getRandomId(7)]?.id },
            { id: users[getRandomId(7)]?.id },
            { id: users[getRandomId(7)]?.id },
          ],
        },
      },
      include: { users: true },
    });
    console.log(`Created (Room) - name: ${name} - admin: ${room.adminId}`);
    rooms.push(room);
  }

  for (let i = 0; i < USER_COUNT * MESSAGES_PER_USER; i++) {
    const userId = users[getRandomId(users.length)]?.id!;
    const user = await prisma.user.findFirst({ where: { id: userId }, select: { rooms: true } });
    const roomId = user?.rooms[getRandomId(user?.rooms.length)]?.id;
    if (roomId) {
      const content = randText();
      const message = await prisma.message.create({
        data: {
          content,
          authorId: userId,
          roomId,
        },
      });
      console.log(
        `Created (Message) - content: ${message.content} - author: ${message.authorId} - room: ${message.roomId}`
      );
      messages.push(message);
    }
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
