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
                            <>
                                <Button className=""> {cat} </Button>
                                <Separator orientation="vertical" />
                            </>
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
                            <Button className="w-[8vw]"> {cat} </Button>
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

// import * as React from "react"
// import Image from "next/image"

// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

// export interface Artwork {
//   artist: string
//   art: string
// }

// export const works: Artwork[] = [
//   {
//     artist: "Ornella Binni",
//     art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80",
//   },
//   {
//     artist: "Tom Byrom",
//     art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",
//   },
//   {
//     artist: "Vladimir Malyavko",
//     art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",
//   },
// ]

// export function ScrollAreaHorizontalDemo() {
//   return (
//     <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
//       <div className="flex w-max space-x-4 p-4">
//         {works.map((artwork) => (
//           <figure key={artwork.artist} className="shrink-0">
//             <div className="overflow-hidden rounded-md">
//               <Image
//                 src={artwork.art}
//                 alt={`Photo by ${artwork.artist}`}
//                 className="aspect-[3/4] h-fit w-fit object-cover"
//                 width={300}
//                 height={400}
//               />
//             </div>
//             <figcaption className="pt-2 text-xs text-muted-foreground">
//               Photo by{" "}
//               <span className="font-semibold text-foreground">
//                 {artwork.artist}
//               </span>
//             </figcaption>
//           </figure>
//         ))}
//       </div>
//       <ScrollBar orientation="horizontal" />
//     </ScrollArea>
//   )
// }
