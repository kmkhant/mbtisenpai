import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {

  // static for now
  const locale = 'en';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});