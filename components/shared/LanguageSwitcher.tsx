'use client';

import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import LocaleSwitcherSelect from './LocaleSwitcherSelect'

export default function LocaleSwitcher() {
  const locale = useLocale();

  return (
    <div className='flex items-center gap-2'>
      <Globe className='h-4 w-4 text-muted-foreground' />
      <LocaleSwitcherSelect defaultValue={locale} label='Tilni tanlang' />
    </div>
  );
}