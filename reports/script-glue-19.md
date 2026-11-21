# script-glue-19 - the 2 wow + 17 addon corrupted mixed-script instances (owner order, 21 Nov task 3)

LIST ONLY - nothing in the addon is touched. The 2 wow rows are the quest-6041
page-shard rows fixed by this PR (tools/apply_quest_fa.py + the CI guard).

EN sources: the quest-hunt keep rows (cmangos/azerothcore) where a desc/details
row exists; otherwise the EN title the addon ships (Quests.lua).

## wow side (2) - fixed by this PR

| file | quest id | field | full Persian (pre-fix) | marker | full English |
|---|---|---|---|---|---|
| data/forever/fa/eastern-plaguelands/fa.json | 6041 | /q/6041/d[1] | بعد از کاشتن بمب از بنا دور شو و از دستاورdet لذت ببر. | `رdet` | EN desc not in the committed sources; EN title: When Smokey Sings, I Get Violent |
| data/forever/fa-final/zones/eastern-plaguelands.json | 6041 | /quests/6041/d[1] | بعد از کاشتن بمب از بنا دور شو و از دستاورdet لذت ببر. | `رdet` | EN desc not in the committed sources; EN title: When Smokey Sings, I Get Violent |

## addon side (17, in the WoWFQ quest packs) - LISTED, NOT TOUCHED

