import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { parse } from 'papaparse';

const prisma = new PrismaClient();

export const seedOrder = async () => {
    const data = fs.readFileSync('./prisma/seed_csv_files/order.csv', 'utf8');
    const csvData = data.toString();
    const parsedCsvData = parse(csvData).data;

    if (parsedCsvData) {
        for (let index = 0; index < parsedCsvData.length; index++) {
            if (index === 0 || parsedCsvData[index] == '') continue;
            const order: any = parsedCsvData[index];
            const orders = await prisma.order.create({
                data: {
                    createdAt: order[0],
                    userId: parseInt(order[1]),
                    total: parseFloat(order[2]),
                    orderItems: {
                        create: [
                            {
                                productId: parseInt(order[3]),
                                quantity: parseInt(order[4]),
                            },
                        ],
                    },
                },
            });
        }
    }
};
