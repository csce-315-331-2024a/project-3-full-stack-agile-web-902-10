"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel
} from "@/components/ui/select"

import { useLanguageStore } from "@/lib/provider/language-store-provider";
import { language_name_code, getKeyByValue } from "@/lib/utils";

export default function LanguageSelector({ translated, id }: { translated: any, id : string} ) {
    const language = useLanguageStore((state) => state.language);
    const setLanguage = useLanguageStore((state) => state.setLanguage);

    return (
        <Select onValueChange={setLanguage} defaultValue={language}>
            <SelectTrigger className="text-lg p-4 border-4">
                <SelectValue>{language}</SelectValue>
            </SelectTrigger>
            <SelectContent className="w-[16vw]" id={id}>
                <SelectGroup>
                    {Object.keys(language_name_code).map((lang) => (
                        <SelectItem value={lang} key={lang} className="text-lg">
                            {lang}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}