import type { Gift } from "@/types/gift";
import { premiumConcepts } from "@/data/premiumConcepts";

type ConceptMatch = {
  id: string;
  title: string;
  badge: string;
  description: string;
  reason: string;
  cta: string;
};

function normalize(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c");
}

function answerText(answers: Record<number, string | string[]>) {
  return normalize(
    Object.values(answers)
      .flat()
      .filter(Boolean)
      .join(" ")
  );
}

function giftText(gift: Partial<Gift>) {
  return normalize(
    [
      gift.title,
      gift.category,
      gift.subCategory,
      gift.reason,
      gift.note,
      gift.searchQuery,
      gift.recipients?.join(" "),
      gift.interests?.join(" "),
      gift.styles?.join(" "),
      gift.occasions?.join(" "),
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function findConcept(id: string) {
  return premiumConcepts.find((concept) => concept.id === id) || premiumConcepts[0];
}

export function getPremiumConceptMatch(
  gift: Partial<Gift>,
  answers: Record<number, string | string[]>
): ConceptMatch {
  const aText = answerText(answers);
  const gText = giftText(gift);
  const combined = `${aText} ${gText}`;

  if (
    combined.includes("oyun") ||
    combined.includes("komik") ||
    combined.includes("arkadas") ||
    combined.includes("kardes") ||
    combined.includes("dogum gunu") ||
    combined.includes("mezuniyet")
  ) {
    const concept = findConcept("hediye-avi");

    return {
      id: concept.id,
      title: concept.title,
      badge: concept.badge,
      description: concept.description,
      reason:
        "Seçimlerinde eğlenceli, arkadaşça veya sürprizli bir hava olduğu için hediye avı bu hediyeyi daha akılda kalıcı yapar.",
      cta: "Hediye Avı Oluştur",
    };
  }

  if (
    combined.includes("sevgili") ||
    combined.includes("romantik") ||
    combined.includes("yil donumu") ||
    combined.includes("duygusal")
  ) {
    const concept = findConcept("kader-bagi");

    return {
      id: concept.id,
      title: concept.title,
      badge: concept.badge,
      description: concept.description,
      reason:
        "Romantik veya duygusal bir bağ öne çıktığı için Kader Bağı konsepti hediyeyi daha özel hissettirir.",
      cta: "Kader Bağı Hazırla",
    };
  }

  if (
    combined.includes("anne") ||
    combined.includes("baba") ||
    combined.includes("aile") ||
    combined.includes("mezuniyet") ||
    combined.includes("ani")
  ) {
    const concept = findConcept("ani-kutusu");

    return {
      id: concept.id,
      title: concept.title,
      badge: concept.badge,
      description: concept.description,
      reason:
        "Aile, anı veya özel dönem hissi olduğu için Anı Kutusu bu hediyeye daha kişisel bir anlam katar.",
      cta: "Anı Kutusu Hazırla",
    };
  }

  if (
    combined.includes("qr") ||
    combined.includes("not") ||
    combined.includes("mesaj") ||
    combined.includes("uzak") ||
    combined.includes("minimal")
  ) {
    const concept = findConcept("gizli-mesaj");

    return {
      id: concept.id,
      title: concept.title,
      badge: concept.badge,
      description: concept.description,
      reason:
        "Daha sade ama kişisel bir dokunuş gerektiği için QR ile açılan gizli mesaj bu hediye için uygun olur.",
      cta: "Gizli Mesaj Hazırla",
    };
  }

  const concept = findConcept("karakterine-gore");

  return {
    id: concept.id,
    title: concept.title,
    badge: concept.badge,
    description: concept.description,
    reason:
      "Seçimlerinde belirgin tek bir tema yok; bu yüzden kişinin tarzına göre hazırlanmış kişisel bir sunum daha güvenli olur.",
    cta: "Kişisel Konsept Hazırla",
  };
}
