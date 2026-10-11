import { useState } from "react";
import { faq } from "@/mocks/pawsAndClaws";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-background-100 py-24 md:py-32 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.28em] text-primary-600 font-semibold flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-primary-500"></span>
            Questions? We got answers
            <span className="w-8 h-px bg-primary-500"></span>
          </p>
          <h2 className="mt-4 font-heading text-4xl md:text-5xl text-foreground-950 leading-tight">
            Everything you might be wondering about.
          </h2>
        </div>

        <div className="space-y-3">
          {faq.map((item, idx) => {
            const open = openIndex === idx;
            return (
              <div
                key={item.q}
                className={`rounded-2xl border transition-all duration-300 hover:border-primary-200 ${
                  open ? "bg-background-50 border-primary-200" : "bg-background-50 border-background-200/70"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : idx)}
                  className="w-full flex items-center justify-between gap-6 px-6 md:px-8 py-5 text-left cursor-pointer"
                  aria-expanded={open}
                >
                  <span className="font-heading text-lg md:text-xl text-foreground-950">{item.q}</span>
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      open ? "bg-primary-500 text-foreground-50 rotate-180" : "bg-background-100 text-foreground-700"
                    }`}
                  >
                    <i className="ri-add-line" aria-hidden="true"></i>
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 md:px-8 pb-6 text-foreground-700 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}