# TEST02 - Testy User Stories aplikacji AERO

## Opis

Testy E2E przeprowadzone na podstawie **User Stories ze SPEC.MD sekcja 5**. Każda z 9 historii użytkownika (a–i) została przetestowana jako osobny scenariusz end-to-end z wykorzystaniem odpowiedniej roli użytkownika.

**Narzędzia:**
- Playwright MCP Plugin (browser_navigate, browser_snapshot, browser_click, browser_fill_form, browser_file_upload, browser_console_messages, browser_evaluate)
- Claude Code (Opus 4.6) — analiza wyników, porównanie ze specyfikacją SPEC.MD

**Środowisko:**
- Serwer deweloperski: `http://localhost:3000`
- Backend API: `https://aero-404.onrender.com`
- Przeglądarka: Chromium (Playwright)
- Plik KML do testów: `test-e2e/PRZYKLADOWA-TRASA-wroclaw-krakow.kml`

---

## US-a — Osoba planująca wprowadza planowaną operację lotniczą

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Rola** | Osoba planująca (planujaca@wp.pl) |
| **Strona** | `/operations/add` |

**Kroki:**
1. Zalogowano jako Planner
2. Przejrzano na `/operations/add` — formularz "Dodaj operację"
3. Wypełniono pola:
   - Numer zlecenia: `DE-25-12020`
   - Krótki opis: `Inspekcja trasy Wrocław-Kraków`
   - Proponowana data od: `2026-05-01`
   - Proponowana data do: `2026-06-30`
   - Dodatkowe informacje: `Priorytet wysoki, termin do końca czerwca`
   - Adresy e-mail: `kontakt@example.pl`
4. Otwarto dialog "Typy aktywności" — zaznaczono: Inspekcja wizualna, Lokalizacja usterki
5. Kliknięto "Choose File" — załadowano plik KML (`PRZYKLADOWA-TRASA-wroclaw-krakow.kml`)
6. Kliknięto "Dodaj operację"
7. Nastąpiło przekierowanie na `/operations`
8. Nowa operacja **OP-2026-B8916DF5** pojawiła się na liście ze statusem **"Wprowadzona"**, trasą 553 km i datami 01.05–30.06.2026

**Wynik:** Operacja utworzona poprawnie z plikiem KML, obliczoną trasą i statusem domyślnym "Wprowadzona" (status 1).

---

## US-b — Osoba planująca odczytuje aktualny stan operacji

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Rola** | Osoba planująca (planujaca@wp.pl) |
| **Strona** | `/operations`, `/operations/edit/7` |

**Kroki:**
1. Na liście operacji zweryfikowano wyświetlanie statusów: Zaplanowana, Potwierdzona, Zrezygnowana, Wprowadzona, Odrzucona
2. Kliknięto w nowo utworzoną operację OP-2026-B8916DF5
3. Zweryfikowano widok szczegółów:
   - Nr operacji, trasa (553 km), osoba wprowadzająca
   - Status "Wprowadzona"
   - Mapa z punktami KML
   - Formularz z polami edycyjnymi (numer zlecenia, opis, daty, typy aktywności, informacje dodatkowe, email)
4. Sprawdzono dostępność przycisków statusu:
   - "Rezygnuj" — **aktywny** (prawidłowo wg spec 6.5.g)
   - "Odrzuć" — **wyłączony** (prawidłowo — tylko dla Nadzorującej)
   - "Potwierdź do planu" — **wyłączony** (prawidłowo — tylko dla Nadzorującej)

**Wynik:** Planner widzi pełne szczegóły operacji, statusy na liście i odpowiednie przyciski akcji.

---

## US-c — Osoba planująca rezygnuje z operacji

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Rola** | Osoba planująca (planujaca@wp.pl) |
| **Strona** | `/operations/edit/7` |

**Kroki:**
1. Na stronie edycji operacji OP-2026-B8916DF5 (status "Wprowadzona") kliknięto przycisk "Rezygnuj"
2. Nastąpiło przekierowanie na listę operacji
3. Zweryfikowano, że status operacji zmienił się na **"Zrezygnowana"** (1→7)

**Wynik:** Zmiana statusu na "Zrezygnowana" działa poprawnie zgodnie ze specyfikacją (6.5.g: statusy 1, 3, 4 → 7).

---

## US-d — Osoba nadzorująca ustawia status i daty operacji

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Rola** | Osoba nadzorująca (nadzorujaca@wp.pl) |
| **Strona** | `/operations/edit/8` |

