import ManagerTrends from "@/components/ManagerTrends";
import { prisma } from "@/lib/db";

export const metadata = {
    title: "Trends",
};

export default async function ManagerTrendsPage() {
    const data = await prisma.menu_Item.findMany();
    return (<ManagerTrends data ={data}/>);
}
