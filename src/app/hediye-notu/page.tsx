import HediyeNotuClient from "./HediyeNotuClient";

export const metadata = {
  title: "Özel Hediye Notu | NeAlsam Hediye",
  description: "NeAlsam Hediye ile oluşturulmuş özel hediye notu.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HediyeNotuPage() {
  return <HediyeNotuClient />;
}
