# Innometrics Frontend
Visualisation of users' working activity statistics

## Description
An intelligent, customizable dashboard to visualize and manipulate software engineering data based on requirements and preferences coming from the industry.

## Link
https://innometric.guru

## API
Backend source code: https://github.com/InnopolisUniversity/innometrics-backend

API: https://github.com/InnopolisUniversity/innometrics-backend/blob/master/documentation.yaml
(Access readable format by pasting `documentation.yaml` data to https://editor.swagger.io)


Stores information from:
- desktop clients and browser extensions about users' activities (which programs, tabs and for how long user has used it)
- remote repositories about developers' source code quality metrics

## Run
1) `npm i`
2) `npm run dev`

## Build and set up
1) `npm i`
2) Initialize environment variable `DOMAIN_ADDRESS` with address of the backend server 
(default is `https://innometric.guru`).
3) `npm run build`
4) Serve `dist` directory.

## Visualization
Infographics, charts, diagrams
