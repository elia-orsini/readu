import DNumber from "./DNumber";
import DString from "./DString";

export default interface Chapter {
  id: DString;
  href: DString;
  title: DString;
  date: DString;
  content: DString;
  estimatedMinutes: DNumber;
}
