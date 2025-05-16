'use client';

// import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import LocaleSwitcherSelect from './LocaleSwitcherSelect'

export default function LocaleSwitcher() {
  const locale = useLocale();

  return (
    <div className='flex items-center gap-2'>
      <LocaleSwitcherSelect defaultValue={locale} label='Tilni tanlang' />
    </div>
  );
}