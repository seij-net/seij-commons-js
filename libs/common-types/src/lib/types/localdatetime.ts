import { differenceInCalendarMonths } from "date-fns";
import { format } from "date-fns/format";
import { fr } from "date-fns/locale/fr";
import { parseISO } from "date-fns/parseISO";
import { isEmpty, isNil } from "lodash-es";
import { DateTime } from "luxon";
import { LocalDate } from "./datetime";
import { Int } from "./integers";
import { Month } from "./month";
import { MonthList } from "./monthlist";
import { Year } from "./year";

const FORMAT_FULL_OPTIONS = { locale: fr };
const FORMAT_FULL_PATTERN = "dd MMM yyyy HH:mm";
const FORMAT_LOCALDATE_OPTIONS = { locale: fr };
const FORMAT_LOCALDATE_PATTERN = "dd/MM/yyyy";
const FORMAT_LOCALDATETIME_PATTERN = "dd/MM/yyyy HH:mm";
const FORMAT_LOCALDATETIME_OPTIONS = { locale: fr };

/**
 * Formatte une date et heure en francais avec le mois textuellement affiché
 * sans les secondes
 *
 * par exemple 03 janvier 2020 18:30
 *
 * @param localDateTime la date a afficher
 * @return date formattée
 */
export const formatFull = (localDateTime: string) =>
  format(parseISO(localDateTime), FORMAT_FULL_PATTERN, FORMAT_FULL_OPTIONS);

/**
 * Formatte une date localdate en francais version courte dd/mm/yyyy
 * @param localDate
 */
export const formatLocalDate = (localDate: string): string =>
  format(parseISO(localDate), FORMAT_LOCALDATE_PATTERN, FORMAT_LOCALDATE_OPTIONS);
/**
 * Formatte une date et une heure en francais version courte dd/mm/yyyy hh:mm (sans les secondes)
 * @param locateDateTime une datetime format ISO (en Java, un instant) avec ou sans la timezone.
 */

export const formatLocalDateTime = (locateDateTime: string): string =>
  format(parseISO(locateDateTime), FORMAT_LOCALDATETIME_PATTERN, FORMAT_LOCALDATETIME_OPTIONS);

/**
 * Transforme une date javascript en date ISO (date seule) compatible Json / LocalDate
 * @param date
 */
export const toLocalDate = (date: Date | null) => (date == null ? null : DateTime.fromJSDate(date).toISODate());
/**
 * Crée une LocalDate. Attention aucune vérification n'est faite pour savoir si la date est valide
 * ou pas.
 *
 * @param year année
 * @param month mois ISO (1 = janvier)
 * @param day jour du mois
 */
export const createLocalDate = (year: number, month: number, day: number): LocalDate =>
  "" + year + "-" + ("" + month).padStart(2, "0") + "-" + ("" + day).padStart(2, "0");
/**
 * Crée une date avec la date du jour.
 * La date est celle du système.
 */
export const createLocalDateNow = (): LocalDate => toLocalDateSafe(new Date());

/**
 * Crée une date avec un builder à partir de la date du jour
 */
export function createLocalDateNowWithBuilder(apply: (d: DateTime<true>) => DateTime<true>): LocalDate {
  const curr = DateTime.now();
  const next = apply(curr);
  return next.toISODate();
}

/**
 * Transforme une date javascript en date ISO (date seule) compatible Json / LocalDate
 * @param date qui est obligatoire
 */
export function toLocalDateSafe(date: Date): LocalDate {
  return (DateTime.fromJSDate(date) as DateTime<true>).toISODate();
}

/**
 * Renvoie la date en Date javascript
 * @param localDate
 */
export const toDate = (localDate: LocalDate) => parseISO(localDate);

/**
 * Renvoie l'année
 * @param date
 */
export const toYear = (date: LocalDate) => parseISO(date).getFullYear();
/**
 * Change l'année d'une date
 * @param date date format ISO
 * @param year année à placer
 */
