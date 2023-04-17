import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    //roles
    const roleAdmin = await prisma.role.create({
        data: {
            name: "Admin"
        }
    })
    const roleEditor = await prisma.role.create({
        data: {
            name: "Editor"
        }
    })
    const roleViewer = await prisma.role.create({
        data: {
            name: "Viewer"
        }
    })
    const roleGuest = await prisma.role.create({
        data: {
            name: "Guest"
        }
    })

    //permissions
    const permissionViewUsers = await prisma.permission.create({
        data: {
            name: "viewUsers"
        }
    })
    const permissionEditUsers = await prisma.permission.create({
        data: {
            name: "editUsers"
        }
    })
    const permissionViewRoles = await prisma.permission.create({
        data: {
            name: "viewRoles"
        }
    })
    const permissionEditRoles = await prisma.permission.create({
        data: {
            name: "editRoles"
        }
    })
    const permissionviewProducts = await prisma.permission.create({
        data: {
            name: "viewProducts"
        }
    })
    const permissionEditProducts = await prisma.permission.create({
        data: {
            name: "editProducts"
        }
    })
    const permissionViewOrders = await prisma.permission.create({
        data: {
            name: "viewOrders"
        }
    })
    const permissionEditOrders = await prisma.permission.create({
        data: {
            name: "editOrders"
        }
    })

    //users
    const admin = await prisma.user.create({
        data: {
            firstName: "admin",
            lastName: "admin",
            email: "admin@admin.com",
            password: "admin",
            roleId: 1

        }
    })
    const editor = await prisma.user.create({
        data: {
            firstName: "editor",
            lastName: "editor",
            email: "editor@editor.com",
            password: "editor",
            roleId: 2

        }
    })
    const viewer = await prisma.user.create({
        data: {
            firstName: "viewer",
            lastName: "viewer",
            email: "viewer@viewer.com",
            password: "viewer",
            roleId: 3

        }
    })
    const guest = await prisma.user.create({
        data: {
            firstName: "guest",
            lastName: "guest",
            email: "guest@guest.com",
            password: "guest",
            roleId: 4

        }
    })

    //admin role permissions
    const adminRolePermission1 = await prisma.rolePermission.create({
        data: {
            roleId: 1,
            permissionId: 1
        }
    });
    const adminRolePermission2 = await prisma.rolePermission.create({
        data: {
            roleId: 1,
            permissionId: 2
        }
    });
    const adminRolePermission3 = await prisma.rolePermission.create({
        data: {
            roleId: 1,
            permissionId: 3
        }
    });
    const adminRolePermission4 = await prisma.rolePermission.create({
        data: {
            roleId: 1,
            permissionId: 4
        }
    });
    const adminRolePermission5 = await prisma.rolePermission.create({
        data: {
            roleId: 1,
            permissionId: 5
        }
    });
    const adminRolePermission6 = await prisma.rolePermission.create({
        data: {
            roleId: 1,
            permissionId: 6
        }
    });
    const adminRolePermission7 = await prisma.rolePermission.create({
        data: {
            roleId: 1,
            permissionId: 7
        }
    });
    const adminRolePermission8 = await prisma.rolePermission.create({
        data: {
            roleId: 1,
            permissionId: 8
        }
    });
    //viewer role permissions
    const viewerRolePermission1 = await prisma.rolePermission.create({
        data: {
            roleId: 3,
            permissionId: 1
        }
    });
    const viewerRolePermission3 = await prisma.rolePermission.create({
        data: {
            roleId: 3,
            permissionId: 3
        }
    });
    const viewerRolePermission5 = await prisma.rolePermission.create({
        data: {
            roleId: 3,
            permissionId: 5
        }
    });
    const viewerRolePermission7 = await prisma.rolePermission.create({
        data: {
            roleId: 3,
            permissionId: 7
        }
    });
    //editor role permissions
    const editorRolePermission2 = await prisma.rolePermission.create({
        data: {
            roleId: 2,
            permissionId: 2
        }
    });
    const editorRolePermission4 = await prisma.rolePermission.create({
        data: {
            roleId: 2,
            permissionId: 4
        }
    });
    const editorRolePermission6 = await prisma.rolePermission.create({
        data: {
            roleId: 2,
            permissionId: 6
        }
    });
    const editorRolePermission8 = await prisma.rolePermission.create({
        data: {
            roleId: 2,
            permissionId: 8
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