import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: '/',
    async lazy() {
      const { HomePage } = await import("./pages/Home")

      return {
        Component: HomePage
      }
    }
  },
  {
    path: '/room/:uuid',
    async lazy() {
      const { RoomPage } = await import("./pages/Room")

      return {
        Component: RoomPage
      }
    }
  }
])