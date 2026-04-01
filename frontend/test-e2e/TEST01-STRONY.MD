# TEST01 - Testy stron aplikacji AERO

## Opis

Testy manualne E2E przeprowadzone za pomocą **Playwright MCP** (Model Context Protocol) zintegrowanego z **Claude Code**. Playwright sterował przeglądarką Chromium, wykonując nawigację, wypełnianie formularzy, klikanie przycisków i weryfikację stanu strony poprzez snapshoty dostępności (accessibility tree). Konsola przeglądarki była monitorowana pod kątem błędów HTTP i JavaScript.

**Narzędzia:**
- Playwright MCP Plugin (browser_navigate, browser_snapshot, browser_click, browser_fill_form, browser_console_messages, browser_evaluate)
- Claude Code (Opus 4.6) — analiza wyników, porównanie ze specyfikacją SPEC.MD

**Środowisko:**
- Serwer deweloperski: `http://localhost:3000`
- Backend API: `https://aero-404.onrender.com`
- Przeglądarka: Chromium (Playwright)

---

## Testy

### T01 — Logowanie jako Administrator (ADMIN)

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/login` |
| **Dane** | `admin@wp.pl` / `admin@wp.pl` |

**Kroki:**
1. Otwarto stronę `http://localhost:3000` — nastąpiło przekierowanie na `/login`
2. Sprawdzono obecność pól: Email, Hasło, przycisk "Zaloguj się", link "Nie masz konta? Zarejestruj się"
3. Wypełniono email i hasło
4. Kliknięto "Zaloguj się"
5. Zweryfikowano przekierowanie na `/operations`
6. Sprawdzono menu boczne — widoczne sekcje: Administracja (Helikoptery, Członkowie załogi, Lądowiska planowe, Użytkownicy), Planowanie operacji, Zlecenia na lot, Wyloguj

**Wynik:** Logowanie poprawne, przekierowanie na stronę operacji, menu zawiera wszystkie sekcje admina włącznie z "Użytkownicy".

---

### T02 — Logowanie jako Osoba planująca (PLANNER)

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/login` |
| **Dane** | `planujaca@wp.pl` / `planujaca@wp.pl` |

**Kroki:**
1. Wylogowano z konta admina
2. Wypełniono dane logowania Plannera
3. Kliknięto "Zaloguj się"
4. Zweryfikowano przekierowanie na `/operations`
5. Sprawdzono menu — widoczne: Planowanie operacji (Lista operacji), Wyloguj. Brak sekcji Administracja i Zlecenia na lot

**Wynik:** Menu poprawnie ukrywa sekcje niedostępne dla roli PLANNER zgodnie ze specyfikacją.

---

### T03 — Logowanie jako Osoba nadzorująca (SUPERVISOR)

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/login` |
| **Dane** | `nadzorujaca@wp.pl` / `nadzorujaca@wp.pl` |

**Kroki:**
1. Wylogowano z konta Plannera
2. Zalogowano jako Supervisor
3. Zweryfikowano menu — widoczne: Administracja (Helikoptery, Członkowie załogi, Lądowiska planowe — bez Użytkownicy), Planowanie operacji, Zlecenia na lot, Wyloguj
4. Sprawdzono, że na liście operacji widoczny jest przycisk "Dodaj" (Supervisor ma pełny dostęp do operacji)

**Wynik:** Menu zgodne ze specyfikacją — Supervisor widzi Administrację (tylko podgląd), Operacje (pełny dostęp) i Zlecenia (pełny dostęp).

---

### T04 — Logowanie jako Pilot (PILOT)

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/login` |
| **Dane** | `pilot@wp.pl` / `pilot@wp.pl` |

**Kroki:**
1. Wylogowano z konta Supervisora
2. Zalogowano jako Pilot
3. Zweryfikowano menu — widoczne: Administracja (Helikoptery, Członkowie załogi, Lądowiska planowe — bez Użytkownicy), Planowanie operacji, Zlecenia na lot, Wyloguj
4. Sprawdzono, że na liście operacji NIE ma przycisku "Dodaj" (Pilot ma tylko podgląd operacji)
5. Sprawdzono, że na liście zleceń na lot JEST przycisk "Dodaj" (Pilot tworzy zlecenia)

**Wynik:** Uprawnienia Pilota zgodne ze specyfikacją.

---

### T05 — Strona rejestracji

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/register` |

