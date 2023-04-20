import { PrismaClient } from '@prisma/client';
import * as fs from 'fs'
import { parse } from 'papaparse';

const prisma = new PrismaClient();

export const seedRole = async () => {
    const data = fs.readFileSync('./prisma/seed_csv_files/role.csv', 'utf8');
    const csvData = data.toString();
    const parsedCsvData = parse(csvData).data;
    if (parsedCsvData) {
        for (let index = 0; index < parsedCsvData.length; index++) {
            if (index === 0 || parsedCsvData[index] == '')
                continue;
            const role: any = parsedCsvData[index];
            const roles = await prisma.role.create({
                data: {
                    id: parseInt(role[0]),
                    name: role[1]
                },
            });
        }
    }
}
