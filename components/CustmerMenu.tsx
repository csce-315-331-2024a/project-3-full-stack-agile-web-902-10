import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"

const tags = Array.from({ length: 25 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
)
const temp_cat = ["Burgers", "Fries", "Drinks", "Desserts", "Cat cont", "Cat cont", "Cat cont", "Cat cont"];

export default function CustomerMenu() {
    return (
        <>
            {/* Mobile */}
            <div className="lg:hidden flex flex-col justify-center items-center">
                <ScrollArea className="h-auto w-[100vw] py-8 my-4 border rounded-lg whitespace-nowrap">
                    <div className="flex w-max space-x-4 px-6 justify-between">
                        {temp_cat.map((cat) => (
                            <div key={cat}>
                                <Button className=""> {cat} </Button>
                                <Separator orientation="vertical" />
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <ScrollArea className="h-[70vh] w-auto whitespace-nowrap">
                    <div className="grid grid-cols-2 gap-4">
                        {tags.map((tag) => (
                            <Card key={tag} className="w-[45vw] h-[30vh]">
                                <CardHeader>
                                    <CardTitle>{tag}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>
                                        Lorem ipsum dolor
                                    </CardDescription>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="default">Order</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>
            {/* Desktop */}
            <div className="hidden lg:flex flex-row">
                <ScrollArea className="h-[92vh] w-auto p-10  whitespace-nowrap">
                    <div className="flex flex-col w-[10vw] space-y-8 justify-center items-center">
                        <h1> Category </h1>
                        <Separator />
                        {temp_cat.map((cat) => (
                            <Button key={cat} className="w-[8vw]"> {cat} </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
                <ScrollArea className="h-[92vh] w-[90vw] p-8 whitespace-nowrap">
                    <div className="grid grid-cols-3 gap-4">
                        {tags.map((tag) => (
                            <Card key={tag} className="w-[25vw] h-[40vh]">
                                <CardHeader className="text-center">
                                    <CardTitle>{tag}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-center">
                                        Lorem ipsum dolor sit amet
                                    </CardDescription>
                                    <Image
                                        src="https://picsum.photos/200/200?random=25"
                                        width={200}
                                        height={200}
                                        alt="Photo by ..."
                                        className="aspect-[1/1] h-[200px] w-[200px] object-cover"
                                    />
                                </CardContent>
                                <CardFooter>
                                    <Button variant="default">Order</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </>
    );
}