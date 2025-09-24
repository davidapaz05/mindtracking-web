import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface CardProps {
    title: string,
    parag: string
}

export default function Card(props : CardProps) {
    const { darkMode } = useTheme();

    return (
        <div className={`flex flex-col gap-6 px-6 py-9 md:w-96 md:h-60 md:px-8 md:py-12 
            rounded-[10px] border-[2.5px] border-blue-600 
            ${ darkMode ? "bg-[#FFFFFF1A]" : "bg-[#0F172A1A]" }
            text-center`}>
            <h1 className={`text-lg md:text-2xl font-[700] ${darkMode ? 'text-slate-50' : 'text-slate-900'}`}>
                {props.title}
            </h1>

            <p className={`text-sm md:text-base font-semibold ${darkMode ? 'text-slate-50' : 'text-slate-900'}`}>
                {props.parag}
            </p>
        </div>
    )
}