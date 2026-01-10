import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = 'Senha123!';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({
    where: { email: 'teste@example.com' },
  });

  if (existingUser) {
    await prisma.usersPassword.deleteMany({
      where: { id: existingUser.id },
    });
    await prisma.user.delete({
      where: { id: existingUser.id },
    });
    console.info('Existing user deleted');
  }

  const user = await prisma.user.create({
    data: {
      name: 'Usuário Teste',
      email: 'teste@example.com',
      address: 'Rua Exemplo, 123',
      bankingDetails: {
        create: {
          agency: '0001',
          accountNumber: '12345-6',
        },
      },
    },
  });

  await prisma.usersPassword.create({
    data: {
      id: user.id,
      hash: hashedPassword,
    },
  });

  console.info('User created successfully:', {
    id: user.id,
    email: user.email,
    password: password, // Only for seed purposes
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
