import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function FloatingButtons() {
  const { settings } = useSiteSettings();
  const contact = settings.contact;
  const telHref = contact.phone ? `tel:${contact.phone.replace(/[^0-9+]/g, "")}` : "#";
  const waHref = `https://wa.me/${contact.whatsappNumber}`;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[9999] flex flex-col gap-2.5 md:gap-3 safe-bottom floating-buttons-safe">
      {/* WhatsApp Button */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="animate-whatsapp-blink group block"
      >
        <div className="flex items-center bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full h-12 md:h-14 min-w-12 md:min-w-14 pl-3 md:pl-3.5 pr-3 md:pr-3.5 transition-all duration-300 ease-out shadow-lg cursor-pointer group-hover:pr-5">
          <i className="ri-whatsapp-line text-xl md:text-2xl flex-shrink-0 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center" aria-hidden="true"></i>
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs md:text-sm font-semibold opacity-0 transition-all duration-300 ease-out group-hover:max-w-[180px] group-hover:opacity-100 group-hover:ml-3">
            Chat on WhatsApp
          </span>
        </div>
      </a>

      {/* Call Button */}
      <a
        href={telHref}
        aria-label="Call Us"
        className="animate-call-blink group block"
      >
        <div className="flex items-center bg-primary-500 hover:bg-primary-600 text-foreground-50 rounded-full h-12 md:h-14 min-w-12 md:min-w-14 pl-3 md:pl-3.5 pr-3 md:pr-3.5 transition-all duration-300 ease-out shadow-lg cursor-pointer group-hover:pr-5">
          <i className="ri-phone-line text-xl md:text-2xl flex-shrink-0 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center" aria-hidden="true"></i>
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs md:text-sm font-semibold opacity-0 transition-all duration-300 ease-out group-hover:max-w-[120px] group-hover:opacity-100 group-hover:ml-3">
            Call Us
          </span>
        </div>
      </a>

      {/* Instagram Button */}
      <a
        href="https://www.instagram.com/pawsandclaws.ad?utm_source=qr&stkn=MTZ2ZGMxMnIyd3htcg=="
        target="_blank"
        rel="noopener noreferrer"
        aria-label="See Our Instagram Page"
        className="animate-instagram-blink group block"
      >
        <div className="flex items-center text-white rounded-full h-12 md:h-14 min-w-12 md:min-w-14 pl-3 md:pl-3.5 pr-3 md:pr-3.5 transition-all duration-300 ease-out shadow-lg cursor-pointer group-hover:pr-5"
          style={{
            background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
          }}
        >
          <i className="ri-instagram-line text-xl md:text-2xl flex-shrink-0 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center" aria-hidden="true"></i>
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs md:text-sm font-semibold opacity-0 transition-all duration-300 ease-out group-hover:max-w-[220px] group-hover:opacity-100 group-hover:ml-3">
            See Our Instagram Page
          </span>
        </div>
      </a>

      {/* Snapchat Button */}
      <a
        href="https://www.snapchat.com/add/pawsandclaws.ad?share_id=f5ZgJGqmo4A&locale=en-AE"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Add Us on Snapchat"
        className="animate-snapchat-blink group block"
      >
        <div className="flex items-center bg-[#FFFC00] hover:bg-[#f2ef00] text-[#111111] rounded-full h-12 md:h-14 min-w-12 md:min-w-14 pl-3 md:pl-3.5 pr-3 md:pr-3.5 transition-all duration-300 ease-out shadow-lg cursor-pointer group-hover:pr-5">
          <i className="ri-snapchat-line text-xl md:text-2xl flex-shrink-0 w-6 h-6 md:w-7 md:h-7 flex items-center justify-center" aria-hidden="true"></i>
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs md:text-sm font-semibold opacity-0 transition-all duration-300 ease-out group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-3">
            Add Us on Snapchat
          </span>
        </div>
      </a>
    </div>
  );
}