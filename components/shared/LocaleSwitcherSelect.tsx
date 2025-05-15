'use client';


import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/[locale]/dashboard/_components/ui/select'
import { Locale, routing, usePathname, useRouter } from '../../app/i18n/routing'; // useRouter bu yerdan import qilinadi

type Props = {
  defaultValue: string;
  label: string;
};
import { useLocale } from '@/hooks/useLocale'; // Qo‘shildi
import { useSession, useStore } from '@/hooks/useSession'
export default function LocaleSwitcherSelect({ defaultValue, label }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const setLocale = useLocale((state) => state.setLocale); // Qo‘shildi

  
  
  function onSelectChange(nextLocale: string) {
    const localeMap: Record<string, string> = {
      uz: 'uz-UZ',
      ru: 'ru-RU',
      en: 'en-US',
    };
    setLocale(localeMap[nextLocale] || 'uz-UZ');
  
    router.replace({ pathname }, { locale: nextLocale as Locale });
  
    // API ni qayta chaqirish
    const token = useSession.getState().session?.token;
    if (token) {
      useStore.getState().fetchData(token);
    }
  }
  

  return (
    <Select defaultValue={defaultValue} onValueChange={onSelectChange}>
      <SelectTrigger
        className='w-[70px] h-8 border-none bg-transparent focus:ring-0 focus:ring-offset-0'
        aria-label={label}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {locale.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