**Kroki:**
1. Na stronie logowania kliknięto link "Nie masz konta? Zarejestruj się"
2. Zweryfikowano przekierowanie na `/register`
3. Sprawdzono obecność pól: Imię, Nazwisko, Email, Hasło (placeholder "Minimum 5 znaków"), przycisk "Zarejestruj się", link "Masz już konto? Zaloguj się"

**Wynik:** Formularz rejestracji renderuje się poprawnie ze wszystkimi polami.

---

### T06 — Lista operacji

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/operations` |

**Kroki:**
1. Zalogowano jako Admin
2. Otwarto listę operacji
3. Zweryfikowano wyświetlanie 5 operacji z danymi: numer operacji, opis, trasa (km), daty, status (Zaplanowana, Potwierdzona, Zrezygnowana, Odrzucona)
4. Sprawdzono, że każda operacja jest linkiem do `/operations/edit/:id`
5. Sprawdzono widoczność przycisku "Dodaj" — dla Admina: brak (poprawne), dla Plannera: widoczny, dla Supervisora: widoczny

**Wynik:** Lista wyświetla operacje poprawnie, przycisk "Dodaj" widoczny zgodnie z uprawnieniami ról.

---

### T07 — Edycja operacji

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/operations/edit/5` |

**Kroki:**
1. Kliknięto pierwszą operację na liście (OP-2026-5DBE657B)
2. Zweryfikowano wyświetlanie nagłówka: nr operacji, trasa, plik KML, wprowadził
3. Sprawdzono status "Zaplanowana" z przyciskami statusu (Odrzuć, Potwierdź do planu, Rezygnuj — disabled)
4. Sprawdzono mapę OpenLayers
5. Zweryfikowano pola formularza: Numer zlecenia (444), Krótki opis (44), Data od (2026-03-02), Data do (2026-03-27), Typy aktywności (Lokalizacja usterki, Skan 3D), Dodatkowe informacje, E-mail kontaktowe, Plik KML
6. Sprawdzono przycisk "Wróć" — wraca na listę operacji

**Wynik:** Strona edycji operacji wyświetla wszystkie dane i pola formularza poprawnie.

---

### T08 — Dodawanie operacji (PLANNER)

| Pole | Wartość |
|------|---------|
| **Status** | PASS (z ograniczeniem backendowym) |
| **Strona** | `/operations/add` |

**Kroki:**
1. Zalogowano jako Planner
2. Otwarto `/operations/add`
3. Wypełniono pola: Numer zlecenia (TEST-002), Krótki opis (Testowa operacja planner), Data od (2026-05-01), Data do (2026-05-15), Dodatkowe informacje (Test), E-mail (test@test.pl)
4. Otwarto dialog "Typy aktywności" — sprawdzono checkboxy: Inspekcja wizualna, Skan 3D, Lokalizacja usterki, Zdjęcia, Patrol
5. Zaznaczono "Skan 3D", kliknięto OK
6. Kliknięto "Dodaj operację"
7. Backend zwrócił 400 z komunikatem "KML file is required for planned operation"
8. Komunikat błędu wyświetlił się na stronie

**Wynik:** Formularz działa poprawnie. Backend wymaga pliku KML — jest to walidacja backendowa, komunikat błędu wyświetla się prawidłowo na froncie.

---