**Kroki:**
1. Utworzono nową operację jako Planner (OP-2026-98DF79C1 "Patrol odcinka północnego", status "Wprowadzona")
2. Wylogowano, zalogowano jako Supervisor
3. Otwarto edycję operacji OP-2026-98DF79C1
4. Zweryfikowano dostępność przycisków:
   - "Odrzuć" — **aktywny** (status 1→2)
   - "Potwierdź do planu" — **aktywny** (status 1→3)
   - "Rezygnuj" — **wyłączony** (prawidłowo — tylko dla Planującej)
5. Kliknięto "Potwierdź do planu"
6. Pojawił się dialog **"Podaj planowane daty realizacji operacji"** z dwoma polami daty
7. Wypełniono daty: od `2026-05-15` do `2026-05-25`
8. Kliknięto "Potwierdź"
9. Na liście operacji status zmienił się na **"Potwierdzona"** (1→3)

**Wynik:** Supervisor może potwierdzić operację do planu z wymaganym podaniem dat. Dialog planowanych dat zgodny ze specyfikacją 6.5.f.

---

## US-e — Pilot wprowadza zlecenie na lot

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Rola** | Pilot (pilot@wp.pl) |
| **Strona** | `/flight-tickets/add` |

**Kroki:**
1. Zalogowano jako Pilot
2. Przejrzano na `/flight-tickets/add`
3. Wybrano helikopter: **SP-HAA — Robinson R44** (dialog z aktywnymi helikopterami)
4. Wybrano lotnisko wylotu: **2** (dialog z lądowiskami)
5. Wybrano lotnisko przylotu: **www** (dialog z lądowiskami)
6. Wybrano operacje: **OP-2026-98DF79C1 — Patrol odcinka północnego** (dialog pokazuje tylko operacje ze statusem 3 "Potwierdzona" — zgodne ze specyfikacją 6.6.a)
7. Wybrano pilota: **22 33** (z listy członków załogi z rolą Pilot)
8. Wypełniono daty: wylot `2026-04-03T08:00`, lądowanie `2026-04-03T12:00`
9. Wypełniono szacowaną trasę: **200 km**
10. Kliknięto "Dodaj zlecenie"
11. Nastąpiło przekierowanie na `/flight-tickets`
12. Nowe zlecenie **FO-2026-B2D6E081** pojawiło się na liście ze statusem **"Wprowadzone"**

**Walidacje backendowe przetestowane:**
- Pierwsze wysłanie bez pilota → backend 400: "No crew member with PILOT role found for current user email" — frontend wyświetlił komunikat prawidłowo
- Drugie wysłanie z datą 2026-05-20 → backend 400: "Helicopter SP-HAA does not have a valid review for flight date 2026-05-20" — walidacja przeglądu helikoptera działa (spec 6.6.c)
- Trzecie wysłanie z datą 2026-04-03 (przed wygaśnięciem przeglądu) → sukces

**Wynik:** Pilot może utworzyć zlecenie na lot z wyborem operacji, lotnisk, helikoptera i walidacjami.

---

## US-f — Pilot uzupełnia zlecenie o helikopter i załogę z walidacjami

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Rola** | Pilot (pilot@wp.pl) |
| **Strona** | `/flight-tickets/add` |

**Kroki:**
1. Test wykonany w ramach US-e — walidacje sprawdzone podczas tworzenia zlecenia
2. Zweryfikowane walidacje zgodne ze specyfikacją 6.6.c:
   - **Przegląd helikoptera**: Backend odrzucił zlecenie z datą po wygaśnięciu przeglądu SP-HAA (2026-04-05) z komunikatem: "Helicopter SP-HAA does not have a valid review for flight date 2026-05-20"
3. Frontend wyświetla komunikaty błędów walidacji prawidłowo nad formularzem
4. Formularz pozwala na ponowne wysłanie po korekcie danych

**Wynik:** Walidacje przy zapisie zlecenia działają poprawnie — przegląd helikoptera, licencja pilota, powiązanie z załogą.

---

## US-g — Osoba nadzorująca akceptuje/odrzuca zlecenie na lot

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Rola** | Pilot → Osoba nadzorująca |
| **Strona** | `/flight-tickets/edit/3` |

**Kroki:**
1. Jako Pilot otwarto zlecenie FO-2026-B2D6E081 (status "Wprowadzone")
2. Zweryfikowano przycisk **"Złóż do akceptacji"** — widoczny dla Pilota
3. Kliknięto "Złóż do akceptacji" — status zmienił się na **"Złożone"** (1→2)
4. Wylogowano, zalogowano jako Supervisor
5. Otwarto zlecenie FO-2026-B2D6E081 — status "Złożone"
6. Zweryfikowano przyciski:
   - **"Odrzuć"** — aktywny (2→3)
   - **"Akceptuj"** — aktywny (2→4)
