// Simple fonts configuration for Next.js compatibility
import { Inter, Poppins } from 'next/font/google';

// Initialize fonts at module scope
export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

// Simple page fonts configuration using CSS classes
export const pagefonts = {
  homepage: {
    primary: { className: 'font-inter font-bold' },
    secondary: { className: 'font-poppins font-medium' },
  },
  headers: {
    primary: { className: 'font-inter font-black' },
    secondary: { className: 'font-poppins font-bold' },
  },
  products: {
    primary: { className: 'font-inter font-semibold' },
    secondary: { className: 'font-poppins font-medium' },
  },
  collections: {
    primary: { className: 'font-inter font-bold' },
    secondary: { className: 'font-poppins font-semibold' },
  },
  brand: {
    primary: { className: 'font-inter font-bold' },
    secondary: { className: 'font-poppins font-medium' },
  },
  tech: {
    primary: { className: 'font-inter font-bold' },
    secondary: { className: 'font-poppins font-mono' },
  },
  content: {
    primary: { className: 'font-inter font-normal' },
    secondary: { className: 'font-poppins font-normal' },
  },
  special: {
    primary: { className: 'font-poppins font-bold' },
    secondary: { className: 'font-inter font-medium' },
  },
  commerce: {
    primary: { className: 'font-inter font-semibold' },
    secondary: { className: 'font-poppins font-medium' },
  },
};

// Font combinations for different moods/styles
export const fontCombinations = {
  modern: { primary: pagefonts.homepage.primary, secondary: pagefonts.homepage.secondary },
  elegant: { primary: pagefonts.brand.primary, secondary: pagefonts.brand.secondary },
  technical: { primary: pagefonts.tech.primary, secondary: pagefonts.tech.secondary },
  friendly: { primary: pagefonts.content.primary, secondary: pagefonts.content.secondary },
  bold: { primary: pagefonts.headers.primary, secondary: pagefonts.headers.secondary },
};

// Get all font variables for the HTML element
export const getAllFontVariables = () => {
  return `${inter.variable} ${poppins.variable}`;
};