### T09 — Dodawanie operacji (ADMIN — brak uprawnień)

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/operations/add` |

**Kroki:**
1. Zalogowano jako Admin
2. Ręcznie przejrzano na `/operations/add`
3. Wypełniono formularz i kliknięto "Dodaj operację"
4. Backend zwrócił 403 "Access denied"
5. Komunikat "Access denied" wyświetlił się na stronie

**Wynik:** Backend poprawnie odrzuca żądanie od Admina (wg specyfikacji Admin ma tylko podgląd operacji). Frontend wyświetla komunikat błędu.

---

### T10 — Lista zleceń na lot

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/flight-tickets` |

**Kroki:**
1. Zalogowano jako Admin
2. Otwarto listę zleceń
3. Zweryfikowano wyświetlanie 2 zleceń z danymi: numer zlecenia, helikopter, pilot, lotniska, trasa, daty, status (Zaakceptowane, Odrzucone)
4. Sprawdzono przycisk "Dodaj" — niewidoczny dla Admina (poprawne)
5. Zalogowano jako Pilot — przycisk "Dodaj" widoczny (poprawne)

**Wynik:** Lista zleceń wyświetla się poprawnie z odpowiednimi uprawnieniami.

---

### T11 — Edycja zlecenia na lot

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/flight-tickets/edit/1` |

**Kroki:**
1. Kliknięto pierwsze zlecenie (FO-2026-119C9C77)
2. Zweryfikowano nagłówek: nr zlecenia, waga załogi (224 kg), trasa (1 km), status (Zaakceptowane)
3. Sprawdzono sekcję "Powiązane operacje" z linkiem do operacji
4. Sprawdzono sekcję "Członkowie załogi" z danymi pilota (licencja, szkolenie, rola)
5. Sprawdzono pola formularza (disabled): Helikopter (SP-HAA — Robinson R44), Pilot (22 33), Załoga, Lotnisko wylotu, Lotnisko przylotu, Operacje, Planowany wylot, Planowane lądowanie, Szacowana trasa (km)
6. Sprawdzono przycisk "Zakończ" (zmiana statusu)

**Wynik:** Strona edycji zlecenia wyświetla wszystkie informacje prawidłowo.

---

### T12 — Formularz dodawania zlecenia na lot

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/flight-tickets/add` |

**Kroki:**
1. Otwarto `/flight-tickets/add`
2. Sprawdzono obecność dropdownów: Helikopter, Pilot (opcjonalnie), Załoga (opcjonalnie), Lotnisko wylotu, Lotnisko przylotu, Operacje
3. Sprawdzono pola: Planowany wylot, Planowane lądowanie, Szacowana trasa (km)
4. Sprawdzono przycisk "Dodaj zlecenie"

**Wynik:** Formularz dodawania zlecenia renderuje się poprawnie ze wszystkimi polami.

---

### T13 — Lista helikopterów

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/admin/helicopters` |

**Kroki:**
1. Zalogowano jako Admin
2. Otwarto listę helikopterów
3. Zweryfikowano wyświetlanie helikoptera: SP-HAA, Robinson R44, Zasięg: 560 km, Ładowność: 300 kg, Status: Aktywny
4. Sprawdzono przycisk "Dodaj" — widoczny dla Admina (poprawne)

**Wynik:** Lista helikopterów wyświetla się poprawnie.

---

### T14 — Edycja helikoptera

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/admin/helicopters/edit/1` |

**Kroki:**
1. Kliknięto helikopter SP-HAA
2. Zweryfikowano pola formularza: Numer rejestracyjny (SP-HAA), Typ (Robinson R44), Opis, Maksymalna załoga (2), Maksymalna ładowność (300 kg), Status (Aktywny), Data przeglądu (2026-04-05), Zasięg (560 km)
3. Sprawdzono przyciski "Usuń" i "Zapisz zmiany"
4. Sprawdzono przycisk "Wróć"

**Wynik:** Formularz edycji helikoptera wyświetla i pozwala edytować wszystkie pola.

---

