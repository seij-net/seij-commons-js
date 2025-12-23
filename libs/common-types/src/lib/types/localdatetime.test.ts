import {
  addYears,
  age,
  createLocalDate,
  createLocalDateNow,
  createLocalDateNowWithBuilder,
  dateNaissance,
  diffNombreDeMoisComplets,
  formatFull,
  formatLocalDate,
  formatLocalDateTime,
  formatMonthIsoLong,
  formatMonthIsoShort,
  isLocalDateMax,
  isLocalDateMin,
  isNilLocalDate,
  setDay,
  setMonthIso,
  setYear,
  toLocalDate,
  toLocalDateSafe,
  toMonthIso,
  toMonthJs,
} from "./localdatetime";

test("formatLocalDate", () => {
  expect(formatLocalDate("2020-03-20")).toEqual("20/03/2020");
});
test("formatFull", () => {
  expect(formatFull("2020-03-20T18:30:00")).toEqual("20 mars 2020 18:30");
});

test("formatLocalDateTime", () => {
  expect(formatLocalDateTime("2024-02-07T08:45:38.845711")).toEqual("07/02/2024 08:45");
  expect(formatLocalDateTime("2024-02-07T07:45:38.823973Z")).toEqual("07/02/2024 08:45");
});

test("toLocalDate", () => {
  // 2 = Mars
  expect(toLocalDate(new Date(2020, 2, 15, 0, 0, 0))).toEqual("2020-03-15");
});
test("createLocalDate", () => {
  expect(createLocalDate(2020, 3, 4)).toEqual("2020-03-04");
  expect(createLocalDate(2020, 12, 31)).toEqual("2020-12-31");
});
test("toLocalDateSafe", () => {
  // 2 = Mars
  expect(toLocalDateSafe(new Date(2020, 2, 15, 0, 0, 0))).toEqual("2020-03-15");
});

test("toMonthJs", () => {
  expect(toMonthJs("2020-03-05")).toEqual(2);
});
test("toMonthIso", () => {
  expect(toMonthIso("2020-03-05")).toEqual(3);
});
test("setYear", () => {
  expect(setYear("2022-03-06", 2023)).toBe("2023-03-06");
});
test("addYears", () => {
  expect(addYears("2022-03-06", 10)).toBe("2032-03-06");
});
test("setDay", () => {
  expect(setDay("2022-03-06", 1)).toBe("2022-03-01");
});
test("setMonthIso", () => {
  expect(setMonthIso("2022-03-06", 4)).toBe("2022-04-06");
});

test("age", () => {
  expect(age("1970-03-01", "2020-02-29")).toBe(49);
  expect(age("1970-03-01", "2020-03-02")).toBe(50);
  expect(age("1976-03-25", "2023-03-25")).toBe(47);
  expect(age("1976-03-25", "2023-03-26")).toBe(47);
  expect(age("1976-03-25", "2024-01-01")).toBe(47);
  expect(age("1976-03-25", "2024-03-24")).toBe(47);
  expect(age("1976-03-25", "2024-03-25")).toBe(48);
  expect(age("1976-03-25", "2024-03-26")).toBe(48);
});
test("formatMonthIsoShort", () => {
  expect(formatMonthIsoShort(1)).toBe("janv.");
});
test("formatMonthIsoLong", () => {
  expect(formatMonthIsoLong(1)).toBe("Janvier");
});

test("diffNombreDeMoisComplets", () => {
  expect(diffNombreDeMoisComplets("2020-03-25", "2020-12-15")).toBe(10);
  expect(diffNombreDeMoisComplets("2020-12-15", "2020-03-25")).toBe(10);
  expect(diffNombreDeMoisComplets("2020-02-26", "2020-03-02")).toBe(2);
  expect(diffNombreDeMoisComplets("2020-01-15", "2020-01-20")).toBe(1);
});

test("date de naissance à partir de l'age", () => {
  expect(dateNaissance(47, "2023-11-12")).toBe("1976-11-12");
});
test("create localdatenow", () => {
  const expected = new Date().toISOString().substring(0, 10);
  expect(createLocalDateNow()).toBe(expected);
});

test("createLocalDateNewWidthBuilder", () => {
  const expected = "" + (new Date().getFullYear() - 1) + "-01-01";
  const actual = createLocalDateNowWithBuilder((x) => x.minus({ year: 1 }).set({ month: 1, day: 1 }));
  expect(actual).toBe(expected);
});
test("isNilLocalDate", () => {
  expect(isNilLocalDate(null)).toBe(true);
  expect(isNilLocalDate(undefined)).toBe(true);
  expect(isNilLocalDate("")).toBe(true);
  expect(isNilLocalDate("2023-01-01")).toBe(false);
});
test("isLocalDateMin", () => {
  expect(isLocalDateMin("-999999999-01-01")).toBe(true);
  expect(isLocalDateMin("2024-01-01")).toBe(false);
  expect(isLocalDateMin("+999999999-12-31")).toBe(false);
});
test("isLocalDateMax", () => {
  expect(isLocalDateMax("-999999999-01-01")).toBe(false);
  expect(isLocalDateMax("2024-01-01")).toBe(false);
  expect(isLocalDateMax("+999999999-12-31")).toBe(true);
});
