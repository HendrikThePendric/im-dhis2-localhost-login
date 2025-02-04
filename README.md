### About

- The purpose of this repo is to serve as a minimal reproduction path for logging in to a remote DHIS2 Core instance hosted on the Instance Manager from a DHIS2 app in development mode.
- The dev-server is a minimal reproduction example for the Vite/Webpack dev server that is usually serving an app while a developer is working on it locally. We can change various (CORS) settings here to get to an optimal setup for the actual dev server.
- The files in `/app` mimic exactly what we do in the `LoginModal` which is used in the [adapter](https://github.com/dhis2/app-platform/blob/master/adapter/src/components/LoginModal.js) in @dhis2/app-platform to login to a backend while working on an app. We can change request options/headers here to improve things.

### Expectations

- We probably have to also change things in DHIS2 Core and/or in the Intance Manager environment to get things to work correctly
- As Andreas mentioned _it is possible to develop the im_client on localhost with IM server_, so quite likely something needs to be done in DHIS2 Core to address the issue
- It will probably take some time initially to configure the dev-server so that it correctly mimics the Webpack/Vite setup, but I think that time investment will repay itself later on