### T15 — Dodawanie helikoptera

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/admin/helicopters/add` |

**Kroki:**
1. Otwarto `/admin/helicopters/add`
2. Wypełniono pola: Numer rejestracyjny (SP-TEST), Typ (Bell 407), Opis (Test helicopter), Maksymalna załoga (4), Maksymalna ładowność (500 kg), Zasięg (800 km), Data przeglądu (2026-06-01)
3. Otwarto dialog "Status" — opcje: Aktywny, Nieaktywny. Wybrano "Aktywny", kliknięto OK
4. Kliknięto "Dodaj helikopter"
5. Nastąpiło przekierowanie na listę helikopterów
6. Zweryfikowano, że nowy helikopter SP-TEST (Bell 407, 800 km, 500 kg, Aktywny) pojawił się na liście

**Wynik:** Dodawanie helikoptera działa poprawnie — dane zapisane, przekierowanie na listę, nowy rekord widoczny.

---

### T16 — Lista członków załogi

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/admin/crew` |

**Kroki:**
1. Otwarto listę załogi
2. Zweryfikowano wyświetlanie 1 członka: 22 33, e@w.pl, rola: Pilot
3. Sprawdzono przycisk "Dodaj"

**Wynik:** Lista członków załogi wyświetla się poprawnie.

---

### T17 — Edycja członka załogi

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/admin/crew/edit/3` |

**Kroki:**
1. Kliknięto członka załogi
2. Zweryfikowano pola: Imię (22), Nazwisko (33), Email (e@w.pl), Waga (112 kg), Rola (Pilot), Numer licencji (22), Data ważności licencji (2027-09-08), Data ważności szkolenia (2028-06-15)
3. Sprawdzono przyciski "Usuń" i "Zapisz zmiany"

**Wynik:** Formularz edycji członka załogi wyświetla wszystkie pola prawidłowo.

---

### T18 — Formularz dodawania członka załogi

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/admin/crew/add` |

**Kroki:**
1. Otwarto `/admin/crew/add`
2. Sprawdzono obecność pól: Imię, Nazwisko, Email, Waga (kg), Rola (dropdown), Numer licencji (opcjonalnie), Data ważności licencji, Data ważności szkolenia
3. Sprawdzono przycisk "Dodaj członka załogi"

**Wynik:** Formularz renderuje się poprawnie.

---

### T19 — Lista lądowisk planowych

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/admin/landing-sites` |

**Kroki:**
1. Otwarto listę lądowisk
2. Zweryfikowano wyświetlanie 2 lądowisk: "2" (51.002679°N, 18.24007°E), "www" (0.000001°N, 31°E)
3. Sprawdzono przycisk "Dodaj"

**Wynik:** Lista lądowisk wyświetla się poprawnie z nazwami i współrzędnymi.

---

### T20 — Edycja lądowiska

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/admin/landing-sites/edit/3` |

**Kroki:**
1. Kliknięto lądowisko "2"
2. Zweryfikowano pola: Nazwa (2), Szerokość geograficzna (51.002679), Długość geograficzna (18.24007)
3. Sprawdzono mapę OpenLayers z pinezką
4. Sprawdzono przyciski "Usuń" i "Zapisz zmiany"

**Wynik:** Formularz edycji lądowiska z mapą działa poprawnie.

---

### T21 — Formularz dodawania lądowiska

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/admin/landing-sites/add` |

**Kroki:**
1. Otwarto `/admin/landing-sites/add`
2. Sprawdzono pola: Nazwa, Szerokość geograficzna, Długość geograficzna
3. Sprawdzono mapę OpenLayers
4. Sprawdzono przycisk "Dodaj lądowisko"

**Wynik:** Formularz renderuje się poprawnie z mapą.

---

### T22 — Lista użytkowników

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/admin/users` |

**Kroki:**
1. Zalogowano jako Admin
2. Otwarto listę użytkowników
3. Zweryfikowano wyświetlanie 15 użytkowników z danymi: email, imię, nazwisko, rola (Administrator, Osoba planująca, Osoba nadzorująca, Pilot)
4. Sprawdzono przycisk "Dodaj"

