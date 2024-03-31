import ManagerTrends from "@/components/ManagerTrends";
import { prisma } from "@/lib/db";
import { RestockReportData, columns } from "@/app/manager_trends/columns"

export const metadata = {
    title: "Trends",
};

export default async function ManagerTrendsPage() {
    const data = await prisma.$queryRawUnsafe<RestockReportData[]>(`SELECT * FROM "Ingredient" WHERE STOCK < 10000 ORDER BY STOCK;`);
    return (<ManagerTrends data ={data}/>);
}
