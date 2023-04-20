import { PrismaClient } from '@prisma/client';
import * as fs from 'fs'
import { parse } from 'papaparse';

const prisma = new PrismaClient();

export const seedRolePermission = async () => {
    const data = fs.readFileSync('./prisma/seed_csv_files/rolePermission.csv', 'utf8');
    const csvData = data.toString();
    const parsedCsvData = parse(csvData).data;
    if (parsedCsvData) {
        for (let index = 0; index < parsedCsvData.length; index++) {
            if (index === 0 || parsedCsvData[index] == '')
                continue;
            const rolePermission: any = parsedCsvData[index];
            const rolePermissions = await prisma.rolePermission.create({
                data: {
                    roleId: parseInt(rolePermission[0]),
                    permissionId: parseInt(rolePermission[1])
                },
            });
        }
    }
}