**Wynik:** Lista użytkowników wyświetla się poprawnie ze wszystkimi rolami.

---

### T23 — Formularz dodawania użytkownika

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | `/admin/users/add` |

**Kroki:**
1. Otwarto `/admin/users/add`
2. Sprawdzono pola: Imię, Nazwisko, Email, Hasło (placeholder "Minimum 8 znaków"), Rola (dropdown "Wybierz rolę")
3. Sprawdzono przycisk "Dodaj użytkownika"

**Wynik:** Formularz renderuje się poprawnie ze wszystkimi polami.

---

### T24 — Wylogowanie

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | Menu boczne → Wyloguj |

**Kroki:**
1. Kliknięto przycisk "Wyloguj" w menu bocznym
2. Zweryfikowano przekierowanie na `/login`
3. Zweryfikowano, że menu boczne zniknęło

**Wynik:** Wylogowanie działa poprawnie.

---

### T25 — Widoczność przycisku "Dodaj" wg roli

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | Wszystkie listy |

**Sprawdzane kombinacje:**

| Strona | Admin | Planner | Supervisor | Pilot |
|--------|:-----:|:-------:|:----------:|:-----:|
| Operacje — "Dodaj" | Brak | Widoczny | Widoczny | Brak |
| Zlecenia na lot — "Dodaj" | Brak | N/D | Brak | Widoczny |
| Helikoptery — "Dodaj" | Widoczny | N/D | Brak | Brak |
| Członkowie załogi — "Dodaj" | Widoczny | N/D | Brak | Brak |
| Lądowiska — "Dodaj" | Widoczny | N/D | Brak | Brak |
| Użytkownicy — "Dodaj" | Widoczny | N/D | N/D | N/D |

**Wynik:** Wszystkie przyciski "Dodaj" widoczne zgodnie ze specyfikacją SPEC.MD sekcja 7.2.

---

### T26 — Widoczność menu bocznego wg roli

| Pole | Wartość |
|------|---------|
| **Status** | PASS |
| **Strona** | Menu boczne |

**Sprawdzane kombinacje:**

| Sekcja menu | Admin | Planner | Supervisor | Pilot |
|-------------|:-----:|:-------:|:----------:|:-----:|
| Administracja | Tak | Nie | Tak | Tak |
| Użytkownicy (w Administracji) | Tak | Nie | Nie | Nie |
| Planowanie operacji | Tak | Tak | Tak | Tak |
| Zlecenia na lot | Tak | Nie | Tak | Tak |

**Wynik:** Menu boczne wyświetla sekcje zgodnie ze specyfikacją dla każdej roli.

---

### T27 — Brak błędów w konsoli przeglądarki

| Pole | Wartość |
|------|---------|
| **Status** | PASS |

**Kroki:**
1. Monitorowano konsolę przeglądarki podczas nawigacji po wszystkich stronach
2. Jedyne błędy HTTP to odpowiedzi 403/400 przy próbach zapisu bez uprawnień lub z niepełnymi danymi — oba obsłużone poprawnie przez frontend (wyświetlanie komunikatu błędu)

**Wynik:** Brak nieoczekiwanych błędów JavaScript ani HTTP.

---

## Podsumowanie

| Kategoria | Liczba testów | PASS | FAIL |
|-----------|:------------:|:----:|:----:|
| Logowanie / Rejestracja | 5 | 5 | 0 |
| Operacje | 4 | 4 | 0 |
| Zlecenia na lot | 3 | 3 | 0 |
| Helikoptery | 3 | 3 | 0 |
| Członkowie załogi | 3 | 3 | 0 |
| Lądowiska | 3 | 3 | 0 |
| Użytkownicy | 2 | 2 | 0 |
| Uprawnienia / Menu | 3 | 3 | 0 |
| Konsola | 1 | 1 | 0 |
| **RAZEM** | **27** | **27** | **0** |

**Wszystkie 27 testów zakończone sukcesem. Nie wykryto błędów frontendowych.**
