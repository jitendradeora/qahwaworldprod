import React from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Coffee, Users, Globe, Heart } from 'lucide-react';
import { getTranslations } from '@/lib/translations';

interface AboutPageProps {
  locale: string;
}

const AboutPage: React.FC<AboutPageProps> = ({ locale }) => {
  const content = {
    en: {
      hero: 'About Qahwa World',
      intro: 'Your destination for everything coffee',
      mission: 'Our Mission',
      missionText: 'Qahwa World is dedicated to celebrating and exploring the rich culture, history, and community of coffee. We bring together coffee enthusiasts, professionals, and curious minds from around the globe to share stories, insights, and the latest developments in the coffee industry.',
      vision: 'Our Vision',
      visionText: 'We envision a world where coffee brings people together, fostering understanding and appreciation across cultures. Through our multilingual platform, we break down language barriers and create a truly global coffee community.',
      values: 'Our Values',
      valuesItems: [
        {
          icon: Coffee,
          title: 'Quality & Excellence',
          description: 'We are committed to delivering high-quality content that educates and inspires coffee lovers everywhere.',
        },
        {
          icon: Users,
          title: 'Community',
          description: 'Building connections between coffee professionals, enthusiasts, and everyone in between.',
        },
        {
          icon: Globe,
          title: 'Global Perspective',
          description: 'Celebrating coffee culture from every corner of the world through multilingual storytelling.',
        },
        {
          icon: Heart,
          title: 'Passion',
          description: 'Driven by a deep love for coffee and the stories behind every cup.',
        },
      ],
    },
    ar: {
      hero: 'عن عالم القهوة',
      intro: 'وجهتك لكل ما يتعلق بالقهوة',
      mission: 'مهمتنا',
      missionText: 'يكرس عالم القهوة نفسه للاحتفال واستكشاف الثقافة الغنية والتاريخ ومجتمع القهوة. نجمع عشاق القهوة والمحترفين والعقول الفضولية من جميع أنحاء العالم لمشاركة القصص والرؤى وأحدث التطورات في صناعة القهوة.',
      vision: 'رؤيتنا',
      visionText: 'نتصور عالماً تجمع فيه القهوة الناس معاً، وتعزز التفاهم والتقدير عبر الثقافات. من خلال منصتنا متعددة اللغات، نكسر حواجز اللغة ونخلق مجتمع قهوة عالمياً حقيقياً.',
      values: 'قيمنا',
      valuesItems: [
        {
          icon: Coffee,
          title: 'الجودة والتميز',
          description: 'نحن ملتزمون بتقديم محتوى عالي الجودة يثقف ويلهم محبي القهوة في كل مكان.',
        },
        {
          icon: Users,
          title: 'المجتمع',
          description: 'بناء الروابط بين محترفي القهوة والمتحمسين والجميع بينهم.',
        },
        {
          icon: Globe,
          title: 'منظور عالمي',
          description: 'الاحتفال بثقافة القهوة من كل ركن في العالم من خلال رواية القصص متعددة اللغات.',
        },
        {
          icon: Heart,
          title: 'الشغف',
          description: 'مدفوعون بحب عميق للقهوة والقصص وراء كل كوب.',
        },
      ],
    },
    ru: {
      hero: 'О Мире Кофе',
      intro: 'Ваш путеводитель в мире кофе',
      mission: 'Наша Миссия',
      missionText: 'Qahwa World посвящен празднованию и исследованию богатой культуры, истории и сообщества кофе. Мы объединяем любителей кофе, профессионалов и любопытные умы со всего мира, чтобы делиться историями, идеями и последними событиями в кофейной индустрии.',
      vision: 'Наше Видение',
      visionText: 'Мы представляем мир, где кофе объединяет людей, способствуя пониманию и признанию различных культур. Через нашу многоязычную платформу мы преодолеваем языковые барьеры и создаем действительно глобальное кофейное сообщество.',
      values: 'Наши Ценности',
      valuesItems: [
        {
          icon: Coffee,
          title: 'Качество и Совершенство',
          description: 'Мы стремимся предоставлять высококачественный контент, который обучает и вдохновляет любителей кофе повсюду.',
        },
        {
          icon: Users,
          title: 'Сообщество',
          description: 'Создание связей между профессионалами кофе, энтузиастами и всеми, кто между ними.',
        },
        {
          icon: Globe,
          title: 'Глобальная Перспектива',
          description: 'Празднование кофейной культуры со всех уголков мира через многоязычное повествование.',
        },
        {
          icon: Heart,
          title: 'Страсть',
          description: 'Движимые глубокой любовью к кофе и историям за каждой чашкой.',
        },
      ],
    },
  };

  const currentContent = content[locale as 'en' | 'ar' | 'ru'] || content.en;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-900 to-amber-700 dark:from-amber-800 dark:to-amber-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-white">{currentContent.hero}</h1>
          <p className="text-xl text-amber-100 dark:text-amber-200">{currentContent.intro}</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-4 text-gray-900 dark:text-gray-100">{currentContent.mission}</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {currentContent.missionText}
              </p>
            </div>
            <div className="h-96 rounded-xl overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYxNzE5MjY3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Coffee shop"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="h-96 rounded-xl overflow-hidden order-2 lg:order-1">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1693734656256-e589d44cbd30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMHBsYW50YXRpb258ZW58MXx8fHwxNzYxNzUxMDAzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Coffee plantation"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="mb-4 text-gray-900 dark:text-gray-100">{currentContent.vision}</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {currentContent.visionText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12 text-gray-900 dark:text-gray-100">{currentContent.values}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentContent.valuesItems.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-amber-50 dark:hover:bg-amber-900 transition-colors">
                  <div className="w-16 h-16 bg-amber-700 dark:bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="mb-3 text-gray-900 dark:text-gray-100">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export { AboutPage };