| file | line | quest id | field | full Persian | marker | full English |
|---|---|---|---|---|---|---|
| addon/WoWFQ_CoiledIsle/Data.lua | 45 | 93454 | d | Malacrass پدربزرگم را در رساندن Amani‌ها به نابودی یاری کرد. حالا می‌خواهد همین کار را با برادرم بکند. اگر می‌شد این دو را از هم جدا کرد...\nاما Jan حرف نمی‌زند.\nفکر می‌کند Ula'tek سلاحی است که امپراتوری Amani را برمی‌گرداند. بعد از آن رؤیایی که دید و خدا می‌داند Malacrass چه‌ها به او گفت، نمی‌توانم فکرش را عوض کنم.\nhash'ey مشورت می‌خواهد، hash'urای من. بقیه را جمع کن و به من بپیوند. | `urا` | EN not found |
| addon/WoWFQ_CoiledIsle/Data.lua | 136 | 96113 | d | بیشتر از هر کس دیگر، Inktail همان tortollanای است که هرگز خودم با او طرف نمی‌شدم. پارانویایش برای برنامه‌های دقیقش بیشتر از عمر من کار کرده. | `tortollanا` | EN not found |
| addon/WoWFQ_Eversong/Data.lua | 106 | 89204 | d | Aradis wardbreakerش را به تو داده؟ چه آدم احمقی. این‌ها را در بازار سیاه مثل کلیدهای استادانه می‌فروشند. گران هم هستند، اما باید با جادویی که می‌خواهی بشکنی هماهنگشان کنی، و آن کار راحتی نیست.\nبه نظر می‌رسد مال تو خالی است. این را می‌شود حل کرد. اگر چند وسیله جادویی گران‌بها از اطراف شهر بدزدیم، رفیقم آن بالا می‌تواند از قدرتشان بگیرد و wardbreaker را با جادوی fel پر کند.\nآن موقع Aradis دیگر جایی برای قایم شدن ندارد. | `wardbreakerش` | EN not found |
| addon/WoWFQ_Eversong/Data.lua | 172 | 91388 | d | پatron ما--یعنی Gaari به هر روی--باید خوش‌شانس باشد. این mana wyrmها خوش‌سلیقه‌ترین ابریشم Eversong را می‌بافند. Magisterهایی می‌شناسم که برای لباس روبانی از این حرف‌ها هر کاری بکنند، و حالا ما داریم از آن برای وصله‌کاری استفاده می‌کنیم. به هر روی.\nوقتی wyrmها سیر از انرژی arcane شدند، می‌توانی ابریشم را از آن‌ها بکشی و در این قرقره‌ها بریزی.\nاگر نمی‌خواهند ابریشم‌شان را بدهند، شاید لازم باشد، اِه... کتکش بزنی. اما قول گرفته‌ام که کاملا اخلاقی است. | `پatron` | EN not found |
| addon/WoWFQ_Eversong/Data.lua | 215 | 91988 | d | نگهبانان Brightwing Estate اژدهاهای جوانی شیطان‌مistrar به نام Cerul دارند که هر وقت چشمشان نباشد فرار می‌کند. دور نمی‌شود، اما بازی‌اش این شده که تعقیب‌شان کند.\nاین خوراکی خوشمزه را ببر و با آن او را به خانه بکشان. | `مistrar` | EN not found |
| addon/WoWFQ_Eversong/Data.lua | 301 | 93501 | d | کارها جالب شده‌اند، <name>. می‌شنوم که در دلوه‌ها هر نوع گنجی پیدا می‌شود.\nیادداشت‌هایم را در این کتاب جمع می‌کنم و میزبانان پرشoor ما حتی بعضی از یادگارهای خودشان را برای معاوضه با یافته‌هایمان بیرون آورده‌اند.\nچرا قبل از راه افتادن نگاهی نمی‌اندازی. بهتر است آماده باشی تا مرده. | `شoor` | EN not found |
| addon/WoWFQ_QuelDanas/Data.lua | 26 | 96443 | d | 1 Primessence of Magic از ارباب نهایی هر دانژان یا دلوه، از Illustrious Contender's Strongbox یا از رaid ی Sporefall جمع کن. | `رaid` | EN not found |
| addon/WoWFQ_Shared/Data.lua | 167 | 96442 | d | چه لکه‌های void داشته باشد چه گره خورده با رشته‌های بیگانهٔ ارکان، انرژی leyای که آوردی قرائت دقیق‌تری به ما می‌دهد.\nدر حالت ایده‌آل می‌توانیم نوع اثر این جادوها روی خطوط ley‌مان را معین کنیم تا بفهمیم برای Dawnwell چه معنایی دارد.\nبعداً به ما سر بزن. این‌جا کار هست و رون‌های تازه برای بررسی. | `leyا` | EN not found |
| addon/WoWFQ_Voidstorm/Data.lua | 97 | 91149 | d | می‌دانستیم پیر با هم نمی‌شویم، اما فکر می‌کردم وقت بیشتری داریم.\n\n<Anais coughs, blood pooling beneath her. Flecks of the Void shimmer in the spreading crimson.>\n\nنگران نباش. نمی‌ترسم. به خودم قول داده بودم بدون او به خانه برنگردم... یک شب در تخت خالی نخوابم. فقط دارم به همان قول عمل می‌کنم.\n\nنگذار او را داشته باشد. Tinder boxاش را بردار. می‌دانی چه باید بکنی. | `boxا` | EN not found |
| addon/WoWFQ_Voidstorm/Data.lua | 101 | 91341 | d | حالا، پایین می‌رویم. انرژی Void آن پایین شبیه هیچ چیز دیگری نیست؛ انگار خود جاذبه هم در برابر Void تسلیم می‌شود. وقتی وارد غار شوی، نفوذش بر تو مستولی می‌شود. Kalgorg از قبل جانداران درون را کشته و از قدرت‌شان گرایده است. مرگ‌های خشن‌شان نوعی زمین نفرین‌شده به جا گذاشته، اما باید جلو برویم و قدرت درون را تصاحب کنیم. reliquary را تا لبه پر کن. نمی‌دانم از voidwalkerم چه انتظاری داشته باشم. به تمام قدرتی که بتوانیم جمع کنیم نیاز داریم. | `voidwalkerم` | EN not found |
| addon/WoWFQ_Voidstorm/Data.lua | 134 | 91606 | d | حیف شد یک هیولای عظیم. تصور کن اگر جنون نمی‌گرفتش چقدر زیرک بود! همراه خوبی برای کلکسیونم می‌شد.\n\nاین shadowgrafting باید تمام شود. شک دارم این domanaar خودش این کارها را بکند. حتماً graftکننده‌ای همین نزدیکی‌هاست.\n\nوقتی من و Ziadan مشغول تضعیف این هیولاییم، پیدا کن graftکننده را بکش. بعد دیگر این هیولاهای shadowgraftشده هرگز به دنیای گران‌بهای تو راه نمی‌یابند.\n\nلااقل با این کار، بالاخره دشمنمان را بیرون می‌کشیم. | `graftک` | EN not found |
| addon/WoWFQ_Voidstorm/Data.lua | 134 | 91606 | d | حیف شد یک هیولای عظیم. تصور کن اگر جنون نمی‌گرفتش چقدر زیرک بود! همراه خوبی برای کلکسیونم می‌شد.\n\nاین shadowgrafting باید تمام شود. شک دارم این domanaar خودش این کارها را بکند. حتماً graftکننده‌ای همین نزدیکی‌هاست.\n\nوقتی من و Ziadan مشغول تضعیف این هیولاییم، پیدا کن graftکننده را بکش. بعد دیگر این هیولاهای shadowgraftشده هرگز به دنیای گران‌بهای تو راه نمی‌یابند.\n\nلااقل با این کار، بالاخره دشمنمان را بیرون می‌کشیم. | `graftک` | EN not found |
| addon/WoWFQ_Voidstorm/Data.lua | 134 | 91606 | d | حیف شد یک هیولای عظیم. تصور کن اگر جنون نمی‌گرفتش چقدر زیرک بود! همراه خوبی برای کلکسیونم می‌شد.\n\nاین shadowgrafting باید تمام شود. شک دارم این domanaar خودش این کارها را بکند. حتماً graftکننده‌ای همین نزدیکی‌هاست.\n\nوقتی من و Ziadan مشغول تضعیف این هیولاییم، پیدا کن graftکننده را بکش. بعد دیگر این هیولاهای shadowgraftشده هرگز به دنیای گران‌بهای تو راه نمی‌یابند.\n\nلااقل با این کار، بالاخره دشمنمان را بیرون می‌کشیم. | `shadowgraftش` | EN not found |
| addon/WoWFQ_Voidstorm/Data.lua | 134 | 91606 | d | graftکننده مرده است؟ | `graftک` | EN not found |
| addon/WoWFQ_Zulaman/Data.lua | 49 | 87317 | d | این چه مسخرگی‌ای است؟ گویندهٔ loا می‌تواند برود جلو؟\nهمه‌اش تقصیر او بود! | `loا` | EN not found |
| addon/WoWFQ_Zulaman/Data.lua | 149 | 92531 | d | چه قصهٔ روحی!\nدلم می‌خواهد باز هم با Sij'ta حرف بزنم، و این که Kulzi گویندهٔ loaاش را از دست داده مرا اندوهگین می‌کند، اما خوشحالم که Sij'ta سرانجام به آرامش رسید.\nمی‌روم با Kulzi صحبت کنم. امیدوارم دلخوری در کار نباشد. | `loaا` | EN not found |
| addon/WoWFQ_Zulaman/Data.lua | 155 | 92920 | d | کمی زمان می‌برد تا Akil'zon را بخوانم و راه را باز کنم. و این‌جاست که تو به کار می‌آیی.\nمحافظتم کن، hash'urای من.\nجانم را به تو می‌سپارم. قبلاً هم جهش‌های بزرگی زده‌ایم، نه؟ | `urا` | EN not found |

The addon rows are Brain review material: re-split the word, mark the full word,
or leave - per glue-cases-108 policy. Z changes nothing here.

