// prisma/seed.ts
import { prisma } from '../src/lib/prisma'

async function main() {
    // 1️⃣ Upsert a company
    const company = await prisma.company.upsert({
        where: { slug: 'acme-corp' },
        update: {}, // do nothing if already exists
        create: {
            name: 'Acme Corp',
            slug: 'acme-corp',
            isActive: true,
        },
    });

    // 2️⃣ Upsert an admin user
    const user = await prisma.user.upsert({
        where: { email: 'admin@acme.com' },
        update: {}, // do nothing if already exists
        create: {
            email: 'admin@acme.com',
            password: 'password123', // ideally hashed in real project
            name: 'Admin User',
            role: 'AGENT',
            isActive: true,
            companyId: company.id,
        },
    });

    // 3️⃣ Upsert a sample customer
    const customer = await prisma.customer.upsert({
        where: { email: 'customer@example.com' },
        update: {},
        create: {
            name: 'John Doe',
            email: 'customer@example.com',
            phone: '1234567890',
            isActive: true,
            companyId: company.id,
        },
    });

    // 4️⃣ Upsert a channel
    const channel = await prisma.channel.upsert({
        where: { id: '00000000-0000-0000-0000-000000000002' }, // static UUID
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000002',
            name: 'WhatsApp Channel',
            type: 'WHATSAPP',
            isActive: true,
            companyId: company.id,
        },
    });


    // 5️⃣ Upsert a conversation
    const conversation = await prisma.conversation.upsert({
        where: { id: '00000000-0000-0000-0000-000000000001' }, // static UUID for example
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000001',
            topic: 'Welcome Chat',
            isActive: true,
            companyId: company.id,
            customerId: customer.id,
            channelId: channel.id,
        },
    });

    // 6️⃣ Upsert a message
    await prisma.message.upsert({
        where: { id: '00000000-0000-0000-0000-000000000010' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000010',
            conversationId: conversation.id,
            senderId: user.id,
            content: 'Hello! Welcome to our service.',
            direction: 'OUTGOING',
            status: 'SENT',
        },
    });

    console.log({ company, user, customer, channel, conversation });
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
