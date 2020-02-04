# Changelog

## 0.1.5

- Fixato logout quando la sessione utente non esiste.
- Cambiati index voci menu di default.

## 0.1.4

- Fix bug selettore lingua nel caso di una sola lingua.
- Modificata struttura CSS per semplificare personalizzazione dell'interfaccia.
- Aggiunta configurazione per impostare il mittente delle email.
- Aggiornamento documentazione.
- Corretto bug su schermata di gestione utenti in fase di aggiornamento permessi.

## 0.1.3

- Completamento supporto multilingua.
- Traduzione sistema in inglese.

## 0.1.2

- Inizio predisposizione al multilingua.

- Aggiunto metodo **serialize_authentication** su modello **User** che ritorna un hash con i dati dell'utente da ritornare nelle actions di login e di signup di **AuthenticationController**.

- Aggiunto sul comando **Authentication::SignupCommand** il parametro non obbligatorio **:privacy** per specificare la versione della privacy policy accettata dall'utente. IL SALVATAGGIO DELLA PRIVACY DEVE ESSERE COMPLETATO A LIVELLO DI EVENTI.

- Aggiunta configurazione **global_version** che permette di sepecificare la versione dell'applicazione. Se non viene impostata prende come valore di default la versione della gemma.

- Aggiunta componente front-end tile utilizzata in dashboard per mostrare shortcut cliccabili alle sezioni dell'applicazione.

- Vari fix relativi alla visualizzazione responsive.