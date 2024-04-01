import ManagerTrends from "@/components/ManagerTrends";
import { prisma } from "@/lib/db";
import { RestockReportData, RestockReportColumns } from "@/app/manager_trends/columns"

export const metadata = {
    title: "Trends",
};

export default async function ManagerTrendsPage() {
    const restockReportData = await prisma.$queryRawUnsafe<RestockReportData[]>(`SELECT * FROM "Ingredient" WHERE STOCK < 10000 ORDER BY STOCK;`);
    const whatSellsTogtherData = await prisma.$queryRawUnsafe<RestockReportData[]>(`SELECT * FROM "Ingredient" WHERE STOCK > 5000;`);
    return (<ManagerTrends restockReportData ={restockReportData} whatSellsTogtherData = {whatSellsTogtherData}/>);
}