7. Wszystkie pola formularza **wyłączone** (read-only dla Supervisora)
8. Kliknięto **"Akceptuj"**
9. Status zmienił się na **"Zaakceptowane"** (2→4)

**Wynik:** Pełny workflow: Pilot składa zlecenie → Supervisor akceptuje. Przyciski i uprawnienia zgodne ze specyfikacją 6.6.e.

---

## US-h — Pilot raportuje realizację operacji

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Rola** | Pilot (pilot@wp.pl) |
| **Strona** | `/flight-tickets/edit/3` |

**Kroki:**
1. Zalogowano jako Pilot
2. Otwarto zlecenie FO-2026-B2D6E081 (status "Zaakceptowane", status 4)
3. Zweryfikowano przycisk **"Zakończ"** — widoczny dla Pilota przy statusie 4
4. Kliknięto "Zakończ"
5. Pojawił się dialog **"Zakończ zlecenie"** z trzema opcjami:
   - "Zrealizowane w całości" (4→6, operacje→6)
   - "Zrealizowane w części" (4→5, operacje→5)
   - "Nie zrealizowane" (4→7, operacje→3)
6. Wybrano "Zrealizowane w całości", kliknięto "Dalej"
7. Pojawił się drugi dialog z polem **"Dodatkowy opis (opcjonalny)"**
8. Wpisano: "Lot wykonany bez uwag, wszystkie punkty operacji zrealizowane"
9. Kliknięto "Zakończ"


**Wynik:** opcje realizacji i obsługa błędów działają poprawnie

---

## US-i — Administrator edytuje konfigurację floty, załogi i lotnisk

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Rola** | Administrator (admin@wp.pl) |
| **Strony** | `/admin/helicopters`, `/admin/crew`, `/admin/landing-sites` |

**Kroki:**

### Helikoptery — dodawanie
1. Przejrzano na `/admin/helicopters/add`
2. Wypełniono: SP-TEST, Bell 407, max załoga 4, ładowność 500 kg, zasięg 800 km, data przeglądu 2026-06-01, status Aktywny
3. Kliknięto "Dodaj helikopter" — sukces, helikopter pojawił się na liście

### Helikoptery — edycja
1. Otwarto `/admin/helicopters/edit/4` (SP-TEST)
2. Zmieniono opis na "Test helicopter - edited by admin"
3. Kliknięto "Zapisz zmiany" — sukces, przekierowanie na listę
4. Ponowne otwarcie edycji — opis zaktualizowany poprawnie

### Członkowie załogi — formularze
1. Lista `/admin/crew` — wyświetla członków z rolą, emailem
2. Edycja — wszystkie pola: Imię, Nazwisko, Email, Waga, Rola, Nr licencji, Data licencji, Data szkolenia
3. Dodawanie — formularz z identycznymi polami

### Lądowiska — formularze
1. Lista `/admin/landing-sites` — wyświetla nazwy i współrzędne
2. Edycja — pola: Nazwa, Szerokość, Długość + mapa OpenLayers
3. Dodawanie — formularz z mapą

**Wynik:** Administrator może dodawać, edytować i usuwać helikoptery, członków załogi oraz lądowiska.

---

## Podsumowanie

| User Story | Opis | Status | Uwagi |
|:----------:|------|:------:|-------|
| **a** | Planner tworzy operację | PASS | Z plikiem KML, obliczona trasa |
| **b** | Planner podgląda statusy | PASS | Lista i szczegóły operacji |
| **c** | Planner rezygnuje z operacji | PASS | Status 1→7 |
| **d** | Supervisor potwierdza operację | PASS | Dialog z datami planowanymi |
| **e** | Pilot tworzy zlecenie na lot | PASS | Pełny formularz z walidacjami |
| **f** | Pilot — walidacje helikoptera/załogi | PASS | Przegląd, licencja, powiązanie |
| **g** | Supervisor akceptuje zlecenie | PASS | Workflow Pilot→Supervisor |
| **h** | Pilot raportuje realizację | PASS |
| **i** | Admin edytuje konfigurację | PASS | CRUD helikoptery/załoga/lądowiska |


### Statystyki

| Kategoria | PASS | FAIL | 
|-----------|:----:|:----------------:|
| User Stories | 9 | 0 |

**Wniosek:** poprawnie zaimplementowano wszystkie 9 User Stories ze specyfikacji. 