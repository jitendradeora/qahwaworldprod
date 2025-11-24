import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

interface PrivacyPageProps {
  locale: string;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ locale }) => {

  const content = {
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last Updated: October 30, 2025',
      intro: 'At Qahwa World, we are committed to protecting your privacy and ensuring the security of your personal information.',
      sections: [
        {
          icon: FileText,
          title: 'Information We Collect',
          content: 'We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or interact with our content. This may include your name, email address, and preferences.',
        },
        {
          icon: Eye,
          title: 'How We Use Your Information',
          content: 'We use the information we collect to provide, maintain, and improve our services, send you newsletters and updates, respond to your comments and questions, and analyze usage patterns to enhance user experience.',
        },
        {
          icon: Lock,
          title: 'Data Security',
          content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
        },
        {
          icon: Shield,
          title: 'Your Rights',
          content: 'You have the right to access, update, or delete your personal information at any time. You can also unsubscribe from our communications by following the link in any email we send.',
        },
      ],
    },
    ar: {
      title: 'سياسة الخصوصية',
      lastUpdated: 'آخر تحديث: 30 أكتوبر 2025',
      intro: 'في عالم القهوة، نحن ملتزمون بحماية خصوصيتك وضمان أمان معلوماتك الشخصية.',
      sections: [
        {
          icon: FileText,
          title: 'المعلومات التي نجمعها',
          content: 'نجمع المعلومات التي تقدمها لنا مباشرة، مثل عند إنشاء حساب أو الاشتراك في نشرتنا الإخبارية أو التفاعل مع محتوانا. قد يشمل ذلك اسمك وعنوان بريدك الإلكتروني وتفضيلاتك.',
        },
        {
          icon: Eye,
          title: 'كيف نستخدم معلوماتك',
          content: 'نستخدم المعلومات التي نجمعها لتوفير خدماتنا وصيانتها وتحسينها، وإرسال النشرات الإخبارية والتحديثات إليك، والرد على تعليقاتك وأسئلتك، وتحليل أنماط الاستخدام لتحسين تجربة المستخدم.',
        },
        {
          icon: Lock,
          title: 'أمن البيانات',
          content: 'نطبق التدابير الفنية والتنظيمية المناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الكشف أو التدمير.',
        },
        {
          icon: Shield,
          title: 'حقوقك',
          content: 'لديك الحق في الوصول إلى معلوماتك الشخصية أو تحديثها أو حذفها في أي وقت. يمكنك أيضاً إلغاء الاشتراك في اتصالاتنا باتباع الرابط في أي بريد إلكتروني نرسله.',
        },
      ],
    },
    ru: {
      title: 'Политика Конфиденциальности',
      lastUpdated: 'Последнее обновление: 30 октября 2025 г.',
      intro: 'В Qahwa World мы стремимся защитить вашу конфиденциальность и обеспечить безопасность вашей личной информации.',
      sections: [
        {
          icon: FileText,
          title: 'Информация, которую мы собираем',
          content: 'Мы собираем информацию, которую вы предоставляете нам напрямую, например, когда вы создаете учетную запись, подписываетесь на нашу рассылку или взаимодействуете с нашим контентом. Это может включать ваше имя, адрес электронной почты и предпочтения.',
        },
        {
          icon: Eye,
          title: 'Как мы используем вашу информацию',
          content: 'Мы используем собранную информацию для предоставления, поддержки и улучшения наших услуг, отправки вам рассылок и обновлений, ответов на ваши комментарии и вопросы, а также анализа моделей использования для улучшения пользовательского опыта.',
        },
        {
          icon: Lock,
          title: 'Безопасность данных',
          content: 'Мы применяем соответствующие технические и организационные меры для защиты вашей личной информации от несанкционированного доступа, изменения, раскрытия или уничтожения.',
        },
        {
          icon: Shield,
          title: 'Ваши права',
          content: 'Вы имеете право получить доступ, обновить или удалить свою личную информацию в любое время. Вы также можете отказаться от подписки на наши рассылки, перейдя по ссылке в любом письме, которое мы отправляем.',
        },
      ],
    },
  };

  const currentContent = content[locale as 'en' | 'ar' | 'ru'] || content.en;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-900 to-amber-700 dark:from-amber-800 dark:to-amber-900 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-white">{currentContent.title}</h1>
          <p className="text-amber-100 dark:text-amber-200">{currentContent.lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              {currentContent.intro}
            </p>
          </div>

          <div className="space-y-6">
            {currentContent.sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-amber-700 dark:text-amber-300" />
                    </div>
                    <div>
                      <h3 className="mb-3 text-gray-900 dark:text-gray-100">{section.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-8 border border-amber-200 dark:border-amber-700">
            <h3 className="mb-3 text-gray-900 dark:text-gray-100">
              {locale === 'ar' 
                ? 'اتصل بنا'
                : locale === 'ru'
                ? 'Свяжитесь с нами'
                : 'Contact Us'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {locale === 'ar'
                ? 'إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا على privacy@qahwaworld.com'
                : locale === 'ru'
                ? 'Если у вас есть вопросы об этой Политике конфиденциальности, пожалуйста, свяжитесь с нами по адресу privacy@qahwaworld.com'
                : 'If you have any questions about this Privacy Policy, please contact us at privacy@qahwaworld.com'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export { PrivacyPage };
