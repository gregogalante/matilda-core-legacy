# Changelog

## 0.1.2

- Aggiunto metodo **serialize_authentication** su modello **User** che ritorna un hash con i dati dell'utente da ritornare nelle actions di login e di signup di **AuthenticationController**.

- Aggiunto sul comando **Authentication::SignupCommand** il parametro non obbligatorio **:privacy** per specificare la versione della privacy policy accettata dall'utente. IL SALVATAGGIO DELLA PRIVACY DEVE ESSERE COMPLETATO A LIVELLO DI EVENTI.

- Aggiunta configurazione **global_version** che permette di sepecificare la versione dell'applicazione. Se non viene impostata prende come valore di default la versione della gemma.