# InnoMetrics

Dockered version of https://github.com/DaryaLari/innometrics-frontend + https://github.com/InnopolisUniversity/innometrics-backend with client-side encryption

A Windows client data collector that implements client-side encryption is located here: https://github.com/Alexeyzhu/InnoMetricsWindowsCollector

You can see the manual of client-side encryption implementation [here](https://github.com/theMavl/FORKInnoMetrics/blob/master/Manual.pdf)

## Running
1. In `docker-compose.yml` at the `frontend` section set `DOMAIN_ADDRESS` to the backend actual address. For example: `'"http://10.90.137.225:8120"'` (all quotemarks must be preserved)
2. `docker-compose build`
3. `docker-compose start`
