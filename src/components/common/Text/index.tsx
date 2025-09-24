"use client";

import { useTheme } from "../../../contexts/ThemeContext";

interface propsText {
    text: string
    noBlack?: boolean
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl'
    weight?: 'light' | 'normal' | 'semibold' | 'bold' | 'extrabold' | 'black'
    color?: 'text-slate-900' | 'text-slate-50' 
    align?: 'left' | 'center' | 'right'
    lineHeight?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose'
}

export default function Text(props: propsText) {
    const { theme } = useTheme();

    return (
        <p className={`
            ${props.size === 'sm' ? 'text-sm' : ''} 
            ${props.size === 'md' ? 'text-md' : ''}
            ${props.size === 'lg' ? 'text-lg' : ''}
            ${props.size === 'xl' ? 'text-xl' : ''}
            ${props.size === '2xl' ? 'text-2xl' : ''}
            ${props.size === '3xl' ? 'text-3xl' : ''}
            ${props.size === '4xl' ? 'text-4xl' : ''}
            ${props.size === '5xl' ? 'text-5xl' : ''}
            ${props.size === '6xl' ? 'text-6xl' : ''}
            ${props.size === '7xl' ? 'text-7xl' : ''}
            ${props.size === '8xl' ? 'text-8xl' : ''}
            ${props.size === '9xl' ? 'text-9xl' : ''}
            ${props.weight === 'light' ? 'font-light' : ''}
            ${props.weight === 'normal' ? 'font-normal' : ''}
            ${props.weight === 'semibold' ? 'font-semibold' : ''}
            ${props.weight === 'bold' ? 'font-bold' : ''}
            ${props.weight === 'extrabold' ? 'font-extrabold' : ''}
            ${props.weight === 'black' ? 'font-black' : ''}
            ${props.color === 'text-slate-900' ? 'text-slate-900' : ''}
            ${props.color === 'text-slate-50' ? 'text-slate-50' : ''}
            ${props.noBlack ? 'text-white' : (theme === 'dark' ? 'text-white' : 'text-slate-900')}
            ${props.align === 'left' ? 'text-left' : ''}
            ${props.align === 'center' ? 'text-center' : ''}
            ${props.align === 'right' ? 'text-right' : ''}
            ${props.lineHeight === 'none' ? 'leading-none' : ''}
            ${props.lineHeight === 'tight' ? 'leading-tight' : ''}
            ${props.lineHeight === 'snug' ? 'leading-snug' : ''}
            ${props.lineHeight === 'normal' ? 'leading-normal' : ''}
            ${props.lineHeight === 'relaxed' ? 'leading-relaxed' : ''}
            ${props.lineHeight === 'loose' ? 'leading-loose' : ''}
        `}>{props.text}</p>
    )
}