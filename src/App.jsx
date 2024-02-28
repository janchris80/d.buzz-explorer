import {
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom'
import Root from "./components/Root/index.jsx"
import ErrorPage from "./components/Error/index.jsx"
import AboutPage from "./components/Pages/About/index.jsx"
import HomePage from "./components/Pages/Home/index.jsx"
import SearchPage from "./components/Pages/Search/index.jsx"
import BlockPage from "./components/Pages/Block/index.jsx"
import Transaction from "./components/Pages/Transaction/index.jsx"
import AccountPage from "./components/Pages/Account/index.jsx"

// create router with JSX Route elements
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <HomePage />,
        index: true,
      },
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/b/:block",
        element: <BlockPage />,
      },
      {
        path: "/tx/:transaction",
        element: <Transaction />,
      },
      {
        path: "/:username",
        element: <AccountPage />,
      },
      {
        path: "/:username/:permlink",
        element: <AccountPage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
    ],
  },
])

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App