export const setYear = (date: LocalDate, year: Year): LocalDate => {
  const d = parseISO(date);
  d.setFullYear(year);
  return toLocalDateSafe(d);
};
/**
 * Ajoute des années à une date
 * @param date date format ISO
 * @param years années à ajouter
 */
export const addYears = (date: LocalDate, years: Year): LocalDate => {
  const d = parseISO(date);
  d.setFullYear(d.getFullYear() + years);
  return toLocalDateSafe(d);
};

/**
 * Renvoie le mois, attention le mois en Javascript commence toujours à 0 (0=janvier, 11=decembre)
 * @param date
 */
export const toMonthJs = (date: LocalDate) => parseISO(date).getMonth();

/**
 * Renvoie le mois, le mois de Janvier commence à 1
 */
export const toMonthIso = (date: LocalDate) => parseISO(date).getMonth() + 1;

/**
 * change le mois d'une date
 * @param date
 * @param month mois format ISO (1=janvier)
 */
export const setMonthIso = (date: LocalDate, month: Month): LocalDate => {
  const d = parseISO(date);
  d.setMonth(month - 1);
  return toLocalDateSafe(d);
};
/**
 * Change le jour du mois d'une date, attention il n'y a pas de contrôle sur la validité du jour
 * @param date date à changer
 * @param day jour à positionner
 */
export const setDay = (date: LocalDate, day: Int): LocalDate => {
  const d = parseISO(date);
  d.setDate(day);
  return toLocalDateSafe(d);
};

/**
 * Renvoie true si la date n'est ni nulle, ni undefined, ni vide
 * @param date
 */
export const normalizeLocalDateOptional = (date: LocalDate | null | undefined) =>
  isNil(date) ? null : isEmpty(date) ? null : date;

/**
 * Teste si la date est null, undefined ou vide ou n'a pas la bonne taille.
 *
 * La signature fait que les compilateurs comprennent que si cette méthode
 * passe, les erreurs NPE trépassent
 *
 * Donc on peut faire isNilLocalDate(date) et ensuite utiliser date comme not null sans probleme
 *
 * @param date
 */
export const isNilLocalDate = (date: LocalDate | null | undefined): date is null | undefined =>
  isNil(date) ? true : isEmpty(date);

/**
 * Renvoie true si la date correspond à la date minimum ISO possible (correspond à LocalDate.MIN côté back)
 */
export const isLocalDateMin = (date: LocalDate): boolean => date === "-999999999-01-01";

/**
 * Renvoie true si la date correspond à la date maximum ISO possible (correspond à LocalDate.MAX côté back)
 */
export const isLocalDateMax = (date: LocalDate): boolean => date === "+999999999-12-31";

/**
 * Calcul d'un age (par différence d'année entre les dates)
 * @param dateNaissance date de naissance
 * @param dateReference date à laquelle on veut l'age
 */
export const age = (dateNaissance: LocalDate, dateReference: LocalDate): number => {
  return DateTime.fromISO(dateReference).diff(DateTime.fromISO(dateNaissance), ["years", "months", "days"]).years;
};
/**
 * Calcul d'une date de naissance à partir d'un age
 * @param age
 * @param dateReference
 */
export const dateNaissance = (age: number, dateReference: LocalDate): LocalDate => {
  const fromISO = DateTime.fromISO(dateReference);
  if (fromISO.isValid) {
    return (fromISO as DateTime<true>).minus({ years: age }).toISODate();
  }
  throw Error(`Date invalide ` + fromISO.invalidExplanation);
};

/**
 * Nom d'un mois format court
 * @param mois au format ISO (1 = Janvier)
 */
export const formatMonthIsoShort = (mois: Month) => MonthList.find((it) => it.code === mois)?.short ?? "";
/**
 * Nom d'un mois format long
 * @param mois au format ISO (1 = Janvier)
 */
export const formatMonthIsoLong = (mois: Month) => MonthList.find((it) => it.code === mois)?.label ?? "";

export function diffNombreDeMoisComplets(date1: LocalDate, date2: LocalDate): number {
  return Math.abs(differenceInCalendarMonths(toDate(date2), toDate(date1))) + 1;
}
