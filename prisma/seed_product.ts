import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { parse } from 'papaparse';

const prisma = new PrismaClient();

export const seedProduct = async () => {
    const data = fs.readFileSync('./prisma/seed_csv_files/product.csv', 'utf8');
    const csvData = data.toString();
    const parsedCsvData = parse(csvData).data;

    if (parsedCsvData) {
        for (let index = 0; index < parsedCsvData.length; index++) {
            if (index === 0 || parsedCsvData[index] == '') continue;
            const product: any = parsedCsvData[index];
            const products = await prisma.product.create({
                data: {
                    title: product[0],
                    description: product[1],
                    image: product[2],
                    price: parseFloat(product[3]),
                    userId: parseInt(product[4]),
                },
            });
        }
    }
};
