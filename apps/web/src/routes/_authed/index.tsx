import { createFileRoute } from "@tanstack/react-router";
import { BoardPage } from "../../features/board/BoardPage";

export const Route = createFileRoute("/_authed/")({
  component: function Board() {
    const { api } = Route.useRouteContext();
    return <BoardPage api={api} />;
  },
});
