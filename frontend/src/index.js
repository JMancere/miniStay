import React from "react";

import "./index.css";

import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
//import { BrowserRouter, createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { ModalProvider, Modal } from "./context/Modal";
import App from "./App";
import SpotDetail from './components/SpotDetail'
import SpotNew from "./components/SpotNew";
import Spots from "./components/Spots";
import SpotManage from "./components/SpotManage";

import configureStore from "./store";
import { restoreCSRF, csrfFetch } from "./store/csrf";
import * as sessionActions from "./store/session";
const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

function AppLayout() {
  return (
    <>
      <App />
      <Outlet />
      <Modal />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: 'spots',
    element: (<> <AppLayout />  </>)
    ,
    children: [
      {
        path: 'undefined',
        element:<Navigate to='/spots' replace={true} />
      },
      {
        path: '',
        element: <Spots />
      },
      {
        path: 'new',
        element: <SpotNew />
      },
      {
        path: ':id',
        element: <SpotDetail />
      },
      {
        path: 'current',
        element: <SpotManage />
      },
      {
        path: 'current/:id',
        element: <SpotDetail doManage={true}/>
      },
      {
        path: 'current/:id/edit',
        element: <SpotNew doEdit={true}/>
      },
    ]
  },
  {
    path: '*',
    element: <Navigate to='/spots' replace={true} />
  }
]);

// Wrap the application with the Modal provider and render the Modal component
// after the App component so that all the Modal content will be layered as
// HTML elements on top of the all the other HTML elements:
function Root() {
  return (
    <ModalProvider>
      <Provider store={store}>
      <RouterProvider router={router} />
        {/* <BrowserRouter>
          <App />
          <Modal />
        </BrowserRouter> */}
      </Provider>
    </ModalProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById("root")
);
