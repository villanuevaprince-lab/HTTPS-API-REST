# Risposte — laboratorio 03.16

## Passo 6 — Richieste HTTP

Questi valori sono stati verificati con richieste dirette a JSONPlaceholder durante lo svolgimento; in **F12 → Network → Fetch/XHR** si possono vedere le richieste prodotte dall'app Angular e verificare Payload e Response.

| Azione | Metodo | URL | Stato |
| --- | --- | --- | --- |
| Carica un post con ID 1 | GET | `https://jsonplaceholder.typicode.com/posts/1` | 200 |
| Carica un post con ID 999 | GET | `https://jsonplaceholder.typicode.com/posts/999` | 404 |
| Carica tutti | GET | `https://jsonplaceholder.typicode.com/posts` | 200 |
| Invia un post | POST | `https://jsonplaceholder.typicode.com/posts` | 201, risposta con `id: 101` |

In modalità Offline una richiesta non arriva al server e `HttpErrorResponse.status` è `0` (da verificare nella scheda Network del proprio browser). A seconda del browser può comparire prima della POST una richiesta `OPTIONS` di controllo CORS.
