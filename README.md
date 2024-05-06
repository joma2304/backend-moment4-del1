# API för inloggning och hantering av användare
Detta repo tillhör kursen dt207g - backend-baserad webbutveckling. Syftet är att skapa en webbtjänst för säker inloggning.

## Hashade lösenord
Lösenorden hashas för att säkerställa att de är lagrade på ett säkert sätt i databasen. Databasen som används är MongoDB. I den lagras användarnamn, lösenord samt när användaren skapades på följande sätt: 

```
  {
    "_id": "66262e78486cccd34f9e4b33",
    "username": "johan",
    "password": "$2b$10$lefiKjyp1HA/s0s/GQFky.rCN4JRfZyfq8l6oFaE7noWwWsf1D9Mu",
    "created": "2024-05-04T11:24:52.767+00:00",
    "__v": 0
  }
  ```

## Användning
Hur API:et används för olika ändamål:

|Metod  |Ändpunkt     |Beskrivning                                                                           |
|-------|-------------|--------------------------------------------------------------------------------------|
|POST    |/api/register     |För att lägga till en ny användare.                                             |
|POST    |/api/login |För att logga in men ett befintligt användar-konto.                                    |

## Inlogging och registrering
Vid inloggning och registrering skickas följande som JSON: 
```
  {
    "username": "johan",
    "password": "exempel123"
  }
  ```

  ## JWT Token
  När en användare har registrerat ett konto och loggat in på det så skickas en JWT Token med, detta sparas i localStorage under en viss tid. Så länge användaren har detta token i sin localStorage kommer den att komma åt en del av webbplatsen som använder denna webbtjänst som annars inte är tillgänglig.  




