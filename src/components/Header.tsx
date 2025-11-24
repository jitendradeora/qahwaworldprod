import React from 'react';
import { HeaderMenuData } from "@/lib/actions/site/headerMenuAction";
import { HeaderInteractive } from "./header/HeaderInteractive";

interface HeaderProps {
  locale?: string;
  language?: string;
}

export const Header: React.FC<HeaderProps> = async ({ locale = 'en', language = 'en' }) => {
  // Fetch menu data for all languages on server side
  const [enMenuItems, arMenuItems, ruMenuItems] = await Promise.all([
    HeaderMenuData('en'),
    HeaderMenuData('ar'),
    HeaderMenuData('ru'),
  ]);

  const menuData = {
    en: enMenuItems,
    ar: arMenuItems,
    ru: ruMenuItems,
  };

  return <HeaderInteractive menuData={menuData} locale={locale} />;
};
