import { type AddressFields, REQUIRED_ADDRESS_KEYS } from "@/lib/bookingOptions";

interface AddressFieldsInputProps {
  value: AddressFields;
  onChange: (field: keyof AddressFields, value: string) => void;
  inputClass: string;
  labelClass: string;
  t: (key: string) => string;
}

interface FieldDef {
  key: keyof AddressFields;
  labelKey: string;
  required: boolean;
  placeholder: string;
  span?: boolean;
}

const FIELDS: FieldDef[] = [
  { key: "house_number", labelKey: "booking.addr_house", required: true, placeholder: "e.g. Villa 12" },
  { key: "street_number", labelKey: "booking.addr_street_no", required: true, placeholder: "e.g. 24" },
  { key: "street_name", labelKey: "booking.addr_street_name", required: true, placeholder: "e.g. Al Bateen Street" },
  { key: "area", labelKey: "booking.addr_area", required: true, placeholder: "e.g. Al Bateen" },
  { key: "city", labelKey: "booking.addr_city", required: true, placeholder: "e.g. Abu Dhabi or Al Ain" },
  { key: "province", labelKey: "booking.addr_province", required: true, placeholder: "e.g. Abu Dhabi Emirate" },
  { key: "country", labelKey: "booking.addr_country", required: true, placeholder: "e.g. United Arab Emirates" },
  { key: "postal_code", labelKey: "booking.addr_postal", required: false, placeholder: "Optional" },
  { key: "landmark", labelKey: "booking.addr_landmark", required: false, placeholder: "Nearby landmark / extra directions", span: true },
];

export default function AddressFieldsInput({
  value,
  onChange,
  inputClass,
  labelClass,
  t,
}: AddressFieldsInputProps) {
  return (
    <div className="rounded-2xl bg-background-100 border border-background-200/70 p-5 md:p-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-8 h-8 rounded-full bg-primary-500 text-foreground-50 flex items-center justify-center shrink-0">
          <i className="ri-map-pin-2-line text-base" aria-hidden="true"></i>
        </span>
        <p className="text-sm font-semibold text-foreground-950">{t("booking.address_title")}</p>
      </div>
      <p className="mb-4 text-xs text-foreground-500">{t("booking.address_hint")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {FIELDS.map((f) => (
          <div key={f.key} className={f.span ? "sm:col-span-2" : ""}>
            <label htmlFor={`b-addr-${f.key}`} className={labelClass}>
              {t(f.labelKey)}
              {f.required && <span className="text-primary-500"> *</span>}
            </label>
            <input
              id={`b-addr-${f.key}`}
              type="text"
              name={`addr_${f.key}`}
              value={value[f.key]}
              onChange={(e) => onChange(f.key, e.target.value)}
              required={REQUIRED_ADDRESS_KEYS.includes(f.key)}
              placeholder={f.placeholder}
              className={inputClass}
            />
          </div>
        ))}
      </div>
    </div>
  );
}