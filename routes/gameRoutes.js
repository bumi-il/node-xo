import { createGame } from "../controllers/gameController"

const {Router} = require("express")

const gameRoutes = Router()

gameRoutes.post("/new",createGame)
gameRoutes.get("/:GameId",)
gameRoutes.post("/new",)
gameRoutes.post("/new",)

export default gameRoutes
