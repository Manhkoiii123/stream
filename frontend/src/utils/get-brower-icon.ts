import { CircleHelp } from "lucide-react";
import {
  FaChrome,
  FaEdge,
  FaFirefox,
  FaOpera,
  FaSafari,
  FaYandexInternational,
} from "react-icons/fa6";

export function getBrowserIcon(browser: string) {
  switch (browser.toLowerCase()) {
    case "chrome":
      return FaChrome;

    case "firefox":
      return FaFirefox;

    case "safari":
      return FaSafari;

    case "edge":
    case "microsoft edge":
      return FaEdge;

    case "opera":
      return FaOpera;

    case "yandex":
    case "yandex browser":
      return FaYandexInternational;

    default:
      return CircleHelp;
  }
}
