export type EditorialPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  emoji: string;
  readingMinutes: number;
  sections: { title: string; paragraphs: string[] }[];
  question: string;
};

export const editorialPosts: EditorialPost[] = [
  {
    slug: "bir-kupayi-kisisel-bir-hediyeye-donusturmek",
    title: "Bir kupayı kişisel bir hediyeye dönüştürmek",
    excerpt: "Hediyeyi özel yapan bazen ürünün kendisi değil, neden onu seçtiğini anlatan küçük bir detaydır. Bir kahve molasından yola çıkalım.",
    category: "Küçük sürprizler", emoji: "☕", readingMinutes: 3,
    sections: [
      { title: "Önce bir alışkanlığı fark et", paragraphs: [
        "Bir arkadaşına hediye aradığını düşün. Her sabah kahvesini aynı kupada içiyor, hafta sonları yeni kahveler denemeyi seviyor. Kupa fikri buradan çıkıyorsa sıradan bir eşya olmaktan uzaklaşır: Onun günlük hayatında sevdiği bir şeyi fark etmişsindir.",
        "Başlangıç sorusu ‘En farklı ne alabilirim?’ olmak zorunda değil. ‘Gün içinde neyi severek yapıyor?’ diye sormak çoğu zaman daha işe yarar. Çay demlemek, kitap okumak, çizim yapmak ya da uzun yürüyüşlere çıkmak… Küçük bir alışkanlık sana iyi bir başlangıç verebilir."
      ] },
      { title: "Her şeyi aynı kutuya doldurmak gerekmiyor", paragraphs: [
        "Bir kupa, sevdiğini bildiğin küçük bir kahve ve kısa bir not yeterli olabilir. Kahve tercihini bilmiyorsan paketi büyütmek yerine yalnızca kupayla da ilerleyebilirsin. Sırf kutu dolsun diye alınan parçalar yerine, gerçekten kullanacağı iki şey seçmek daha düşünülmüş hissettirir.",
        "Boyutunu, tutuşunu ve temizleme kolaylığını da düşün. Büyük kupaları seven birine küçük bir fincan almak, görünüşü güzel olsa bile alışkanlığına uymayabilir. Kişisellik her zaman üzerine isim yazdırmak değildir; kişinin nasıl kullandığını hesaba katmak da kişisel bir seçimdir."
      ] },
      { title: "Notta büyük sözler yerine küçük bir an kullan", paragraphs: [
        "Şöyle bir not düşünebilirsin: ‘Bir sonraki uzun sohbetimizde kahveler bu kupalarda olsun.’ Bu bir örnek; sizin aranızdaki gerçek bir anıya göre değiştirdiğinde çok daha sana ait olur. İçinizde kalan bir kahve buluşması ya da birlikte güldüğünüz bir cümle de başlangıç olabilir.",
        "Yazarken kendine şu soruyu sor: Bu cümleyi başka birine de hiç değiştirmeden gönderebilir miyim? Cevabın evetse küçük bir ortak detay eklemeyi dene. Uzun bir mektup yazmak zorunda değilsin; iki içten cümle de yeter."
      ] },
      { title: "Sunumu son ana bırakma", paragraphs: [
        "Kupayı kırılmayacak şekilde yerleştir, yiyecek ekliyorsan ambalajını ve kişinin tercihlerini kontrol et. Notu da ilk görülecek yere koy. QR not kullanacaksan göndermeden önce kendi telefonundan açıp yazının doğru göründüğünü kontrol et.",
        "Sonra kendi sürecini not al: Neden bu hediyeyi seçtin, hangi detay işine yaradı, bir dahaki sefere neyi değiştirirdin? Böyle bir yazı, hediye arayan başka birine pahalı bir ürün listesinden daha çok yardımcı olabilir."
      ] },
    ],
    question: "Sen günlük bir eşyayı hangi küçük detayla kişisel hâle getirdin? Kendi örneğini anlatmak ister misin?",
  },
  {
    slug: "ilk-hediye-hikayeni-yazmak-icin-bes-kucuk-adim",
    title: "İlk hediye hikâyeni yazmak için beş küçük adım",
    excerpt: "Yazar olman gerekmiyor. Birine hediye seçerken düşündüklerini, işe yarayan bir fikri ya da öğrendiğin bir şeyi anlatman yeterli.",
    category: "Topluluktan bir fikir", emoji: "💌", readingMinutes: 3,
    sections: [
      { title: "1. Tek bir an seç", paragraphs: [
        "Bütün hediye alışverişlerini tek yazıya sığdırmaya çalışma. Bir doğum günü, ilk iş kutlaması veya sebepsiz bir sürpriz seç. ‘Arkadaşıma taşınma hediyesi ararken…’ diye başlamak bile okura nerede olduğunu anlatır.",
        "Hikâyenin çok şaşırtıcı olması gerekmez. Hediyeyi bulamaman, paketlemenin son anda yetişmesi ya da yazacağın nota uzun süre karar verememen de anlatmaya değer. Başka birinin de yaşayabileceği bir durumu paylaşmış olursun."
      ] },
      { title: "2. Seçiminin arkasındaki düşünceyi anlat", paragraphs: [
        "Kime hediye aradığını ve o kişinin nelerden hoşlandığını birkaç cümleyle açıkla. Sonra neden bu fikre yöneldiğini yaz. Yalnızca ‘Kitap aldım’ demek yerine ‘Aynı yazar hakkında konuştuğumuz için kitabını seçtim’ demek, okura kendi seçimi için bir ipucu verir.",
        "Gerçek isim, iş yeri, adres veya özel mesaj ekran görüntüsü paylaşmana gerek yok. ‘Yakın bir arkadaşım’ demen çoğu zaman yeterli. Bir başkasının fotoğrafını ya da ona ait özel bir anıyı kullanacaksan önce iznini al."
      ] },
      { title: "3. İşe yarayan tek bir ayrıntı ekle", paragraphs: [
        "Okurun uygulayabileceği küçük bir şey seç: Notu nasıl yazdın, paketi nasıl hazırladın, neyi özellikle almadın? Bütçeyi anlatmak istersen yaklaşık bir aralık kullanabilir ve alışverişin ne zamana ait olduğunu belirtebilirsin. Geçmişte gördüğün fiyatı bugün de geçerliymiş gibi sunma.",
        "Bir mağaza veya ürün adı yazman şart değil. Bazen en yararlı ayrıntı, hediye almadan önce kişinin zaten aynı ürüne sahip olup olmadığını sormaktır."
      ] },
      { title: "4. Kusursuz görünmeye çalışma", paragraphs: [
        "Hediye beklediğin gibi karşılanmadıysa bunu da incitmeden anlatabilirsin. ‘Rengini daha önce sorsaydım iyi olurmuş’ gibi bir gözlem, başka birinin aynı hatayı yapmasını önleyebilir. Gerçek deneyimin, bir başarı hikâyesi gibi görünmesinden daha değerlidir.",
        "Henüz uygulamadığın bir fikir paylaşıyorsan bunu açıkça söyle. Bir planla yaşanmış bir anıyı ayırmak, okurun yazına güvenmesini kolaylaştırır."
      ] },
      { title: "5. Küçük bir soruyla bitir", paragraphs: [
        "‘Sen olsan yanına ne eklerdin?’ veya ‘Benzer bir durumda ne seçtin?’ gibi bir soruyla sohbet başlatabilirsin. Yazını bir kez sesli oku; konuşurken kullanmadığın kelimeleri sadeleştir. Sonra kısa bir başlık ve iki cümlelik özet ekle.",
        "Hazır olduğunda hesabından taslak olarak kaydedebilir veya incelemeye gönderebilirsin. Gönderilen yazılar doğrudan yayına çıkmaz; onaylandıktan sonra topluluk bölümünde görünür. İlk yazın uzun olmak zorunda değil. Kendi sesinle anlatılmış birkaç paragraf iyi bir başlangıçtır."
      ] },
    ],
    question: "Senin hikâyen hangi cümleyle başlardı? Bir hediye seçerken yaşadığın küçük bir anı bizimle paylaş.",
  },
];

export function getEditorialPost(slug: string) { return editorialPosts.find(post => post.slug === slug); }
