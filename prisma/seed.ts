import { PrismaClient } from "@prisma/client";
import { seedRole } from "./seed_role";
import { seedPermission } from "./seed_permission";
import { seedRolePermission } from "./seed_rolePermission";
import { seedProduct } from "./seed_product";
import { seedOrder } from "./seed_order";

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
            email: "a@admin.com",
            password: "$2b$12$ihSmkgjDOe09o5d/ZrvOTOEGbL49NhogAqSdQfGtiUowaS87SCDNi",
            roleId: 1

        }
    })
    const user = await prisma.user.create({
        data: {
            firstName: "user",
            lastName: "user",
            email: "u@user.com",
            password: "$2b$12$R6nQD0samMfhdnZ1mCtZxOTZOGL/TeAOJvXgT7mgNvA3MgDaBahbi",
            roleId: 2

        }
    })
    const editor = await prisma.user.create({
        data: {
            firstName: "editor",
            lastName: "editor",
            email: "e@editor.com",
            password: "$2b$12$eBkSxTflQTulHlzDdYLzUeokNzG/12jr5AZEOf.igUBsga8zSNLXy",
            roleId: 3

        }
    })
    const viewer = await prisma.user.create({
        data: {
            firstName: "viewer",
            lastName: "viewer",
            email: "v@viewer.com",
            password: "$2b$12$yjCAVDunEV4SdYB4yzYThewJeL1k3S6QP3eio44XN.1AXvIAf7DJW",
            roleId: 4

        }
    })

    //products
    await seedProduct();
    //orders
    await seedOrder();

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