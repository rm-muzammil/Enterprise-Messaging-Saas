import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
    // 1. Create Company
    const company = await prisma.company.create({
        data: { name: "Acme Corp", slug: "acme-corp" },
    });

    // 2. Create Users
    const admin = await prisma.user.create({
        data: {
            email: "admin@acme.com",
            password: "admin123",
            name: "Alice Admin",
            role: "ADMIN",
            company: { connect: { id: company.id } },
        },
    });

    const agent = await prisma.user.create({
        data: {
            email: "agent@acme.com",
            password: "agent123",
            name: "Bob Agent",
            role: "AGENT",
            company: { connect: { id: company.id } },
        },
    });

    // 3. Create Channel
    const whatsappChannel = await prisma.channel.create({
        data: {
            name: "Acme WhatsApp",
            type: "WHATSAPP",
            company: { connect: { id: company.id } },
        },
    });

    // 4. Create Customer
    const customer = await prisma.customer.create({
        data: {
            name: "John Doe",
            phone: "+1234567890",
            email: "john@example.com",
            company: { connect: { id: company.id } },
        },
    });

    // 5. Create Conversation
    const conversation = await prisma.conversation.create({
        data: {
            topic: "Support Chat",
            company: { connect: { id: company.id } },
            customer: { connect: { id: customer.id } },
            channel: { connect: { id: whatsappChannel.id } },
        },
    });

    // 6. Create Message
    await prisma.message.create({
        data: {
            content: "Hello! How can I help you?",
            conversation: { connect: { id: conversation.id } },
            sender: { connect: { id: admin.id } },
            direction: "OUTGOING",
            status: "SENT",
        },
    });

    console.log("Seeding finished ✅");
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
