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
            password: "1234",
            roleId: 1

        }
    })
    const editor = await prisma.user.create({
        data: {
            firstName: "editor",
            lastName: "editor",
            email: "editor@editor.com",
            password: "1234",
            roleId: 2

        }
    })
    const viewer = await prisma.user.create({
        data: {
            firstName: "viewer",
            lastName: "viewer",
            email: "viewer@viewer.com",
            password: "1234",
            roleId: 3

        }
    })
    const guest = await prisma.user.create({
        data: {
            firstName: "guest",
            lastName: "guest",
            email: "guest@guest.com",
            password: "1234",
            roleId: 4

        }
    })

    //products
    const product1 = await prisma.product.create({
        data: {
            title: "test1",
            description: "test1",
            image: "test1",
            price: 110,
            userId: 1
        }
    });
    const product2 = await prisma.product.create({
        data: {
            title: "test2",
            description: "test2",
            image: "test2",
            price: 120,
            userId: 1
        }
    });
    const product3 = await prisma.product.create({
        data: {
            title: "test3",
            description: "test3",
            image: "test3",
            price: 130,
            userId: 1
        }
    });
    const product4 = await prisma.product.create({
        data: {
            title: "test4",
            description: "test4",
            image: "test4",
            price: 140,
            userId: 1
        }
    });
    const product5 = await prisma.product.create({
        data: {
            title: "test5",
            description: "test5",
            image: "test5",
            price: 150,
            userId: 1
        }
    });
    const product6 = await prisma.product.create({
        data: {
            title: "test6",
            description: "test6",
            image: "test6",
            price: 160,
            userId: 1
        }
    });
    const product7 = await prisma.product.create({
        data: {
            title: "test7",
            description: "test7",
            image: "test7",
            price: 170,
            userId: 2
        }
    });
    const product8 = await prisma.product.create({
        data: {
            title: "test8",
            description: "test8",
            image: "test8",
            price: 180,
            userId: 2
        }
    });
    const product9 = await prisma.product.create({
        data: {
            title: "test9",
            description: "test9",
            image: "test9",
            price: 190,
            userId: 2
        }
    });
    const product10 = await prisma.product.create({
        data: {
            title: "test10",
            description: "test10",
            image: "test10",
            price: 200,
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