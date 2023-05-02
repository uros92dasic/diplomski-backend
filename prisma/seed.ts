import { PrismaClient } from "@prisma/client";
import { seedRole } from "./seed_role";
import { seedPermission } from "./seed_permission";
import { seedRolePermission } from "./seed_rolePermission";

const prisma = new PrismaClient();

async function main() {
    //roles
    await seedRole();
    //permissions
    await seedPermission();
    //rolePermissions
    await seedRolePermission();

    //users
    const admin = await prisma.user.create({
        data: {
            firstName: "admin",
            lastName: "admin",
            email: "admin@admin.com",
            password: "$2b$12$ihSmkgjDOe09o5d/ZrvOTOEGbL49NhogAqSdQfGtiUowaS87SCDNi",
            roleId: 1

        }
    })
    const user = await prisma.user.create({
        data: {
            firstName: "user",
            lastName: "user",
            email: "user@user.com",
            password: "$2b$12$R6nQD0samMfhdnZ1mCtZxOTZOGL/TeAOJvXgT7mgNvA3MgDaBahbi",
            roleId: 2

        }
    })

    //products
    const product1 = await prisma.product.create({
        data: {
            title: "test1admin",
            description: "test1",
            image: "test1",
            price: 510,
            userId: 1
        }
    });
    const product2 = await prisma.product.create({
        data: {
            title: "test2admin",
            description: "test2",
            image: "test2",
            price: 520,
            userId: 1
        }
    });
    const product3 = await prisma.product.create({
        data: {
            title: "test3admin",
            description: "test3",
            image: "test3",
            price: 530,
            userId: 1
        }
    });
    const product4 = await prisma.product.create({
        data: {
            title: "test4admin",
            description: "test4",
            image: "test4",
            price: 540,
            userId: 1
        }
    });
    const product5 = await prisma.product.create({
        data: {
            title: "test5admin",
            description: "test5",
            image: "test5",
            price: 550,
            userId: 1
        }
    });
    const product6 = await prisma.product.create({
        data: {
            title: "test6user",
            description: "test6",
            image: "test6",
            price: 260,
            userId: 2
        }
    });
    const product7 = await prisma.product.create({
        data: {
            title: "test7user",
            description: "test7",
            image: "test7",
            price: 270,
            userId: 2
        }
    });
    const product8 = await prisma.product.create({
        data: {
            title: "test8user",
            description: "test8",
            image: "test8",
            price: 280,
            userId: 2
        }
    });
    const product9 = await prisma.product.create({
        data: {
            title: "test9user",
            description: "test9",
            image: "test9",
            price: 290,
            userId: 2
        }
    });
    const product10 = await prisma.product.create({
        data: {
            title: "test10user",
            description: "test10",
            image: "test10",
            price: 300,
            userId: 2
        }
    });
    const product11 = await prisma.product.create({
        data: {
            title: "test11user",
            description: "test11",
            image: "test11",
            price: 310,
            userId: 2
        }
    });
    const product12 = await prisma.product.create({
        data: {
            title: "test12user",
            description: "test12",
            image: "test12",
            price: 320,
            userId: 2
        }
    });
    const product13 = await prisma.product.create({
        data: {
            title: "test13user",
            description: "test13",
            image: "test13",
            price: 330,
            userId: 2
        }
    });
    const product14 = await prisma.product.create({
        data: {
            title: "test14user",
            description: "test14",
            image: "test14",
            price: 340,
            userId: 2
        }
    });
    const product15 = await prisma.product.create({
        data: {
            title: "test15user",
            description: "test15",
            image: "test15",
            price: 350,
            userId: 2
        }
    });
    const product16 = await prisma.product.create({
        data: {
            title: "test16user",
            description: "test16",
            image: "test16",
            price: 360,
            userId: 2
        }
    });
    const product17 = await prisma.product.create({
        data: {
            title: "test17user",
            description: "test17",
            image: "test17",
            price: 370,
            userId: 2
        }
    });
    const product18 = await prisma.product.create({
        data: {
            title: "test18user",
            description: "test18",
            image: "test18",
            price: 380,
            userId: 2
        }
    });
    const product19 = await prisma.product.create({
        data: {
            title: "test19user",
            description: "test19",
            image: "test19",
            price: 390,
            userId: 2
        }
    });
    const product20 = await prisma.product.create({
        data: {
            title: "test20user",
            description: "test20",
            image: "test20",
            price: 400,
            userId: 2
        }
    });
}

// execute the main function
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // close the Prisma Client at the end
        await prisma.$disconnect();
    });