-- ============================================================================
-- Paws and Claws — seed data
-- Populates the catalogue, content and settings the site ships with, then
-- creates the administrator account. Idempotent: safe to re-run.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Pet categories
-- ---------------------------------------------------------------------------
insert into public.pet_categories (id, label, singular, icon, sort_order, active) values
  ('dogs',  'Dogs',              'Dog',    'ri-footprint-line',       10, true),
  ('cats',  'Cats',              'Cat',    'ri-emotion-happy-line',   20, true),
  ('birds', 'Birds',             'Bird',   'ri-flight-takeoff-line',  30, true),
  ('bunny', 'Rabbits & Bunnies', 'Rabbit', 'ri-heart-line',           40, true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Services
-- ---------------------------------------------------------------------------
insert into public.services (id, name, category, description, price_aed, duration, icon, sort_order, active, pet_type) values
  ('cat-basic',  'Cat Basic Grooming',  'cats',  $d$A gentle, unhurried session that keeps your cat clean and comfortable, using organic products and a soft touch that suits even the most nervous felines.$d$, 180, '90 min',  'ri-emotion-happy-line', 10, true, 'cat'),
  ('cat-full',   'Cat Full Grooming',   'cats',  $d$The complete works for cats — the full wash-and-care routine plus a tailored breed cut and the extra finishing touches that make a real difference.$d$, 230, '120 min', 'ri-magic-line', 20, true, 'cat'),
  ('cat-haircut','Cat Haircut',         'cats',  $d$Our feline stylists shape the coat to suit your cat's breed, body and personality — from a cool summer trim to a full show-style finish.$d$, 180, '90 min',  'ri-scissors-cut-line', 30, true, 'cat'),
  ('cat-deep',   'Cat Deep Cleaning',   'cats',  $d$An intensive triple-wash session for cats who need the deepest possible clean, finished with premium detailing from nose to tail.$d$, 280, '150 min', 'ri-sparkling-line', 40, true, 'cat'),
  ('cat-trim',   'Cat Trimming',        'cats',  $d$A fast, no-nonsense refresh focused on combing and tidying up — perfect for keeping your cat neat in between bigger grooming days.$d$, 130, '45 min',  'ri-seedling-line', 50, true, 'cat'),
  ('cat-wash',   'Cat Washing',         'cats',  $d$A calm double wash and blow-out that leaves the coat soft, clean and lightly scented — no cutting, just pure freshness.$d$, 130, '60 min',  'ri-water-flash-line', 60, true, 'cat'),
  ('dog-basic',  'Dog Basic Grooming',  'dogs',  $d$Everything your dog needs to stay clean, fresh and comfortable, finished with organic products and a calm, one-on-one approach.$d$, 180, '90 min',  'ri-footprint-line', 70, true, 'dog'),
  ('dog-full',   'Dog Full Grooming',   'dogs',  $d$Our most complete dog groom — the entire wash-and-care ritual plus a breed-appropriate haircut and all the premium finishing details.$d$, 230, '120 min', 'ri-heart-3-line', 80, true, 'dog'),
  ('dog-haircut','Dog Haircut',         'dogs',  $d$Whether you want a soft teddy-bear look or a sleek breed cut, our stylists shape the coat precisely and comfortably to suit your dog.$d$, 180, '90 min',  'ri-sun-line', 90, true, 'dog'),
  ('dog-deep',   'Dog Deep Cleaning',   'dogs',  $d$A thorough triple-wash treatment that tackles odour, loose fur and build-up, leaving your dog's coat spotless and beautifully conditioned.$d$, 280, '150 min', 'ri-drop-line', 100, true, 'dog'),
  ('dog-trim',   'Dog Trimming',        'dogs',  $d$A quick tidy-up that keeps your dog's coat fresh and manageable between full grooming appointments.$d$, 130, '45 min',  'ri-leaf-line', 110, true, 'dog'),
  ('dog-wash',   'Dog Washing',         'dogs',  $d$A warm, gentle bath and blow-dry that leaves your dog's coat clean, soft and smelling wonderful — no trimming required.$d$, 130, '60 min',  'ri-water-flash-line', 120, true, 'dog'),
  ('bird-full',  'Birds Full Grooming', 'birds', $d$A full grooming session designed around the delicate needs of birds, using gentle, bird-safe products from start to finish.$d$, 170, '60 min',  'ri-flight-takeoff-line', 130, true, 'bird'),
  ('bunny-full', 'Bunny Full Grooming', 'bunny', $d$A calm, complete grooming routine tailored to rabbits, keeping the coat healthy and their sensitive skin comfortable.$d$, 170, '60 min',  'ri-heart-line', 140, true, 'rabbit'),
  ('flea-tick-bath', 'Flea & Tick Medical Bath', 'medical', $d$Medicated shampoo to remove flea and tick bodies from the skin, Fibrotec pills to prevent future infestations, and body-sterilisation medicine for comprehensive prevention.$d$, 90, '45 min', 'ri-bug-2-line', 200, true, 'all'),
  ('fungal-bath',    'Fungal Medicated Bath',    'medical', $d$Medicated fungus shampoo that disinfects and deeply cleans the affected areas — a targeted antifungal treatment to soothe and clear fungal conditions.$d$, 90, '45 min', 'ri-first-aid-kit-line', 210, true, 'all'),
  ('anal-glands',    'Anal Glands Expressed',    'addons',  $d$Gentle, professional gland care delivered hygienically as an add-on to any groom.$d$, 20, '15 min', 'ri-hand-heart-line', 300, true, 'all'),
  ('nail-trimming',  'Nail Trimming',            'addons',  $d$Safe, precise nail clipping and polishing with careful handling.$d$, 20, '15 min', 'ri-scissors-2-line', 310, true, 'all'),
  ('teeth-brushing', 'Teeth Brushing',           'addons',  $d$Fresh, clean teeth and healthy gums using pet-safe toothpaste.$d$, 20, '15 min', 'ri-emotion-happy-line', 320, true, 'all'),
  ('mouthwash',      'Mouthwash',                'addons',  $d$A gentle oral rinse that removes bacteria and odours for fresh breath.$d$, 20, '10 min', 'ri-emotion-normal-line', 330, true, 'all'),
  ('paw-balm',       'Natural Paw Balm',         'addons',  $d$Soft, nourished and protected paws with a natural, pet-safe balm.$d$, 20, '10 min', 'ri-hand-heart-line', 340, true, 'all'),
  ('de-matting',     'De-matting Remove',        'addons',  $d$Careful, low-stress removal of mats and tangles without hurting the skin.$d$, 50, '20 min', 'ri-scissors-cut-line', 350, true, 'all')
on conflict (id) do nothing;

-- Size-based pricing for the larger dog grooms (small / medium / large / xl)
insert into public.service_size_prices (service_id, size, price_aed) values
  ('dog-wash',  'small', 130), ('dog-wash',  'medium', 180), ('dog-wash',  'large', 230), ('dog-wash',  'xl', 280),
  ('dog-basic', 'small', 180), ('dog-basic', 'medium', 230), ('dog-basic', 'large', 280), ('dog-basic', 'xl', 330),
  ('dog-full',  'small', 230), ('dog-full',  'medium', 280), ('dog-full',  'large', 330), ('dog-full',  'xl', 380),
  ('dog-deep',  'small', 280), ('dog-deep',  'medium', 330), ('dog-deep',  'large', 380), ('dog-deep',  'xl', 430)
on conflict (service_id, size) do nothing;

-- ---------------------------------------------------------------------------
-- Packages
-- ---------------------------------------------------------------------------
insert into public.packages
  (id, name, short_description, full_description, pet_type, pet_size, original_price, duration, treatments, featured, sort_order, active)
values
  ('basic-grooming', 'Basic Grooming', 'Ideal for regular upkeep',
   $d$The complete everyday groom — wash, tidy and polish, finished with a breath-fresh touch and a free checkup.$d$,
   'cat', 'small', 180, '90 min',
   '["Double wash with organic shampoo","Organic conditioner","Hair combing","De-shedding removal","Ear cleaning","Eye cleaning","Nail clipping & polish","Organic body spray","Teeth brushing","Organic breath spray","Facial treatment","Free Checkup Service"]'::jsonb,
   false, 10, true),
  ('full-grooming', 'Full Grooming', 'Our most popular package',
   $d$Everything in Basic plus a tailored haircut and gentle detailing — our most popular all-round package.$d$,
   'cat', 'small', 230, '120 min',
   '["Double wash with organic shampoo","Organic conditioner","Hair combing","De-shedding removal","Ear cleaning","Eye cleaning","Nail clipping & polish","Organic body spray","Organic breath spray","Facial treatment","Tooth brushing","Sensitive-area shaving","Paw shaving","Breed cut","Free Checkup Service"]'::jsonb,
   true, 20, true),
  ('deep-cleaning', 'Deep Cleaning', 'The deepest clean available',
   $d$Our most intensive clean — a triple wash with full detailing from nose to tail for a complete reset.$d$,
   'cat', 'small', 280, '150 min',
   '["Triple wash with organic shampoo","Organic conditioner","Hair combing","De-shedding removal","Ear cleaning","Eye cleaning","Nail clipping & polish","Organic body spray","Organic breath spray","Facial treatment","Tooth brushing","Sensitive-area shaving","Paw shaving","Breed cut","Mouthwash (removes bacteria & odours)","Paw palm & polish","De-matting","Anal glands expressed","Free Checkup Service"]'::jsonb,
   false, 30, true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Gallery categories + a starter set of images
-- ---------------------------------------------------------------------------
insert into public.gallery_categories (id, label, sort_order, active) values
  ('packages',         'Grooming Packages',   10, true),
  ('animals',          'Other Animals',       20, true),
  ('haircut-services', 'Haircut Services',    30, true),
  ('cat-styles',       'Cat Haircut Styles',  40, true),
  ('dog-styles',       'Dog Haircut Styles',  50, true),
  ('medical',          'Medical Baths',       60, true),
  ('extras',           'Extra Add-ons',       70, true)
on conflict (id) do nothing;

insert into public.gallery_images (title, caption, alt, category_id, image_url, featured, sort_order, active)
select * from (values
  ('Wash and Trimming', 'A fresh double-wash and tidy-up with no cutting', 'Wash and Trimming — dog enjoying a warm organic shampoo bath', 'packages', 'https://readdy.ai/api/search-image?query=a%20golden%20retriever%20enjoying%20a%20warm%20bubbly%20bath%20with%20organic%20shampoo%20lather%20on%20its%20coat%20while%20a%20groomer%20gently%20scrubs%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic%2C%20high%20detail%20wet%20fur%20texture&width=800&height=800&seq=gal-wash-trim-1&orientation=squarish', true, 10, true),
  ('Full Grooming', 'Wash, tidy and a tailored haircut', 'Full Grooming — a perfectly styled poodle', 'packages', 'https://readdy.ai/api/search-image?query=a%20perfectly%20groomed%20poodle%20dog%20with%20a%20fresh%20stylish%20haircut%20sitting%20proudly%20and%20looking%20at%20the%20camera%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic%2C%20sculpted%20coat&width=800&height=800&seq=gal-full-1&orientation=squarish', false, 20, true),
  ('Rabbits Full Grooming', 'Soft, clean and comfortable rabbits', 'Rabbits Full Grooming — gentle brushing', 'animals', 'https://readdy.ai/api/search-image?query=a%20fluffy%20white%20rabbit%20being%20gently%20brushed%20by%20a%20groomer%20with%20a%20soft%20slicker%20brush%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic%2C%20soft%20fur&width=800&height=800&seq=gal-rabbit-1&orientation=squarish', false, 30, true),
  ('Birds Full Grooming', 'Complete care for your feathered friend', 'Birds Full Grooming — feather care', 'animals', 'https://readdy.ai/api/search-image?query=a%20colorful%20parakeet%20perched%20calmly%20while%20a%20groomer%20gently%20tends%20to%20its%20feathers%20with%20careful%20hands%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-bird-1&orientation=squarish', false, 40, true),
  ('Style Cut', 'A creative style shaped to your choice', 'Style Cut — fashionable modern haircut', 'haircut-services', 'https://readdy.ai/api/search-image?query=a%20stylishly%20groomed%20dog%20with%20a%20fashionable%20modern%20haircut%20standing%20confidently%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-style-1&orientation=squarish', false, 50, true),
  ('Showstar Cut', 'International show-quality finishing', 'Showstar Cut — show-ready toy poodle', 'haircut-services', 'https://readdy.ai/api/search-image?query=a%20show%20ready%20toy%20poodle%20with%20an%20elaborate%20classic%20show%20cut%20and%20pom%20poms%20standing%20in%20a%20perfect%20pose%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-showstar-1&orientation=squarish', false, 60, true),
  ('Lion Cut', 'Majestic mane with fluffy boots and pom-pom', 'Lion Cut — majestic mane around head and neck', 'cat-styles', 'https://readdy.ai/api/search-image?query=a%20long%20haired%20cat%20with%20a%20bold%20lion%20cut%20showing%20a%20thick%20luxurious%20mane%20around%20the%20head%20and%20neck%20and%20a%20shaved%20body%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-lion-1&orientation=squarish', false, 70, true),
  ('Kitten Cut', 'Fluffy, youthful medium-length coat', 'Kitten Cut — soft youthful coat', 'cat-styles', 'https://readdy.ai/api/search-image?query=an%20adult%20cat%20with%20a%20kitten%20cut%20showing%20a%20soft%20medium%20length%20fluffy%20coat%20that%20looks%20youthful%20and%20innocent%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-cat-kitten-1&orientation=squarish', false, 80, true),
  ('Teddy Bear Cut', 'Plush, rounded face like a stuffed toy', 'Teddy Bear Cut — plush rounded face', 'dog-styles', 'https://readdy.ai/api/search-image?query=a%20fluffy%20dog%20with%20a%20teddy%20bear%20cut%20showing%20a%20plush%20uniform%20coat%20and%20an%20expertly%20rounded%20face%20like%20a%20stuffed%20toy%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-dog-teddy-1&orientation=squarish', false, 90, true),
  ('Poodle Cut', 'Classic elegant trim with pom-poms', 'Poodle Cut — elegant show pom-poms', 'dog-styles', 'https://readdy.ai/api/search-image?query=a%20poodle%20with%20a%20classic%20elegant%20show%20cut%20showing%20a%20shaved%20face%20and%20voluminous%20pom%20poms%20on%20the%20legs%20tail%20and%20topknot%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-dog-poodle-1&orientation=squarish', false, 100, true),
  ('Flea & Tick Medical Bath', 'Medicated shampoo to remove fleas and ticks', 'Flea & Tick Bath — medicated shampoo lather', 'medical', 'https://readdy.ai/api/search-image?query=a%20groomer%20applying%20medicated%20shampoo%20to%20a%20dog%20during%20a%20flea%20and%20tick%20medical%20bath%20with%20rich%20lather%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-flea-1&orientation=squarish', false, 110, true),
  ('Fungal Medicated Bath', 'Antifungal shampoo to disinfect the skin', 'Fungal Bath — antifungal shampoo application', 'medical', 'https://readdy.ai/api/search-image?query=a%20groomer%20applying%20medicated%20antifungal%20shampoo%20to%20a%20dog%20to%20disinfect%20and%20clean%20affected%20skin%20areas%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-fungal-1&orientation=squarish', false, 120, true),
  ('Nail Trimming', 'Safe, precise nail clipping', 'Nail Trimming — precise clipping', 'extras', 'https://readdy.ai/api/search-image?query=a%20groomer%20carefully%20trimming%20the%20nails%20of%20a%20dog%20with%20professional%20nail%20clippers%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic%2C%20close%20detail&width=800&height=800&seq=gal-nail-1&orientation=squarish', false, 130, true),
  ('Natural Paw Balm', 'Soft, nourished and protected paws', 'Natural Paw Balm — nourishing paw pads', 'extras', 'https://readdy.ai/api/search-image?query=a%20groomer%20applying%20natural%20paw%20balm%20to%20the%20paw%20pads%20of%20a%20dog%20for%20soft%20nourished%20paws%2C%20deep%20royal%20purple%20studio%20background%20with%20warm%20golden%20accent%20lighting%2C%20soft%20diffused%20light%2C%20editorial%20professional%20pet%20grooming%20photography%2C%20premium%20salon%20aesthetic&width=800&height=800&seq=gal-paw-balm-1&orientation=squarish', false, 140, true)
) as v(title, caption, alt, category_id, image_url, featured, sort_order, active)
where not exists (select 1 from public.gallery_images);

-- ---------------------------------------------------------------------------
-- Website testimonials
-- ---------------------------------------------------------------------------
insert into public.reviews (customer_name, review_text, rating, review_date, featured, published, sort_order)
select * from (values
  ('Aisha M.',  'The mobile van turned up right on time and my golden retriever came back looking absolutely gorgeous. Zero stress for both of us.', 5, date '2026-08-02', true,  true, 10),
  ('Daniel R.', 'My Persian cat is usually terrified of grooming, but the team was so patient and gentle. She stayed calm the whole time.', 5, date '2026-07-21', true,  true, 20),
  ('Fatima A.', 'Booked a full groom for my poodle and the cut was perfect. You can tell they genuinely care about the animals.', 5, date '2026-07-09', true,  true, 30),
  ('Sara K.',   'Loved that it comes right to my door. No carrier, no car ride, no waiting room. My beagle was so relaxed afterwards.', 5, date '2026-06-28', true,  true, 40),
  ('Omar H.',   'Friendly, professional and great with nervous pets. The deep clean left my husky coat so soft and shiny.', 5, date '2026-06-15', true,  true, 50),
  ('Leila N.',  'First time using a mobile groomer and I am completely converted. Easy booking, clear pricing and a lovely result.', 5, date '2026-05-30', true,  true, 60)
) as v(customer_name, review_text, rating, review_date, featured, published, sort_order)
where not exists (select 1 from public.reviews);

-- ---------------------------------------------------------------------------
-- Blog
-- ---------------------------------------------------------------------------
insert into public.blog_posts (slug, title, excerpt, content, cover_image, category, tags, status, published_at)
values
  ('how-often-should-you-groom-your-dog',
   'How Often Should You Really Groom Your Dog?',
   $d$Most pet parents either groom too often or not enough. Here is the science-backed answer based on breed, coat type, and lifestyle.$d$,
   $d$If you have ever stared at your shaggy golden retriever and wondered if it is time, you are not alone. Grooming frequency is one of the most common questions we get at Paws and Claws — and the answer is more nuanced than you would think.

The short answer: most dogs need a professional groom every 4 to 8 weeks. But that range is so wide it is almost useless without context.

Short-coat breeds like Beagles, Boxers and Dalmatians can go 6 to 8 weeks between grooms. Their coats are low-maintenance, but they still benefit from regular baths to control shedding and keep skin healthy.

Medium and long-coat breeds — think Golden Retrievers, Cocker Spaniels and Huskies — need grooming every 4 to 6 weeks. These coats mat easily, and once mats form they pull on the skin and can cause real pain.

Double-coated breeds like Samoyeds, Malamutes and German Shepherds need special attention. Their undercoat needs de-shedding every 4 to 6 weeks, especially during seasonal coat blows.

Poodles and doodles have hair that grows continuously. Without a trim every 4 to 6 weeks they develop painful mats and skin issues.

The most important thing? Consistency. A regular grooming schedule is far better than emergency de-matting sessions.$d$,
   'https://readdy.ai/api/search-image?query=beautiful%20fluffy%20golden%20retriever%20being%20gently%20brushed%20by%20a%20professional%20groomer%20wearing%20deep%20purple%20apron%20inside%20a%20bright%20clean%20mobile%20grooming%20van%20with%20natural%20daylight%2C%20professional%20pet%20grooming%20editorial%20photography%2C%20purple%20and%20gold%20tones%2C%20clean%20composition&width=1200&height=800&seq=pc-blog-01&orientation=landscape&nocache=true',
   'Dog Care', '["dogs","grooming","care"]'::jsonb, 'published', timestamptz '2026-06-15 09:00:00+04'),
  ('cat-grooming-stress-free-tips',
   'Stress-Free Cat Grooming: What Every Cat Parent Should Know',
   $d$Cats and water do not always mix — but with the right approach, grooming can be a calm, even enjoyable experience for your feline friend.$d$,
   $d$Most cats would rather climb the curtains than sit through a grooming session. But regular grooming is essential for their health — especially for long-haired breeds.

The key to stress-free cat grooming starts before the appointment. Our feline specialist uses a completely different approach from dog grooming. No cages, no other animals, and we come to your home — so your cat never leaves their safe territory.

Preparation is everything. Before we arrive, keep your cat in a quiet room with their favourite blanket or bed.

During the session we use low-noise clippers, warm water and gentle handling techniques. We watch your cat body language constantly and slow down when needed.

For first-time feline clients we recommend starting with just a sanitary trim and nail clip. Once trust is built we can graduate to full baths and breed-specific cuts like the popular lion cut.

The biggest myth? That cats clean themselves so they do not need grooming. While cats do self-groom, they cannot trim their own nails, clean their ears, or handle matted fur.$d$,
   'https://readdy.ai/api/search-image?query=beautiful%20calm%20persian%20cat%20being%20gently%20brushed%20on%20a%20soft%20cream%20grooming%20table%20with%20warm%20natural%20daylight%2C%20professional%20feline%20grooming%20photography%2C%20peaceful%20serene%20atmosphere%2C%20clean%20modern%20pet%20salon%20aesthetic%20with%20purple%20and%20gold%20accents&width=1200&height=800&seq=pc-blog-02&orientation=landscape&nocache=true',
   'Cat Care', '["cats","grooming"]'::jsonb, 'published', timestamptz '2026-05-28 09:00:00+04'),
  ('mobile-vs-salon-grooming',
   'Mobile vs. Salon Grooming: Which Is Better for Your Pet?',
   $d$The debate is real. We compare the two side by side — convenience, cost, stress levels and quality — so you can make the best choice.$d$,
   $d$Traditional salons have been the default for decades. Mobile grooming is the new kid on the block — but it is growing fast, especially in Abu Dhabi where traffic and heat make salon trips particularly stressful.

Let us start with the obvious winner for stress levels: mobile grooming. Your pet stays in their own neighbourhood, walks a few metres to the van, and is the only animal being groomed.

Salons can handle multiple pets simultaneously, which means lower prices — but it also means your pet might spend hours waiting in a cage between steps.

Quality-wise, mobile grooming has an edge for one key reason: undivided attention. Our groomers work on one pet at a time.

For convenience, mobile wins hands down in a city like Abu Dhabi. No battling traffic, no finding parking, no coordinating double trips.

Our verdict? If your pet gets anxious in the car, hates other dogs, or you value your time — go mobile.$d$,
   'https://readdy.ai/api/search-image?query=modern%20white%20mobile%20pet%20grooming%20van%20parked%20outside%20a%20beautiful%20dubai%20villa%20with%20palm%20trees%20in%20golden%20hour%20light%2C%20warm%20natural%20light%2C%20professional%20photography%2C%20clean%20minimalist%20aesthetic%20with%20purple%20and%20gold%20branding%20details&width=1200&height=800&seq=pc-blog-03&orientation=landscape&nocache=true',
   'Pet Care', '["mobile","grooming"]'::jsonb, 'published', timestamptz '2026-05-10 09:00:00+04'),
  ('summer-grooming-tips-abu-dhabi',
   'Summer Grooming Tips for Abu Dhabi Heat — What Works and What Does Not',
   $d$Abu Dhabi summers are brutal on pets. Here is how to adjust your grooming routine to keep your furry friend cool, comfortable and safe.$d$,
   $d$Abu Dhabi in July is not just hot — it is surface-of-the-sun hot. And for our furry companions that heat can be dangerous. The good news? Smart grooming makes a massive difference.

The biggest misconception we hear: that you should shave your dog for summer. Please do not. A dog coat is actually an insulator that works both ways.

Instead, focus on thorough de-shedding. Removing that dense undercoat allows air to circulate against the skin.

Paw pad care is critical in Abu Dhabi. Pavement can reach 70 degrees Celsius in summer, causing burns on unprotected paws.

Bathing frequency should increase slightly in summer — every 2 to 3 weeks instead of 4 to 6.

And please: never leave your pet in a parked car. Even with windows cracked, temperatures rise to deadly levels in minutes.$d$,
   'https://readdy.ai/api/search-image?query=happy%20fluffy%20samoyed%20dog%20with%20a%20clean%20summer%20trim%20sitting%20in%20shade%20near%20a%20pool%20with%20a%20cooling%20mat%2C%20warm%20golden%20hour%20light%2C%20fresh%20and%20cool%20aesthetic%2C%20professional%20pet%20photography%20with%20soft%20natural%20lighting%2C%20gold%20accents&width=1200&height=800&seq=pc-blog-04&orientation=landscape&nocache=true',
   'Seasonal Tips', '["summer","dogs","care"]'::jsonb, 'published', timestamptz '2026-04-22 09:00:00+04'),
  ('puppy-first-groom-guide',
   'Your Puppy First Groom: A Complete Guide for Nervous Pet Parents',
   $d$That first grooming session sets the tone for a lifetime. Here is exactly what to expect and how to prepare your puppy for success.$d$,
   $d$Bringing a puppy for their first groom can be nerve-wracking — for you and for them. But with the right preparation and a gentle approach that first visit can be a positive, bonding experience.

Our puppy grooming sessions are specifically designed for puppies under 6 months. The goal is not a perfect haircut — it is building trust.

Before we arrive, help your puppy get comfortable with being touched. Gently handle their paws, ears and mouth for a few seconds each day, with treats as rewards.

During the session we go slow. We let the puppy explore the van, sniff the equipment and get comfortable before we start anything.

We use treat rewards throughout — positive reinforcement is the foundation of puppy grooming.

Pro tip: book your puppy first groom as soon as they have had their second round of vaccinations.$d$,
   'https://readdy.ai/api/search-image?query=adorable%20fluffy%20golden%20retriever%20puppy%20sitting%20on%20a%20soft%20cream%20grooming%20table%20being%20gently%20brushed%20with%20a%20warm%20smile%2C%20soft%20natural%20window%20light%2C%20calm%20and%20gentle%20atmosphere%2C%20professional%20pet%20photography%20with%20purple%20and%20gold%20tones&width=1200&height=800&seq=pc-blog-05&orientation=landscape&nocache=true',
   'Dog Care', '["puppy","grooming"]'::jsonb, 'published', timestamptz '2026-03-15 09:00:00+04'),
  ('pet-grooming-myths-debunked',
   '5 Pet Grooming Myths That Need to Die in 2026',
   $d$From dogs hating baths to cats grooming themselves — we are setting the record straight on the most persistent grooming myths.$d$,
   $d$Myth 1: Dogs naturally hate baths. Truth: most dogs love water when it is introduced gently and at a comfortable temperature.

Myth 2: Cats do not need professional grooming. Truth: while cats groom themselves, they cannot trim nails, clean ears, or handle matted fur.

Myth 3: Shaving a dog keeps them cooler. Truth: a dog coat is a natural temperature regulator. Proper de-shedding is far more effective.

Myth 4: You should wash your dog every week. Truth: over-bathing strips natural oils and causes dry, itchy skin.

Myth 5: Grooming is just about looks. Truth: regular grooming prevents skin infections, ear problems, nail overgrowth and dental issues.

The bottom line? Grooming is an essential part of responsible pet ownership — not a luxury.$d$,
   'https://readdy.ai/api/search-image?query=clean%20modern%20pet%20grooming%20tools%20arranged%20beautifully%20on%20a%20cream%20linen%20cloth%20with%20deep%20purple%20background%2C%20professional%20pet%20grooming%20supplies%20including%20brush%20scissors%20and%20shampoo%2C%20editorial%20product%20photography%20with%20soft%20natural%20lighting%2C%20minimalist%20aesthetic&width=1200&height=800&seq=pc-blog-06&orientation=landscape&nocache=true',
   'Pet Care', '["myths","care"]'::jsonb, 'published', timestamptz '2026-02-08 09:00:00+04')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Site settings (contact, bank, home, navigation, footer)
-- ---------------------------------------------------------------------------
insert into public.site_settings (key, value) values
  ('contact', $j${
    "phone": "+971 55 703 3165",
    "whatsapp": "+971 55 703 3165",
    "whatsappNumber": "971557033165",
    "email": "Pawsandclawsauh@gmail.com",
    "address": "Al Ain, United Arab Emirates",
    "hours": "Daily 8:00 AM – 8:00 PM"
  }$j$::jsonb),
  ('bank', $j${
    "bankName": "ADIB",
    "accountHolder": "MUHAMMAD AHSAN",
    "accountNumber": "28867164",
    "iban": "AE760500000000028867164",
    "swift": "ABDIAEADXXX",
    "currency": "AED"
  }$j$::jsonb),
  ('home', $j${
    "heroTitle": "Premium Mobile Pet Grooming in Al Ain",
    "heroSubtitle": "Gentle, salon-quality grooming for your dog or cat — delivered right to your doorstep.",
    "bannerText": "",
    "bannerActive": false
  }$j$::jsonb),
  ('navigation', $j${
    "links": [
      {"label":"Home","href":"/","icon":"ri-home-4-line"},
      {"label":"About Us","href":"/about","icon":"ri-information-line"},
      {"label":"Services","href":"/services","icon":"ri-scissors-cut-line"},
      {"label":"Blog","href":"/blog","icon":"ri-article-line"},
      {"label":"Gallery","href":"/gallery","icon":"ri-gallery-line"},
      {"label":"Contact","href":"/contact","icon":"ri-phone-line"}
    ]
  }$j$::jsonb),
  ('footer', $j${
    "tagline": "Bringing calm, cage-free grooming to pets across the UAE, one happy tail at a time.",
    "exploreTitle": "Explore",
    "exploreLinks": [
      {"label":"Home","href":"/","icon":"ri-home-4-line"},
      {"label":"About Us","href":"/about","icon":"ri-information-line"},
      {"label":"Services","href":"/services","icon":"ri-scissors-cut-line"},
      {"label":"Booking","href":"/booking","icon":"ri-calendar-check-line"},
      {"label":"Gallery","href":"/gallery","icon":"ri-gallery-line"},
      {"label":"Blog","href":"/blog","icon":"ri-article-line"},
      {"label":"Find my booking","href":"/find-booking","icon":"ri-search-line"},
      {"label":"Track Your Order","href":"/find-booking","icon":"ri-route-line"}
    ],
    "contactTitle": "Get in touch",
    "legalLinks": [
      {"label":"Privacy Policy","href":"/privacy","icon":""},
      {"label":"Booking Policies","href":"/booking-policies","icon":""},
      {"label":"Terms of Service","href":"#","icon":""},
      {"label":"Trade licence","href":"#","icon":""}
    ],
    "socials": [
      {"label":"Instagram","href":"https://www.instagram.com/pawsandclaws.ad","icon":"ri-instagram-line"},
      {"label":"Facebook","href":"https://www.facebook.com/share/1Bf4HuLpJX/","icon":"ri-facebook-fill"},
      {"label":"TikTok","href":"https://www.tiktok.com/@pawsandclaws.ad","icon":"ri-tiktok-line"},
      {"label":"Snapchat","href":"https://www.snapchat.com/add/pawsandclaws.ad","icon":"ri-snapchat-line"},
      {"label":"WhatsApp","href":"https://wa.me/971557033165","icon":"ri-whatsapp-line"}
    ],
    "copyright": "© 2026 Paws and Claws Pets Grooming Salon LLC. All rights reserved."
  }$j$::jsonb)
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Administrator account
--   email:    pawsandclawsauh@gmail.com
--   password: pawsandclaws123@123
-- Re-running this file resets the password back to the value above.
-- ---------------------------------------------------------------------------
select public.install_admin('pawsandclawsauh@gmail.com', 'pawsandclaws123@123');
