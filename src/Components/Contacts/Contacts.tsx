import React from 'react';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { useRealtimeCollection } from "../../lib/hook"; 

/** * 1. Սահմանում ենք iconMap-ը որպես հաստատուն:
 * Օգտագործում ենք Record տիպը, որպեսզի բանալիները լինեն string, իսկ արժեքները՝ React JSX էլեմենտներ:
 */
const iconMap: Record<string, React.ReactElement> = {
  Phone: <Phone className="w-8 h-8 text-[#62d4a0]" />,
  Mail: <Mail className="w-8 h-8 text-[#62d4a0]" />,
  MessageCircle: <MessageCircle className="w-8 h-8 text-[#62d4a0]" />,
};

/** * 2. Սահմանում ենք տվյալների կառուցվածքը (Interface):
 * icon դաշտը պետք է լինի միայն iconMap-ի մեջ գոյություն ունեցող բանալիներից մեկը:
 */
interface ContactItem {
  id: string | number;
  icon: keyof typeof iconMap;
  link: string;
  label: string;
}

export default function ContactSection() {
  /** * 3. Փոխանցում ենք <ContactItem[]> տիպը Hook-ին:
   * Սա թույլ կտա TypeScript-ին իմանալ, թե ինչ դաշտեր ունի "item"-ը map-ի մեջ:
   */
  const { data: contacts, loading, error } = useRealtimeCollection<ContactItem>("db/contacts");

  if (error) return <div className="text-center py-10 text-red-500">Սխալ՝ {error}</div>;

  return (
    <section className="bg-[#f5f5f5] py-16 px-4">
      <div className="max-w-8xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 tracking-wider text-slate-800 uppercase">
          Կոնտակտներ
        </h2>

        <div className="flex flex-wrap justify-center bg-white border-l border-gray-300">
          {loading ? (
            // Skeleton loader
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-1 min-w-[200px] p-20 border-r border-gray-300 animate-pulse bg-gray-50" />
            ))
          ) : (
            contacts?.map((item) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[200px] flex flex-col items-center justify-center p-10 border-r border-gray-300 hover:bg-gray-50 transition-colors group"
              >
                <div className="mb-6 transform group-hover:scale-110 transition-transform">
                  {/* Այստեղ TypeScript-ն արդեն գիտի, որ item.icon-ը համապատասխանում է iconMap-ին */}
                  {iconMap[item.icon] || <MessageCircle className="w-8 h-8 text-[#62d4a0]" />}
                </div>
                <span className="text-sm font-bold text-black text-center uppercase">
                  {item.label}
                </span>
              </a>
            ))
          )}
        </div>
      </div>
    </section>
  );
}