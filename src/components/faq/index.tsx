import React from 'react';
import Link from 'next/link';
import { getLocalizedPath } from '@/lib/localization';
import { ChevronRight, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { getTranslations } from '@/lib/translations';

interface FAQPageProps {
  locale: string;
}

const FAQPage: React.FC<FAQPageProps> = ({ locale }) => {
  const t = getTranslations(locale);
  const getPath = (path: string) => getLocalizedPath(path, locale);

  const faqs = {
    en: [
      {
        question: 'What is Qahwa World?',
        answer: 'Qahwa World is a comprehensive platform dedicated to coffee culture, news, and community. We bring together coffee enthusiasts, professionals, and learners from around the world to share knowledge, stories, and experiences related to coffee.',
      },
      {
        question: 'How often is new content published?',
        answer: 'We publish new articles daily across our various categories including News, Studies, Interviews, and Coffee Reflections. Our team of writers and contributors ensure fresh, engaging content for our readers.',
      },
      {
        question: 'Can I contribute articles to Qahwa World?',
        answer: 'Yes! We welcome contributions from coffee enthusiasts, industry professionals, and experts. Please contact us through our Contact page to discuss your article ideas and our submission guidelines.',
      },
      {
        question: 'Is Qahwa World available in multiple languages?',
        answer: 'Yes, Qahwa World is available in English, Arabic, and Russian. You can switch between languages using the language selector in the header.',
      },
      {
        question: 'How can I stay updated with the latest articles?',
        answer: 'You can subscribe to our newsletter using the subscription form in the header. We send regular updates about our latest articles, interviews, and coffee industry news.',
      },
      {
        question: 'What topics does Qahwa World cover?',
        answer: 'We cover a wide range of topics including coffee news, brewing techniques, sustainability, coffee communities, scientific studies, expert interviews, and personal reflections on coffee culture.',
      },
    ],
    ar: [
      {
        question: 'ما هو عالم القهوة؟',
        answer: 'عالم القهوة هو منصة شاملة مخصصة لثقافة القهوة والأخبار والمجتمع. نجمع عشاق القهوة والمحترفين والمتعلمين من جميع أنحاء العالم لتبادل المعرفة والقصص والتجارب المتعلقة بالقهوة.',
      },
      {
        question: 'كم مرة يتم نشر محتوى جديد؟',
        answer: 'ننشر مقالات جديدة يوميًا عبر فئاتنا المختلفة بما في ذلك الأخبار والدراسات والمقابلات وتأملات القهوة. يضمن فريق الكتاب والمساهمين لدينا محتوى جديد وجذاب لقرائنا.',
      },
      {
        question: 'هل يمكنني المساهمة بمقالات في عالم القهوة؟',
        answer: 'نعم! نرحب بالمساهمات من عشاق القهوة والمحترفين في الصناعة والخبراء. يرجى الاتصال بنا من خلال صفحة الاتصال الخاصة بنا لمناقشة أفكار مقالاتك وإرشادات التقديم الخاصة بنا.',
      },
      {
        question: 'هل عالم القهوة متاح بلغات متعددة؟',
        answer: 'نعم، عالم القهوة متاح باللغات الإنجليزية والعربية والروسية. يمكنك التبديل بين اللغات باستخدام محدد اللغة في الرأس.',
      },
      {
        question: 'كيف يمكنني البقاء على اطلاع بأحدث المقالات؟',
        answer: 'يمكنك الاشتراك في نشرتنا الإخبارية باستخدام نموذج الاشتراك في الرأس. نرسل تحديثات منتظمة حول أحدث مقالاتنا ومقابلاتنا وأخبار صناعة القهوة.',
      },
      {
        question: 'ما هي المواضيع التي يغطيها عالم القهوة؟',
        answer: 'نغطي مجموعة واسعة من المواضيع بما في ذلك أخبار القهوة وتقنيات التحضير والاستدامة ومجتمعات القهوة والدراسات العلمية ومقابلات الخبراء والتأملات الشخصية حول ثقافة القهوة.',
      },
    ],
    ru: [
      {
        question: 'Что такое Qahwa World?',
        answer: 'Qahwa World - это всеобъемлющая платформа, посвященная кофейной культуре, новостям и сообществу. Мы объединяем любителей кофе, профессионалов и учащихся со всего мира для обмена знаниями, историями и опытом, связанным с кофе.',
      },
      {
        question: 'Как часто публикуется новый контент?',
        answer: 'Мы публикуем новые статьи ежедневно в различных категориях, включая новости, исследования, интервью и размышления о кофе. Наша команда авторов и участников обеспечивает свежий и увлекательный контент для наших читателей.',
      },
      {
        question: 'Могу ли я внести статьи в Qahwa World?',
        answer: 'Да! Мы приветствуем вклад от любителей кофе, профессионалов отрасли и экспертов. Свяжитесь с нами через страницу контактов, чтобы обсудить ваши идеи статей и наши рекомендации по отправке.',
      },
      {
        question: 'Доступен ли Qahwa World на нескольких языках?',
        answer: 'Да, Qahwa World доступен на английском, арабском и русском языках. Вы можете переключаться между языками с помощью переключателя языков в заголовке.',
      },
      {
        question: 'Как я могу быть в курсе последних статей?',
        answer: 'Вы можете подписаться на нашу рассылку, используя форму подписки в заголовке. Мы отправляем регулярные обновления о наших последних статьях, интервью и новостях индустрии кофе.',
      },
      {
        question: 'Какие темы освещает Qahwa World?',
        answer: 'Мы освещаем широкий спектр тем, включая новости о кофе, методы приготовления, устойчивость, кофейные сообщества, научные исследования, интервью экспертов и личные размышления о кофейной культуре.',
      },
    ],
  };

  const currentFaqs = faqs[locale as 'en' | 'ar' | 'ru'] || faqs.en;
  
  const titles = {
    en: { faq: 'FAQ', question: "Didn't find your answer?", desc: "Feel free to reach out to our support team for personalized assistance.", contact: 'Contact Us', title: 'Frequently Asked Questions', subtitle: 'Find answers to common questions about Qahwa World' },
    ar: { faq: 'الأسئلة الشائعة', question: 'لم تجد إجابتك؟', desc: 'لا تتردد في التواصل مع فريق الدعم للحصول على مساعدة شخصية.', contact: 'اتصل بنا', title: 'الأسئلة الشائعة', subtitle: 'اعثر على إجابات للأسئلة الشائعة حول عالم القهوة' },
    ru: { faq: 'Часто задаваемые вопросы', question: 'Не нашли ответ?', desc: 'Не стесняйтесь обращаться к нашей службе поддержки за персонализированной помощью.', contact: 'Связаться с нами', title: 'Часто задаваемые вопросы', subtitle: 'Найдите ответы на распространенные вопросы о Qahwa World' }
  };
  const currentTitles = titles[locale as 'en' | 'ar' | 'ru'] || titles.en;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href={getPath(`/`)} className="hover:text-amber-700 dark:hover:text-amber-500">
              {t.home}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-gray-100">
              {t.faq.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <HelpCircle className="w-16 h-16 text-amber-700 dark:text-amber-500 mx-auto mb-6" />
            <h1 className="text-4xl text-amber-900 dark:text-amber-100 mb-4">
              {currentTitles.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {currentTitles.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {currentFaqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white dark:bg-gray-800 border dark:border-gray-700 px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left hover:text-amber-700 dark:hover:text-amber-500">
                  <span className="text-lg text-gray-900 dark:text-gray-100">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div className="mt-12 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm p-8 text-center rounded-lg">
            <h3 className="text-2xl text-amber-900 dark:text-amber-100 mb-4">
              {currentTitles.question}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {currentTitles.desc}
            </p>
            <Link
              href={getPath(`/contact`)}
              className="px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-md transition-colors inline-block"
            >
              {currentTitles.contact}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export { FAQPage };
